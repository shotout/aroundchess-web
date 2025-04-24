import { create } from "zustand";

interface StatusPurchaseTokensState {
  open: boolean;
  setOpen: (open: any) => void;
  status: string;
  setStatus: (status: any) => void;
  quantity: string;
  setQuantity: (status: any) => void;
}

export const useStatusPurchaseTokens = create<StatusPurchaseTokensState>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
    status: "pending",
    setStatus: (status) => set({ status }),
    quantity: "0",
    setQuantity: (quantity) => set({ quantity }),
  })
);
