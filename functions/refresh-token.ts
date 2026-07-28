import { useProfileStore } from "@/app/store/profile";
import { setPersistedCookie } from "@/utils/persisted-cookie";

/**
 * Keeps the session alive by exchanging the stored refresh token for a fresh
 * access token, so an expiry doesn't kick the user out to /login.
 *
 * The access token is only valid for `expires_in` (1 hour), so this runs both
 * proactively (before a request, once the token is nearly stale) and reactively
 * (on a 401).
 *
 * Refresh tokens are rotated by the backend — each one is good for a single
 * exchange — and the app fires many requests in parallel, so all concurrent
 * callers must share one in-flight refresh instead of each spending the token.
 * `inFlight` lives at module scope, not in a hook, so every `useApiClient()`
 * instance shares it.
 */
let inFlight: Promise<string | null> | null = null;

/** Refresh this many seconds before the token actually expires. */
const EXPIRY_SKEW_SECONDS = 120;

interface SessionPayload {
  access_token?: string;
  refresh_token?: string;
  /** Unix seconds. */
  expires_at?: number | string;
  /** Seconds from now. */
  expires_in?: number | string;
}

function resolveExpiresAt(payload: SessionPayload): number {
  const expiresAt = Number(payload.expires_at);
  if (Number.isFinite(expiresAt) && expiresAt > 0) return expiresAt;

  const expiresIn = Number(payload.expires_in);
  if (Number.isFinite(expiresIn) && expiresIn > 0) {
    return Math.floor(Date.now() / 1000) + expiresIn;
  }

  // Unknown expiry — leave it at 0 so we fall back to the reactive 401 path
  // rather than refreshing on every single request.
  return 0;
}

export function persistSession(accessToken: string, payload: SessionPayload = {}) {
  const { setSessionId, setRefreshToken, setTokenExpiresAt } =
    useProfileStore.getState();

  setSessionId(accessToken);
  setPersistedCookie("token", accessToken, 365);
  setTokenExpiresAt(resolveExpiresAt(payload));
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
  const { tokenExpiresAt, refreshToken, sessionId } =
    useProfileStore.getState();

  if (!sessionId || !refreshToken || !tokenExpiresAt) return false;
  return Date.now() / 1000 >= tokenExpiresAt - EXPIRY_SKEW_SECONDS;
}

export function refreshAccessToken(): Promise<string | null> {
  if (inFlight) return inFlight;

  const pending = (async () => {
    const refreshToken = useProfileStore.getState().refreshToken;
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${process.env.BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      // The API wraps some failures in a 200 body, so check both.
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success === false) return null;

      const payload: SessionPayload = data?.data ?? data ?? {};
      if (!payload.access_token) return null;

      persistSession(payload.access_token, payload);
      return payload.access_token;
    } catch (error) {
      console.error("Failed to refresh the access token:", error);
      return null;
    }
  })();

  inFlight = pending;
  // Release the lock once settled so a later expiry can refresh again.
  pending.finally(() => {
    if (inFlight === pending) inFlight = null;
  });

  return pending;
}
