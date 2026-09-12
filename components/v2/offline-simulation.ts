"use client";

/**
 * A switch that makes the app believe it is offline, so the offline flows can
 * be exercised without touching a real connection.
 *
 * It does two things, and needs both. Faking the browser's online *signal*
 * covers everything that reacts to it — the banner, the inline panels, the
 * analyze gate — but the end-of-game sync modal is not signal-driven: it
 * appears because a request actually failed. So this also makes fetch reject
 * the way a dropped connection does, and the two together reproduce the real
 * thing rather than a convincing-looking half of it.
 *
 * What it deliberately does NOT block is anything that never went through
 * fetch to begin with: the Stockfish workers, move sounds, and <img> loads. So
 * a simulated-offline game keeps playing against the AI exactly as a real one
 * does — which is the behaviour worth checking.
 *
 * Off unless it is asked for. In production builds every entry point below
 * returns early on the availability check, so nothing here can be reached by a
 * real user unless NEXT_PUBLIC_ENABLE_OFFLINE_SIM is deliberately set.
 */

const STORAGE_KEY = "aroundchess:simulate-offline";
const RETRY_STORAGE_KEY = "aroundchess:simulate-offline-retry";

/** Whether the switch exists at all.
 *
 *  Development always; a deployed build only when the env var is set, so a
 *  staging deploy can be tested without shipping the switch to production. */
export function isOfflineSimulationAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_OFFLINE_SIM === "true"
  );
}

let simulated = false;

/** The real fetch, held while ours stands in its place. Also the "are we
 *  patched?" flag — patching twice would lose the original for good. */
let realFetch: typeof window.fetch | null = null;

function blockFetch() {
  if (realFetch) return;
  // Captures whatever is installed now, which is install-auth-fetch's wrapper
  // rather than the native fetch. Restoring puts that exact function back, so
  // the auth wrapper survives a simulation being switched on and off.
  realFetch = window.fetch;
  window.fetch = (() =>
    // The message matters: this is what Chrome throws, and what isOfflineError
    // matches on. A generic Error would take a different branch and be
    // reported as a server problem instead.
    Promise.reject(new TypeError("Failed to fetch"))) as typeof window.fetch;
}

function restoreFetch() {
  if (!realFetch) return;
  window.fetch = realFetch;
  realFetch = null;
}

export function isSimulatedOffline(): boolean {
  return simulated;
}

/** The one place the app asks whether it has a connection.
 *
 *  Everything that used to read navigator.onLine directly reads this instead,
 *  so the simulation cannot be true in one place and false in another. */
export function isBrowserOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  if (simulated) return false;
  return navigator.onLine;
}

/** Turn the simulation on or off.
 *
 *  Dispatches the browser's own offline/online events rather than introducing
 *  a private notification channel: useOnlineStatus already listens for those,
 *  so the simulation arrives through exactly the path a real disconnect takes.
 */
export function setSimulatedOffline(on: boolean): void {
  if (!isOfflineSimulationAvailable()) return;
  if (simulated === on) return;
  simulated = on;

  if (on) {
    blockFetch();
  } else {
    restoreFetch();
  }

  try {
    if (on) sessionStorage.setItem(STORAGE_KEY, "1");
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode, or site data blocked: the switch still works for this
    // page, it just will not survive a reload.
  }

  window.dispatchEvent(new Event(on ? "offline" : "online"));
  notify();
}

/** Shorten the retry countdown while testing, so a two-minute cycle does not
 *  have to be sat through. Null means use the real interval. */
export function simulatedRetrySeconds(): number | null {
  if (!isOfflineSimulationAvailable()) return null;
  try {
    const raw = sessionStorage.getItem(RETRY_STORAGE_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 3 ? value : null;
  } catch {
    return null;
  }
}

function setSimulatedRetrySeconds(seconds: number | null): void {
  if (!isOfflineSimulationAvailable()) return;
  try {
    if (seconds === null) sessionStorage.removeItem(RETRY_STORAGE_KEY);
    else sessionStorage.setItem(RETRY_STORAGE_KEY, String(seconds));
  } catch {
    /* see setSimulatedOffline */
  }
}

// Subscribers for the on-screen badge, which has to re-render when the switch
// is thrown from the console rather than from its own button.
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToOfflineSimulation(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let installed = false;

/** Read the switch's initial position and expose the console API.
 *
 *  Called once from OfflineSimulationHost. Reads, in order: `?simulateOffline`
 *  in the URL, then sessionStorage — so a link can turn it on, and a reload
 *  keeps it on. Note that the reload itself succeeds, unlike a real outage
 *  (there is no service worker), which is what makes the restore path
 *  testable at all.
 */
export function installOfflineSimulation(): void {
  if (installed || !isOfflineSimulationAvailable()) return;
  installed = true;

  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("simulateOffline");
  const retryFromUrl = params.get("offlineRetry");

  if (retryFromUrl !== null) {
    const value = Number(retryFromUrl);
    setSimulatedRetrySeconds(Number.isFinite(value) && value >= 3 ? value : null);
  }

  let shouldStart = false;
  if (fromUrl !== null) {
    shouldStart = fromUrl !== "0" && fromUrl !== "false";
  } else {
    try {
      shouldStart = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      shouldStart = false;
    }
  }

  (window as any).__offline = {
    on: () => setSimulatedOffline(true),
    off: () => setSimulatedOffline(false),
    toggle: () => setSimulatedOffline(!simulated),
    isOn: () => simulated,
    /** Shorten the retry countdown, in seconds (minimum 3). Pass nothing to
     *  restore the real two minutes. Takes effect on the next surface that
     *  mounts, so close and reopen the modal or panel after changing it. */
      retryAfter: (seconds?: number) =>
      setSimulatedRetrySeconds(
        typeof seconds === "number" ? Math.max(3, Math.round(seconds)) : null
      ),
    help: () =>
      console.info(
        [
          "__offline.on()          simulate a dropped connection",
          "__offline.off()         restore it",
          "__offline.toggle()      flip it",
          "__offline.isOn()        current state",
          "__offline.retryAfter(10) shorten the retry countdown to 10s",
          "__offline.retryAfter()  back to the real 2 minutes",
          "",
          "Also: ?simulateOffline=1 in the URL, and ?offlineRetry=10.",
          "Survives a reload in this tab; a new tab starts online.",
        ].join("\n")
      ),
  };

  if (shouldStart) setSimulatedOffline(true);
}
