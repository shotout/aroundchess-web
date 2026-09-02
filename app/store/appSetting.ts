import { create } from "zustand";

/**
 * Promo window resolved from GET /v4/app_setting (entry `name: "promo"`).
 * Dates are normalised to local-time timestamps so the UI can compare with Date.now().
 */
export type PromoWindow = {
  /** Backend master switch (`status` on the app_setting entry). */
  status: boolean;
  /** Start of `promo_begin`, or null when the backend omits it (treated as "already started"). */
  beginMs: number | null;
  /** Exclusive end: midnight after `promo_end`, or null when omitted (treated as "no end"). */
  endMs: number | null;
  /** `promo_end` formatted for display, e.g. "31.07.2026". */
  endLabel: string | null;
};

interface AppSettingState {
  promo: PromoWindow | null;
  /** False until the first /v4/app_setting response (or failure) lands. */
  isPromoLoaded: boolean;
  setPromo: (promo: PromoWindow | null) => void;
}

export const useAppSettingStore = create<AppSettingState>((set) => ({
  promo: null,
  isPromoLoaded: false,
  setPromo: (promo) => set({ promo, isPromoLoaded: true }),
}));
