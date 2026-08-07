"use client";

import { loadPromoAppSetting } from "@/functions/app-setting";
import { useEffect } from "react";

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
