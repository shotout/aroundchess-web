"use client";

import { useEffect } from "react";

/**
 * Registers the asset service worker (public/sw.js), late and quietly.
 *
 * Two deliberate delays, both to keep this off the critical path: registration
 * waits for `load`, so it cannot compete with the resources the first paint
 * needs, and the precache warm waits for an idle callback after that. Nothing
 * here blocks rendering, and if neither ever fires the app behaves exactly as
 * it did before.
 *
 * Production only. A service worker in `next dev` fights hot reload for the
 * same URLs and produces confusing stale-module errors; to exercise this
 * locally, run a real build (`next build && next start`).
 */
export function ServiceWorkerHost() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;

    const warm = (registration: ServiceWorkerRegistration) => {
      const worker = registration.active ?? navigator.serviceWorker.controller;
      if (!worker) return;
      worker.postMessage({ type: "warm-precache" });
    };

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        if (cancelled) return;

        // Ask for the precache only once the browser says it has nothing
        // better to do. requestIdleCallback is missing on Safari, so fall
        // back to a plain timeout rather than skipping the warm there.
        const requestWarm = () => warm(registration);
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(requestWarm, { timeout: 10000 });
        } else {
          window.setTimeout(requestWarm, 3000);
        }

        // A worker installed for the first time is not `active` yet, so the
        // message above would go nowhere. Warm again once one takes control.
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!cancelled) warm(registration);
        });
      } catch {
        // A failed registration costs nothing: no offline assets, which is
        // where the app was before this existed.
      }
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", register);
    };
  }, []);

  return null;
}
