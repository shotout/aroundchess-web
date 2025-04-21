import { create } from "zustand";

interface changePasswordState {
  open: boolean;
  setOpen: (open: any) => void;
}

export const usechangePassword = create<changePasswordState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
