import { create } from "zustand";

interface PricingOfferState {
  open: boolean;
  setOpen: (PricingOffern: any) => void;
}

export const usePricingOffer = create<PricingOfferState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
