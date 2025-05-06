import { create } from "zustand";

interface SuccessSentState {
  open: boolean;
  setOpen: (open: any) => void;
}

export const useSuccessSent = create<SuccessSentState>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  })
);
