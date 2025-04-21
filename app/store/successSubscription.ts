import { create } from "zustand";

interface SuccessSubscriptionState {
  open: boolean;
  setOpen: (SuccessSubscriptionn: any) => void;
}

export const useSuccessSubscription = create<SuccessSubscriptionState>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  })
);
