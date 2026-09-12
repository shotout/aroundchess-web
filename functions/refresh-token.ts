import { useProfileStore } from "@/app/store/profile";
import { setPersistedCookie } from "@/utils/persisted-cookie";

/**
 * Keeps the session alive by exchanging the stored refresh token for a fresh
 * access token, so an expiry doesn't kick the user out to /login.
 *
 * The access token is only valid for `expires_in` (1 hour), so this runs
 * proactively (before a request once the token is nearly stale, and from the
 * keep-alive watcher on focus/visibility) and reactively (on a 401).
 *
 * Two rules matter for not logging people out by accident:
 *
 *  1. A failed exchange is not the same as an invalid session. Only an explicit
 *     rejection from the backend ("rejected") may end the session; a network
 *     error, a 5xx or a rate limit is "unavailable" — the session stays and the
 *     next request tries again.
 *  2. A token the backend has just refused is dead regardless of what its own
 *     `exp` claim says — a session can be ended early (signed out elsewhere,
 *     marked inactive, backend restarted). Callers reacting to a 401 pass that
 *     token as `staleToken` so the "already usable" short-circuit can't hand it
 *     straight back to them, which would replay the same refused token and
 *     surface the expiry as a hard error with no way back.
 *  3. Refresh tokens are rotated by the backend — each one is good for a single
 *     exchange — so concurrent refreshes must not each spend the token.
 *     `inFlight` shares one exchange within a tab, a Web Lock serialises tabs,
 *     and whatever another tab already stored is adopted before spending ours.
 */
let inFlight: Promise<RefreshOutcome> | null = null;

/** Refresh this many seconds before the token actually expires. */
const EXPIRY_SKEW_SECONDS = 120;

/** Key zustand's persist middleware uses for the profile store. */
const PROFILE_STORAGE_KEY = "Profile-storage";

/** Name of the cross-tab lock guarding the refresh-token exchange. */
const REFRESH_LOCK = "aroundchess-auth-refresh";

/** How long to wait for a peer tab's rotation to land before giving up. */
const ROTATION_RACE_GRACE_MS = 400;

/** Pause before retrying an exchange that failed for a transport reason. */
const TRANSPORT_RETRY_MS = 600;

export type RefreshOutcome =
  /** A usable access token is in the store (freshly minted or adopted). */
  | { status: "refreshed"; token: string }
  /** The backend refused the refresh token — the session is over. */
  | { status: "rejected" }
  /** The exchange could not be completed (offline, 5xx, …) — keep the session. */
  | { status: "unavailable" };

interface SessionPayload {
  access_token?: string;
  refresh_token?: string;
  /** Unix seconds. */
  expires_at?: number | string;
  /** Seconds from now. */
  expires_in?: number | string;
}

/** `exp` out of a JWT access token, in unix seconds; 0 when unreadable.
 *  The backend doesn't always send expires_in/expires_at, and without an expiry
 *  nothing can refresh *before* a request fails — so read it off the token. */
function readTokenExpiry(accessToken: string): number {
  const payload = accessToken?.split(".")[1];
  if (!payload) return 0;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const exp = Number(JSON.parse(atob(padded))?.exp);
    return Number.isFinite(exp) && exp > 0 ? exp : 0;
  } catch {
    return 0;
  }
}

function resolveExpiresAt(payload: SessionPayload, accessToken: string): number {
  const expiresAt = Number(payload.expires_at);
  if (Number.isFinite(expiresAt) && expiresAt > 0) return expiresAt;

  const expiresIn = Number(payload.expires_in);
  if (Number.isFinite(expiresIn) && expiresIn > 0) {
    return Math.floor(Date.now() / 1000) + expiresIn;
  }

  // Last resort before giving up on proactive refresh entirely.
  return readTokenExpiry(accessToken);
}

/** The access token's expiry, falling back to the token's own `exp` claim so
 *  sessions stored before the expiry was tracked still refresh proactively. */
function currentTokenExpiry(): number {
  const { tokenExpiresAt, sessionId } = useProfileStore.getState();
  if (tokenExpiresAt) return tokenExpiresAt;
  return sessionId ? readTokenExpiry(sessionId) : 0;
}

