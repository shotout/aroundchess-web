"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/app/store/profile";
import {
  adoptStoredSession,
  refreshSession,
  shouldRefreshBeforeRequest,
} from "@/functions/refresh-token";

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function SessionKeepAlive() {
  const sessionId = useProfileStore((s) => s.sessionId);
  const hydrated = useProfileStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated || !sessionId) return;

    const renewIfStale = () => {
      adoptStoredSession();
      if (shouldRefreshBeforeRequest()) {
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
