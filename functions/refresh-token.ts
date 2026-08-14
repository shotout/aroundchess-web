import { useProfileStore } from "@/app/store/profile";
import { setPersistedCookie } from "@/utils/persisted-cookie";

let inFlight: Promise<RefreshOutcome> | null = null;

const EXPIRY_SKEW_SECONDS = 120;

const PROFILE_STORAGE_KEY = "Profile-storage";

const REFRESH_LOCK = "aroundchess-auth-refresh";

const ROTATION_RACE_GRACE_MS = 400;

const TRANSPORT_RETRY_MS = 600;

export type RefreshOutcome =
  | { status: "refreshed"; token: string }
  | { status: "rejected" }
  | { status: "unavailable" };

interface SessionPayload {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number | string;
  expires_in?: number | string;
}

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

  return readTokenExpiry(accessToken);
}

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

function hasUsableAccessToken(): boolean {
  const { sessionId } = useProfileStore.getState();
  const expiry = currentTokenExpiry();
  if (!sessionId || !expiry) return false;
  return Date.now() / 1000 < expiry - EXPIRY_SKEW_SECONDS;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    console.error("Could not reach the token refresh endpoint:", error);
    return { status: "unavailable" };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const rejected = response.status >= 400 && response.status < 500;
    return rejected ? { status: "rejected" } : { status: "unavailable" };
  }

  if (data?.success === false) return { status: "rejected" };

  const payload: SessionPayload = data?.data ?? data ?? {};
  if (!payload.access_token) {
    return { status: "unavailable" };
  }

  persistSession(payload.access_token, payload);
  return { status: "refreshed", token: payload.access_token };
}

async function runRefresh(): Promise<RefreshOutcome> {
  adoptStoredSession();
  if (hasUsableAccessToken()) {
    return { status: "refreshed", token: useProfileStore.getState().sessionId };
  }

  const refreshToken = useProfileStore.getState().refreshToken;
  if (!refreshToken) {
    return { status: "rejected" };
  }

  let lastSent = refreshToken;
  let outcome = await exchangeRefreshToken(lastSent);

  if (outcome.status === "unavailable") {
    await delay(TRANSPORT_RETRY_MS);
    lastSent = useProfileStore.getState().refreshToken || lastSent;
    outcome = await exchangeRefreshToken(lastSent);
  }

  if (outcome.status === "rejected") {
    await delay(ROTATION_RACE_GRACE_MS);
    adoptStoredSession();
    if (hasUsableAccessToken()) {
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

export function refreshSession(): Promise<RefreshOutcome> {
  if (inFlight) return inFlight;

  const pending = withCrossTabLock(runRefresh).catch(
    (error): RefreshOutcome => {
      console.error("Token refresh failed unexpectedly:", error);
      return { status: "unavailable" };
    }
  );

  inFlight = pending;
  pending.finally(() => {
    if (inFlight === pending) inFlight = null;
  });

  return pending;
}

export function refreshAccessToken(): Promise<string | null> {
  return refreshSession().then((outcome) =>
    outcome.status === "refreshed" ? outcome.token : null
  );
}
