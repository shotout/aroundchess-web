"use client";

import { useEffect, useRef } from "react";
import { useOnlineStatus } from "./useOnlineStatus";

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
    if (cameBackOnline) refetchRef.current();
  }, [isOnline]);

  return isOnline;
}
