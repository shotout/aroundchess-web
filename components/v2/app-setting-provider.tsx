"use client";

import { loadPromoAppSetting } from "@/functions/app-setting";
import { useEffect } from "react";

/**
 * Loads GET /v4/app_setting so the promo window comes from the backend instead of
 * a hardcoded date. Refetches when the tab becomes visible again, so starting or
 * stopping the promo on the backend takes effect without a redeploy or reload.
 */
export function AppSettingProvider() {
  useEffect(() => {
    loadPromoAppSetting();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadPromoAppSetting();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
