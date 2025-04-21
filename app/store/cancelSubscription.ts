import { create } from "zustand";

interface CancelSubscriptionState {
  open: boolean;
  setOpen: (CancelSubscriptionn: any) => void;
}

export const useCancelSubscription = create<CancelSubscriptionState>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  })
);
