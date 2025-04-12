import { create } from "zustand";

interface ConfirmLoginState {
  open: boolean;
  setOpen: (ConfirmLogin: any) => void;
}

export const useConfirmLogin = create<ConfirmLoginState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
