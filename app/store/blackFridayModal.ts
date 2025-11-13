import { create } from "zustand";

interface BlackFridayModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useBlackFridayModal = create<BlackFridayModalState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