export function persistSession(accessToken: string, payload: SessionPayload = {}) {
  const { setSessionId, setRefreshToken, setTokenExpiresAt } =
    useProfileStore.getState();

  setSessionId(accessToken);
  setPersistedCookie("token", accessToken, 365);
  setTokenExpiresAt(resolveExpiresAt(payload, accessToken));
  if (payload.refresh_token) {
    setRefreshToken(payload.refresh_token);
  }
}

export function clearSession() {
  const { setSessionId, setRefreshToken, setTokenExpiresAt } =
    useProfileStore.getState();

  setSessionId("");
  setRefreshToken("");
  setTokenExpiresAt(0);
  setPersistedCookie("token", "", 0);
}

/** True when the access token is expired or about to be, and can be renewed. */
export function shouldRefreshBeforeRequest(): boolean {
  const { refreshToken, sessionId } = useProfileStore.getState();

  if (!sessionId || !refreshToken) return false;

  const expiry = currentTokenExpiry();
  if (!expiry) return false;
  return Date.now() / 1000 >= expiry - EXPIRY_SKEW_SECONDS;
}

interface StoredSession {
  sessionId: string;
  refreshToken: string;
  tokenExpiresAt: number;
}

/** The persisted profile session as it stands in localStorage right now —
 *  which is where another tab's rotation shows up, since zustand's persist
 *  middleware doesn't sync store instances between tabs. */
function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw)?.state ?? {};
    return {
      sessionId: typeof state.sessionId === "string" ? state.sessionId : "",
      refreshToken:
        typeof state.refreshToken === "string" ? state.refreshToken : "",
      tokenExpiresAt: Number(state.tokenExpiresAt) || 0,
    };
  } catch {
    return null;
  }
}

/** Pull in a session another tab refreshed. Returns true when this tab's store
 *  was moved forward. */
export function adoptStoredSession(): boolean {
  const stored = readStoredSession();
  if (!stored?.sessionId || !stored.refreshToken) return false;

  const { sessionId, tokenExpiresAt } = useProfileStore.getState();
  const isNewer =
    stored.sessionId !== sessionId && stored.tokenExpiresAt >= tokenExpiresAt;
  if (!isNewer) return false;

  persistSession(stored.sessionId, {
    refresh_token: stored.refreshToken,
    expires_at: stored.tokenExpiresAt || undefined,
  });
  return true;
}

/** True when the store holds an access token with life left in it.
 *
 *  `staleToken` is a token the caller has just had refused. The expiry claim is
 *  only a hint about when the backend *will* stop accepting a token; a 401 is
 *  proof that it already has, and it wins. Without this, a session ended early
 *  by the backend can never be renewed: the short-circuit keeps returning the
 *  refused token as "refreshed" until its clock-side expiry finally passes. */
