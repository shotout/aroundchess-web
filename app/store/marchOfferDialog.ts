import { create } from "zustand";

interface MarchOfferDialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useMarchOfferDialog = create<MarchOfferDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
