import { create } from "zustand";

export type PromoWindow = {
  status: boolean;
  beginMs: number | null;
  endMs: number | null;
  endLabel: string | null;
};

interface AppSettingState {
  promo: PromoWindow | null;
  isPromoLoaded: boolean;
  setPromo: (promo: PromoWindow | null) => void;
}

export const useAppSettingStore = create<AppSettingState>((set) => ({
  promo: null,
  isPromoLoaded: false,
  setPromo: (promo) => set({ promo, isPromoLoaded: true }),
}));
