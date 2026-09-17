"use client";

/**
 * A switch that makes the app believe it is offline, for testing.
 *
 * Fakes the online signal AND makes fetch reject, because the end-of-game sync
 * modal is not signal-driven. Deliberately does NOT block Stockfish workers,
 * sounds or <img> loads, so a simulated-offline game keeps playing.
 */

import { areDebugHooksAvailable } from "./debug-hooks";

const STORAGE_KEY = "aroundchess:simulate-offline";
const RETRY_STORAGE_KEY = "aroundchess:simulate-offline-retry";

/** Dev always; a deploy only with a flag set — see debug-hooks.ts. */
export function isOfflineSimulationAvailable(): boolean {
  return areDebugHooksAvailable();
}

let simulated = false;

/** The real fetch, and the "are we patched?" flag — patching twice loses it. */
let realFetch: typeof window.fetch | null = null;

function blockFetch() {
  if (realFetch) return;
  // Captures install-auth-fetch's wrapper, not native fetch, so it survives.
  realFetch = window.fetch;
  window.fetch = (() =>
    // This exact message is what isOfflineError matches on.
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

/** The one place the app asks whether it has a connection. */
export function isBrowserOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  if (simulated) return false;
  return navigator.onLine;
}

/** Dispatches the browser's own events, so it arrives by the real path. */
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
    // Blocked storage: works for this page, but will not survive a reload.
  }

  window.dispatchEvent(new Event(on ? "offline" : "online"));
  notify();
}

/** Shorten the retry countdown while testing. Null means the real interval. */
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

// For the on-screen badge, which must re-render when thrown from the console.
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeToOfflineSimulation(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let installed = false;

/** Reads `?simulateOffline` then sessionStorage, and exposes `__offline`. */
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
    /** Seconds, minimum 3; nothing restores the real 2 minutes. Applies to the
     *  next surface that mounts, so reopen the modal or panel after changing. */
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
