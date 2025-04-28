import { create } from "zustand";

interface GameEndStatusState {
  open: boolean;
  setOpen: (gameEndStatusn: any) => void;
}

export const useGameEndStatus = create<GameEndStatusState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
