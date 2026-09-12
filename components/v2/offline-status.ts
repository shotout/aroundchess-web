import { isBrowserOnline } from "./offline-simulation";

/** Was this rejection a lost connection rather than a real answer from the
 *  server?
 *
 *  Worth separating because the two want opposite handling: a 401 or a 5xx is
 *  the backend saying no and belongs in a toast, while a dropped connection is
 *  retryable and belongs in the offline modal.
 *
 *  Two signals, because neither is enough on its own. navigator.onLine catches
 *  the plain case but reads true behind a captive portal or a dead uplink,
 *  where fetch still throws. And the thrown value is only ever a TypeError
 *  with a browser-specific message — apiRequest re-wraps everything as a bare
 *  Error (functions/api-client.ts), so there is no status or code left to test,
 *  only the text.
 */
export function isOfflineError(error: unknown): boolean {
  if (!isBrowserOnline()) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error ?? "");

  return [
    "failed to fetch", // Chrome / Edge
    "load failed", // Safari
    "networkerror when attempting to fetch resource", // Firefox
    "network request failed",
    "network error",
    // apiRequest's own wording when a token refresh cannot reach the server.
    "could not reach the server",
  ].some((fragment) => message.toLowerCase().includes(fragment));
}

/** Is the network actually reachable?
 *
 *  A real request, because navigator.onLine cannot see a captive portal or a
 *  dead uplink — it only reports whether the device is attached to something.
 *  Same-origin and cache-busted so it has to touch the network rather than
 *  being answered out of the HTTP cache (which, since the engine assets were
 *  given immutable caching, is a very real possibility here).
 *
 *  Any response counts, a 404 included: this asks whether the request got out,
 *  not what came back.
 */
export async function probeConnection(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!isBrowserOnline()) return false;
  try {
    await fetch(`/favicon.ico?connectivity=${Date.now()}`, {
      method: "HEAD",
      cache: "no-store",
    });
    return true;
  } catch {
    return false;
  }
}
