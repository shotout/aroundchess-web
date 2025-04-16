import { create } from "zustand";

interface ContactUsState {
  open: boolean;
  setOpen: (ConfirmLogin: any) => void;
}

export const useContactUs = create<ContactUsState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
