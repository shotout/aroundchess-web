"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { useOfflineGate } from "@/app/store/offlineGate";
import { useDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";
import { isPlaygroundTourPending } from "@/components/v2/playground-tour-gate";
import { NpsFeedbackModal } from "@/components/v2/nps-feedback-modal";
import {
  openNpsFeedbackModal,
  useNpsFeedbackModal,
} from "@/components/v2/hooks/useNpsFeedbackModal";
import { areDebugHooksAvailable } from "@/components/v2/debug-hooks";

/** Shows the NPS layover once the backend says eligible and the screen is clear. */

/** Routes the layover must never interrupt. */
const BLOCKED_ROUTE_PREFIXES = [
  "/playground/play-vs-ai/playing",
  "/playground/two-player",
  "/playground/computer",
  "/playground/online-multiplayer",
  "/playground/puzzle",
  "/playground/board-vision",
  "/playground/endgame-training",
  "/puzzle",
  "/login",
  "/register",
  "/forgot-password",
  "/change-password",
  "/auth",
  "/chess-knowledge",
  "/delete-account",
  "/cookies-consent",
];

/** Polled, because the layovers in the way have half a dozen unrelated owners. */
const SCREEN_POLL_MS = 600;
const SCREEN_POLL_GIVE_UP_MS = 45_000;

function isBlockedRoute(pathname: string | null): boolean {
  if (!pathname) return true;
  return BLOCKED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** The DOM probe catches every dialog; the store checks catch the tour, which is not one. */
function isScreenBusy(): boolean {
  if (typeof document === "undefined") return true;

  if (document.querySelector('[role="dialog"], [aria-modal="true"]')) {
    return true;
  }
  if (isPlaygroundTourPending()) return true;
  if (useDayStreakModal.getState().request) return true;
  if (useOfflineGate.getState().open) return true;

  return false;
}

export function NpsFeedbackHost() {
  const pathname = usePathname();
  const { sessionId } = useProfileStore();
  const { getNpsStatus, postNpsShown, postNpsFeedback, postNpsDismiss } =
    useApiClient();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Console hook / ?npsDemo=, which bypasses every gate below.
  const request = useNpsFeedbackModal((state) => state.request);
  const clearRequest = useNpsFeedbackModal((state) => state.close);

  /** Preview: nothing is sent, so it cannot spend the real once-per-90-days turn. */
  const isPreview = request?.preview === true;
  const isOpen = open || request !== null;

  const shownRef = useRef(false);
  const askedRef = useRef(false);
  const prevPathRef = useRef<string | null>(null);
  const waitRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // In a ref: useApiClient returns new identities per render, restarting the effect.
  const apiRef = useRef({ getNpsStatus, postNpsShown });
  apiRef.current = { getNpsStatus, postNpsShown };

  // A non-preview request is a real prompt, so it starts the clock.
  useEffect(() => {
    if (request && !request.preview) {
      apiRef.current.postNpsShown({ platform: "web" }).catch(() => {});
    }
  }, [request]);

  // Console hooks; absent from production builds - see debug-hooks.ts.
  useEffect(() => {
    if (!areDebugHooksAvailable()) return;

    if (new URLSearchParams(window.location.search).get("npsDemo") !== null) {
      openNpsFeedbackModal({ preview: true });
    }

    (window as any).__nps = {
      /** Inert: nothing is sent. */
      show: () => openNpsFeedbackModal({ preview: true }),
      /** Real: POSTs /shown, so it spends the 90-day cooldown. */
      showLive: () => openNpsFeedbackModal(),
      close: () => useNpsFeedbackModal.getState().close(),
      /** Read-only; changes nothing. */
      status: async () => {
        try {
          const res: any = await apiRef.current.getNpsStatus();
          console.info(res?.data ?? res);
          return res?.data ?? res;
        } catch (error) {
          console.warn("__nps.status() failed:", error);
          return null;
        }
      },
      help: () =>
        console.info(
          [
            "__nps.show()      open the layover as a preview (sends nothing)",
            "__nps.showLive()  open it for real (starts the 3-month cooldown)",
            "__nps.close()     close it",
            "__nps.status()    log GET /v4/nps/status (read-only)",
            "",
            "Also: ?npsDemo=1 in the URL, same as show().",
            "Real rules: 3 finished VS-AI games, then once per 90 days.",
          ].join("\n")
        ),
    };
  }, []);

  const clearWait = useCallback(() => {
    if (waitRef.current) {
      clearInterval(waitRef.current);
      waitRef.current = null;
    }
  }, []);

  useEffect(() => {
    const previous = prevPathRef.current;
    prevPathRef.current = pathname;

    // Signed out: forget everything, so the next sign-in decides afresh.
    if (!sessionId) {
      shownRef.current = false;
      askedRef.current = false;
      clearWait();
      setOpen(false);
      return;
    }

    if (shownRef.current || isBlockedRoute(pathname)) return;

    // Re-ask after leaving the board: that is where the 3rd game just finished.
    const leftTheBoard = isBlockedRoute(previous);
    if (askedRef.current && !leftTheBoard) return;
    askedRef.current = true;

    let cancelled = false;

    (async () => {
      let shouldShow = false;
      try {
        const res: any = await apiRef.current.getNpsStatus();
        shouldShow = res?.data?.shouldShow === true;
      } catch {
        // v5-only endpoints, absent on some environments: a 404 here is ordinary.
        return;
      }
      if (cancelled || !shouldShow) return;

      // Eligible; now wait for the screen, the rule the backend cannot enforce.
      const startedAt = Date.now();
      clearWait();
      const tryOpen = () => {
        if (cancelled || shownRef.current) {
          clearWait();
          return;
        }
        if (Date.now() - startedAt > SCREEN_POLL_GIVE_UP_MS) {
          clearWait();
          // Left un-shown; leaving the board again re-checks.
          return;
        }
        if (isBlockedRoute(window.location.pathname) || isScreenBusy()) return;

        clearWait();
        shownRef.current = true;
        setOpen(true);
        // On the render that makes it visible: this starts the 90-day clock.
        apiRef.current.postNpsShown({ platform: "web" }).catch(() => {});
      };

      tryOpen();
      if (!shownRef.current && !cancelled) {
        waitRef.current = setInterval(tryOpen, SCREEN_POLL_MS);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, pathname, clearWait]);

  useEffect(() => clearWait, [clearWait]);

  const handleClose = useCallback(() => {
    setOpen(false);
    clearRequest();
    if (isPreview) return;
    postNpsDismiss({ platform: "web" }).catch(() => {});
  }, [postNpsDismiss, clearRequest, isPreview]);

  const handleSubmit = useCallback(
    async (score: number, comment: string) => {
      if (isPreview) {
        setOpen(false);
        clearRequest();
        return;
      }
      setSubmitting(true);
      try {
        await postNpsFeedback({
          score,
          ...(comment.trim() ? { comment: comment.trim() } : {}),
          platform: "web",
        });
      } catch {
        // The cooldown already runs from /shown; not worth trapping the user.
      } finally {
        setSubmitting(false);
        setOpen(false);
        clearRequest();
      }
    },
    [postNpsFeedback, clearRequest, isPreview]
  );

  if (!isOpen) return null;

  return (
    <NpsFeedbackModal
      onSubmit={handleSubmit}
      onClose={handleClose}
      submitting={submitting}
    />
  );
}
