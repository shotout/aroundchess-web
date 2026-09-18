"use client";

import { useEffect, useRef } from "react";
import { useOnlineStatus } from "./useOnlineStatus";
import { probeConnection } from "../offline-status";
import { isBrowserOnline } from "../offline-simulation";

/**
 * How long to keep checking that the connection really is usable before
 * reloading anyway.
 *
 * `online` fires when the device attaches to a network, not when that network
 * can carry a request: the interface is up, but DHCP, DNS or the captive
 * portal may not be. A refetch sent on that edge loses the race, the catch in
 * every caller swallows it, and — because the offline panel unmounts on the
 * same render — the list settles on whatever it was holding before the outage
 * with no sign anything failed. That is the "came back online and the games
 * were still yesterday's" report.
 *
 * Cumulative waits, so the common case (already usable) costs nothing and the
 * slow case gives up after about seven seconds and tries regardless — a probe
 * that never answers is not proof the API cannot be reached.
 */
const PROBE_DELAYS_MS = [0, 500, 1500, 2000, 3000];

/**
 * Reload a list when the connection comes back, and report the online state
 * while you are at it.
 *
 * Without this, the inline offline panels lie on the way out. They render on
 * `!isOnline && nothingLoaded`, so the moment the connection returns that
 * condition stops matching and the panel is replaced by whatever state comes
 * next — which, with no rows loaded, is the *empty* state: "You have not
 * played any games yet". Reconnecting would therefore replace "you are
 * offline" with a confident and wrong claim about the user's data, and the
 * only way out was a manual reload.
 *
 * The refetch cannot live in the panel itself: the parent unmounts it on that
 * same render, so its effect never runs. It belongs to whoever owns the data.
 *
 * The refetch is unconditional because the panels are: while offline they
 * replace the list outright, so by the time the connection returns there is
 * always something to reload. It only ever fires on the offline -> online
 * edge, so a session that never dropped never refetches.
 *
 * @param refetch reloads the list.
 * @returns the current online state, so callers need only this one hook.
 */
export function useRefetchOnReconnect(refetch: () => void): boolean {
  const isOnline = useOnlineStatus();

  // Through a ref: refetch is a fresh closure on nearly every render, and the
  // effect must fire on the connection edge alone — not every time the parent
  // re-renders.
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  // The offline -> online edge, not the plain state: watching `isOnline`
  // itself would refire on every later render and refetch endlessly.
  const wasOnlineRef = useRef(true);

  useEffect(() => {
    const cameBackOnline = isOnline && !wasOnlineRef.current;
    wasOnlineRef.current = isOnline;
    if (!cameBackOnline) return;

    let cancelled = false;

    const refetchWhenReachable = async () => {
      for (const delay of PROBE_DELAYS_MS) {
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        if (cancelled) return;
        // Dropped out again while waiting: the next `online` starts this over.
        if (!isBrowserOnline()) return;
        if (await probeConnection()) break;
        if (cancelled) return;
      }
      if (!cancelled) refetchRef.current();
    };

    refetchWhenReachable();

    return () => {
      cancelled = true;
    };
  }, [isOnline]);

  return isOnline;
}
