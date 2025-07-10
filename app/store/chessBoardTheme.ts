import { formatTimePgn } from "@/functions/format-date";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ChessBoardThemeState {
  trigger: any;
  setTrigger: (trigger: any) => void;
  StyleChoosed: string;
  setStyleChoosed: (StyleChoosed: string) => void;
  BoardChoosed: string;
  setBoardChoosed: (BoardChoosed: string) => void;
  PieceChoosed: string;
  setPieceChoosed: (PieceChoosed: string) => void;
}

export const useChessBoardThemeStore = create<ChessBoardThemeState>()(
  persist(
    (set) => ({
      trigger: formatTimePgn(),
      setTrigger: (trigger) => set({ trigger }),
      StyleChoosed: "2d",
      setStyleChoosed: (StyleChoosed) => set({ StyleChoosed }),
      BoardChoosed: "wood",
      setBoardChoosed: (BoardChoosed) => set({ BoardChoosed }),
      PieceChoosed: "metallic",
      setPieceChoosed: (PieceChoosed) => set({ PieceChoosed }),
    }),
    {
      name: "chess-theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        StyleChoosed: state.StyleChoosed,
        PieceChoosed: state.PieceChoosed,
        BoardChoosed: state.BoardChoosed,
      }),
    }
  )
);
