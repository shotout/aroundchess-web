"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/app/store/profile";
import {
  adoptStoredSession,
  refreshSession,
  shouldRefreshBeforeRequest,
} from "@/functions/refresh-token";

/** How often an open tab checks whether its access token is going stale. */
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Keeps a logged-in session alive without the user having to trigger it.
 *
 * Renewal used to happen only as a side effect of an API call, so an idle tab
 * sat on an expired token and the first request after the user came back was
 * the one that decided whether they stayed logged in. This renews ahead of that
 * request — on mount, on focus/visibility, when the network comes back, and on
 * a slow timer — and adopts a session another tab refreshed.
 */
export function SessionKeepAlive() {
  const sessionId = useProfileStore((s) => s.sessionId);
  const hydrated = useProfileStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated || !sessionId) return;

    const renewIfStale = () => {
      // A peer tab may already have a fresh token — cheaper than an exchange,
      // and it keeps rotated refresh tokens from being spent twice.
      adoptStoredSession();
      if (shouldRefreshBeforeRequest()) {
        // A failed attempt is deliberately ignored: refreshSession() only ends
        // the session when the backend rejects the refresh token, and the API
        // clients handle that path.
        refreshSession().catch(() => {});
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") renewIfStale();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === "Profile-storage") adoptStoredSession();
    };

    renewIfStale();
    const timer = window.setInterval(renewIfStale, CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", renewIfStale);
    window.addEventListener("online", renewIfStale);
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", renewIfStale);
      window.removeEventListener("online", renewIfStale);
      window.removeEventListener("storage", onStorage);
    };
  }, [hydrated, sessionId]);

  return null;
}
