import { create } from 'zustand';

interface ChessboardRefStore {
  chessboardRef: HTMLDivElement | null;
  setChessboardRef: (ref: HTMLDivElement | null) => void;
  scrollToChessboard: () => void;
}

export const useChessboardRefStore = create<ChessboardRefStore>((set, get) => ({
  chessboardRef: null,
  setChessboardRef: (ref) => set({ chessboardRef: ref }),
  scrollToChessboard: () => {
    const { chessboardRef } = get();
    if (chessboardRef) {
      if (window.innerWidth < 1280) {
        chessboardRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
}));
