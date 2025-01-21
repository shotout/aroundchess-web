import { defaultBoardTheme } from "../utils/boardThemes/board-themes";
import { create } from "zustand";

export type pieceThemes = "default" | "classic" | "crownforge";

export type BoardTheme = {
  light: string;
  dark: string;
  selected: string;
  highlight?: string;
  lastMove?: string;
};

interface ThemeStore {
  boardTheme: BoardTheme;
  pieceTheme: pieceThemes;
  setBoardTheme: (theme: BoardTheme) => void;
  setPieceTheme: (theme: pieceThemes) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  boardTheme: defaultBoardTheme,
  pieceTheme: "default",
  setBoardTheme: (theme) => set({ boardTheme: theme }),
  setPieceTheme: (theme) => set({ pieceTheme: theme }),
}));
