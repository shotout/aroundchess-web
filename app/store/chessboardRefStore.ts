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
      // On mobile/tablet, scroll to chessboard
      if (window.innerWidth < 1280) {
        chessboardRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // On desktop, scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
}));
