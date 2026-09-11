"use client";

import { useEffect, useRef, useState } from "react";
import { simulatedRetrySeconds } from "../offline-simulation";

/** Seconds between automatic attempts — also the countdown that is displayed.
 *  Two minutes is long enough that a flaky connection is not hammered and
 *  short enough that someone who walks back into wifi is not left waiting. A
 *  restored connection does not wait for it: the `online` event retries
 *  immediately (see OfflineGateHost and PlayingPage). */
export const RETRY_INTERVAL_SECONDS = 120;

const formatCountdown = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/** The "Retrying in 1:59" clock behind every offline surface.
 *
 *  Shared by the modal and the inline panel so the two cannot drift apart —
 *  they are the same promise to the user, made in two places.
 *
 *  @param onRetry   one attempt. Callers are not expected to be idempotent-
 *                   safe against overlap; this hook never fires twice at once.
 *  @param isRetrying whether the caller's attempt is currently in flight.
 */
export function useRetryCountdown(onRetry: () => void, isRetrying: boolean) {
  // Shortened only when the offline simulation asks for it, which it can only
  // do outside production — see offline-simulation.ts. Read once per mount so
  // a cycle already in progress is not moved under the user.
  const intervalRef = useRef(simulatedRetrySeconds() ?? RETRY_INTERVAL_SECONDS);
  const interval = intervalRef.current;

  const [secondsLeft, setSecondsLeft] = useState(interval);

  /** Zero reached: an attempt is out and the countdown stays parked there
   *  until it reports back. Without the hold the display snapped straight
   *  back to 2:00 as the attempt began, so "Reconnecting..." was never shown
   *  beside a countdown near zero the way the design pairs them. */
  const [holding, setHolding] = useState(false);

  // Held in a ref so the countdown effect can stay mounted for the life of the
  // surface. onRetry is a fresh arrow function on every parent render, so an
  // effect that depended on it would tear down and restart the interval each
  // time — and the countdown would never actually reach zero.
  const onRetryRef = useRef(onRetry);
  onRetryRef.current = onRetry;

  /** A floor under how long an attempt is *shown* as running.
   *
   *  Some attempts finish in well under a frame — probeConnection answers
   *  false on the offline reading alone, without issuing a request — so
   *  without this the button flicks to "Reconnecting..." and back faster than
   *  the eye catches, and pressing it reads as having done nothing at all.
   *  This is the one case where a wait is the honest thing to show: the
   *  attempt really was made, and really did fail. */
  const [showingAttempt, setShowingAttempt] = useState(false);
  const attemptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (attemptTimerRef.current) clearTimeout(attemptTimerRef.current);
    },
    []
  );

  // Through a ref so the countdown effect below can call it without taking it
  // as a dependency and restarting itself on every render.
  const beginAttemptRef = useRef<() => void>(() => {});
  beginAttemptRef.current = () => {
    if (attemptTimerRef.current) clearTimeout(attemptTimerRef.current);
    setShowingAttempt(true);
    attemptTimerRef.current = setTimeout(() => setShowingAttempt(false), 700);
    onRetryRef.current();
  };

  useEffect(() => {
    if (isRetrying || holding) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRetrying, holding]);

  // Firing from its own effect rather than from inside the setState updater
  // above: updaters must stay pure, and StrictMode runs them twice in
  // development, which would send two attempts per tick.
  useEffect(() => {
    if (secondsLeft !== 0 || holding) return;
    setHolding(true);
    beginAttemptRef.current();
  }, [secondsLeft, holding]);

  // Release the hold and start the next cycle once the attempt is done. The
  // delay doubles as a safety net for a caller that never reports an attempt
  // in flight at all — without it the countdown would sit at 0:00 for good.
  useEffect(() => {
    if (!holding || isRetrying) return;
    const id = setTimeout(() => {
      setSecondsLeft(interval);
      setHolding(false);
    }, 1200);
    return () => clearTimeout(id);
  }, [holding, isRetrying, interval]);

  /** Either an attempt is in flight or the countdown is parked waiting for one
   *  to report back. Both read the same on screen, so the button does not
   *  flicker back to its idle colour between the two. */
  const busy = isRetrying || holding || showingAttempt;

  const retryNow = () => {
    if (busy) return;
    setSecondsLeft(interval);
    beginAttemptRef.current();
  };

  return { countdown: formatCountdown(secondsLeft), busy, retryNow };
}
