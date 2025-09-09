import { create } from "zustand";

interface LimitPuzzleState {
  open: boolean;
  setOpen: (LimitPuzzle: any) => void;
}

export const useLimitPuzzle = create<LimitPuzzleState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
