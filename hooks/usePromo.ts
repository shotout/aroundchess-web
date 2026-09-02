"use client";

import { useAppSettingStore } from "@/app/store/appSetting";
import {
  isPromoWindowActive,
  PROMO_FALLBACK_END_DATE_LABEL,
} from "@/constants/marchOffer";

/**
 * Reactive campaign gate driven by `promo_begin` / `promo_end` / `status`
 * on GET /v4/app_setting. False until the setting is loaded, then re-renders
 * consumers when the backend switches the promo on or off.
 */
export const usePromoActive = () => {
  const promo = useAppSettingStore((state) => state.promo);

  return isPromoWindowActive(promo);
};

/** `promo_end` for display, e.g. "31.07.2026". Empty when the backend omits it. */
export const usePromoEndDateLabel = () => {
  const promo = useAppSettingStore((state) => state.promo);

  return promo?.endLabel ?? PROMO_FALLBACK_END_DATE_LABEL;
};
