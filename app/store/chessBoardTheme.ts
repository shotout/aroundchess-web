import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ChessBoardThemeState {
  StyleChoosed: string;
  setStyleChoosed: (StyleChoosed: string) => void;
  BoardChoosed: string;
  setBoardChoosed: (BoardChoosed: string) => void;
  PieceChoosed: string;
  setPieceChoosed: (PieceChoosed: string) => void;
}

export const useChessBoardThemeStore = create<ChessBoardThemeState>()(persist(
    (set) => ({
  StyleChoosed: "2d",
  setStyleChoosed: (StyleChoosed) => set({ StyleChoosed }),
  BoardChoosed: "wood",
  setBoardChoosed: (BoardChoosed) => set({ BoardChoosed }),
  PieceChoosed: "wood",
  setPieceChoosed: (PieceChoosed) => set({ PieceChoosed }),
}),
  {
    name: 'chess-theme-storage', // unique name for the storage
    storage: createJSONStorage(() => sessionStorage), // use localStorage by default
    partialize: (state) => ({
      StyleChoosed: state.StyleChoosed,
      PieceChoosed: state.PieceChoosed,
      BoardChoosed: state.BoardChoosed,
    }),
  }
  )
  );
