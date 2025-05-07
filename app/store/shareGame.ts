import { create } from "zustand";

interface ShareGameState {
  open: boolean;
  setOpen: (open: any) => void;
  fen: string;
  setFen: (fen: any) => void;
  pgn: string;
  setPGN: (pgn: any) => void;
}

export const useShareGame = create<ShareGameState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  fen: ``,
  setFen: (fen) => set({ fen }),
  pgn: ``,
  setPGN: (pgn) => set({ pgn }),
}));