function hasUsableAccessToken(staleToken?: string): boolean {
  const { sessionId } = useProfileStore.getState();
  const expiry = currentTokenExpiry();
  if (!sessionId || !expiry) return false;
  if (staleToken && sessionId === staleToken) return false;
  return Date.now() / 1000 < expiry - EXPIRY_SKEW_SECONDS;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** One POST /auth/refresh. Classifies the failure instead of collapsing every
 *  outcome into "signed out". */
async function exchangeRefreshToken(
  refreshToken: string
): Promise<RefreshOutcome> {
  let response: Response;
  try {
    response = await fetch(`${process.env.BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (error) {
    // Offline, DNS, a sleeping laptop's dropped socket — the refresh token is
    // very probably still fine, so keep the session and try again later.
    console.error("Could not reach the token refresh endpoint:", error);
    return { status: "unavailable" };
  }

  // The API wraps some failures in a 200 body, so check both.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // 4xx = the backend judged the token; anything else = infrastructure.
    const rejected = response.status >= 400 && response.status < 500;
    return rejected ? { status: "rejected" } : { status: "unavailable" };
  }

  if (data?.success === false) return { status: "rejected" };

  const payload: SessionPayload = data?.data ?? data ?? {};
  if (!payload.access_token) {
    // A 200 without a token is a backend contract break, not a dead session.
    return { status: "unavailable" };
  }

  persistSession(payload.access_token, payload);
  return { status: "refreshed", token: payload.access_token };
}

async function runRefresh(staleToken?: string): Promise<RefreshOutcome> {
  // Another tab may have rotated the token while we waited for the lock.
  adoptStoredSession();
  if (hasUsableAccessToken(staleToken)) {
    return { status: "refreshed", token: useProfileStore.getState().sessionId };
  }

  const refreshToken = useProfileStore.getState().refreshToken;
  if (!refreshToken) {
    // Nothing to renew with (a pre-refresh-token session, or an SSO callback
    // that arrived without one) — there is no way back from an expired access
    // token, so this really is the end of the session.
    return { status: "rejected" };
  }

  // Track what we actually put on the wire: a rotated token must never be
  // sent twice, or the second attempt burns a token the backend already used.
  let lastSent = refreshToken;
  let outcome = await exchangeRefreshToken(lastSent);

  if (outcome.status === "unavailable") {
    // One retry covers the wake-from-sleep case where the first request dies
    // before the network is actually back.
    await delay(TRANSPORT_RETRY_MS);
    lastSent = useProfileStore.getState().refreshToken || lastSent;
    outcome = await exchangeRefreshToken(lastSent);
  }

  if (outcome.status === "rejected") {
    // Possible rotation race: a tab without the lock (no Web Locks support)
    // may have just spent this token and stored the replacement. Give its
    // write a moment to land, then retry with whatever is stored now.
    await delay(ROTATION_RACE_GRACE_MS);
    adoptStoredSession();
    if (hasUsableAccessToken(staleToken)) {
      return {
        status: "refreshed",
        token: useProfileStore.getState().sessionId,
      };
    }
    const rotated = useProfileStore.getState().refreshToken;
    if (rotated && rotated !== lastSent) {
      outcome = await exchangeRefreshToken(rotated);
    }
  }

  return outcome;
}

function withCrossTabLock(
  run: () => Promise<RefreshOutcome>
): Promise<RefreshOutcome> {
  const locks = (globalThis.navigator as any)?.locks;
  if (!locks?.request) return run();

  // Serialises the exchange between tabs so two of them can't spend the same
  // rotated token. If the lock itself can't be taken (insecure context, an
  // unsupported implementation) fall back to running unlocked — but never
  // re-run an exchange that already started, or we'd spend two tokens.
  let started = false;
  const guarded = () => {
    started = true;
    return run();
  };
  return locks.request(REFRESH_LOCK, guarded).catch((error: unknown) => {
    if (started) throw error;
    return run();
  });
}

/** Start one exchange, or join the one already running. */
function startRefresh(staleToken?: string): Promise<RefreshOutcome> {
  // A peer that got in first is running an exchange that began *after* our
  // rejection, so its result is good for us too.
  if (inFlight) return inFlight;

  // Never rejects: callers decide what to do about the session, and an
  // unexpected throw must not read as "the refresh token is dead".
  const pending = withCrossTabLock(() => runRefresh(staleToken)).catch(
    (error): RefreshOutcome => {
      console.error("Token refresh failed unexpectedly:", error);
      return { status: "unavailable" };
    }
  );

  inFlight = pending;
  // Release the lock once settled so a later expiry can refresh again.
  pending.finally(() => {
    if (inFlight === pending) inFlight = null;
  });

  return pending;
}

/** Renew the access token, sharing one exchange between concurrent callers.
 *  Inspect `status` before ending a session — only "rejected" means the
 *  backend refused the refresh token.
 *
 *  Pass `staleToken` when reacting to a 401: it is the token that was refused,
 *  and it stops the exchange handing that same token back as "refreshed". */
export function refreshSession(
  options: { staleToken?: string } = {}
): Promise<RefreshOutcome> {
  const { staleToken } = options;

  // An exchange already in flight may have started *before* our token was
  // refused, in which case it can settle by returning that very token. Wait
  // for it — it might genuinely mint a new one — and only then insist on a
  // real exchange.
  if (inFlight && staleToken) {
    const preceding = inFlight;
    return preceding.then((outcome) =>
      outcome.status === "refreshed" && outcome.token === staleToken
        ? startRefresh(staleToken)
        : outcome
    );
  }

  return startRefresh(staleToken);
}

/** Back-compat wrapper: the new access token, or null when it could not be
 *  renewed for any reason. Prefer refreshSession() where the difference
 *  between "rejected" and "unavailable" decides whether to sign out. */
export function refreshAccessToken(): Promise<string | null> {
  return refreshSession().then((outcome) =>
    outcome.status === "refreshed" ? outcome.token : null
  );
}
