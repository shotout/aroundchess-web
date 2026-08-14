"use client";

import { useAppSettingStore } from "@/app/store/appSetting";
import {
  isPromoWindowActive,
  PROMO_FALLBACK_END_DATE_LABEL,
} from "@/constants/marchOffer";

export const usePromoActive = () => {
  const promo = useAppSettingStore((state) => state.promo);

  return isPromoWindowActive(promo);
};

export const usePromoEndDateLabel = () => {
  const promo = useAppSettingStore((state) => state.promo);

  return promo?.endLabel ?? PROMO_FALLBACK_END_DATE_LABEL;
};
