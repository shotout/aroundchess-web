import { create } from "zustand";

interface ChessBoardThemeState {
  StyleChoosed: string;
  setStyleChoosed: (StyleChoosed: string) => void;
  BoardChoosed: string;
  setBoardChoosed: (BoardChoosed: string) => void;
  PieceChoosed: string;
  setPieceChoosed: (PieceChoosed: string) => void;
}

export const useChessBoardThemeStore = create<ChessBoardThemeState>((set) => ({
  StyleChoosed: "2d",
  setStyleChoosed: (StyleChoosed) => set({ StyleChoosed }),
  BoardChoosed: "wood",
  setBoardChoosed: (BoardChoosed) => set({ BoardChoosed }),
  PieceChoosed: "wood",
  setPieceChoosed: (PieceChoosed) => set({ PieceChoosed }),
}));
