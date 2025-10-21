import { create } from "zustand";

interface PricingOfferState {
  open: boolean;
  setOpen: (open: any) => void;
  openOffer: boolean;
  setOpenOffer: (open: any) => void;
  tabType: string;
  setTabType: (tabType: string) => void;
  paramsPayment: any;
  setParamsPayment: (paramsPayment: any) => void;
}

export const usePricingOffer = create<PricingOfferState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  openOffer: false,
  setOpenOffer: (openOffer) => set({ openOffer }),
  tabType: "analyses",
  setTabType: (tabType) => set({ tabType }),
  paramsPayment: "analyses",
  setParamsPayment: (paramsPayment) => set({ paramsPayment }),
}));
