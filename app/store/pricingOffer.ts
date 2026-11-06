import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PricingOfferState {
  open: boolean;
  setOpen: (open: any) => void;
  openOffer: boolean;
  setOpenOffer: (open: any) => void;
  tabType: string;
  setTabType: (tabType: string) => void;
  subscriptionFilter: "monthly" | "yearly";
  setSubscriptionFilter: (filter: "monthly" | "yearly") => void;
  paramsPayment: any;
  setParamsPayment: (paramsPayment: any) => void;
}

export const usePricingOffer = create<PricingOfferState>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (open) => set({ open }),
      openOffer: false,
      setOpenOffer: (openOffer) => set({ openOffer }),
      tabType: "analyses",
      setTabType: (tabType) => set({ tabType }),
      subscriptionFilter: "monthly",
      setSubscriptionFilter: (subscriptionFilter) => set({ subscriptionFilter }),
      paramsPayment: null,
      setParamsPayment: (paramsPayment) => set({ paramsPayment }),
    }),
    {
      // Checkout leaves for Stripe with a full-page redirect, so the profile
      // page that reports the Subscribe/Purchase event on the way back starts
      // from a fresh store. sessionStorage carries the checkout details over
      // that round trip, in this tab only.
      name: "pending-checkout",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ paramsPayment: state.paramsPayment }),
    }
  )
);
