import type { BoardTheme } from "../../store/playground/theme-store"

export const defaultBoardTheme: BoardTheme = {
  light: "bg-white hover:bg-white/90",
  dark: "bg-[#B7C0D8] hover:bg-[#B7C0D8]/90",
  selected: "ring-2 ring-yellow-400 ring-inset",
  highlight: "ring-2 ring-yellow-400 ring-inset",
  lastMove: "ring-2 ring-yellow-400 ring-inset",
};

export const greenWhiteBoardTheme: BoardTheme = {
  light: "bg-[#eeeed2]",
  dark: "bg-[#769656]",
  selected: "ring-2 ring-yellow-400 ring-inset",
  highlight: "ring-2 ring-yellow-400 ring-inset",
  lastMove: "ring-2 ring-yellow-400 ring-inset",
};

export const blueWhiteBoardTheme: BoardTheme = {
  light: "bg-blue-200",
  dark: "bg-blue-600",
  selected: "ring-2 ring-yellow-400 ring-inset",
  highlight: "ring-2 ring-yellow-400 ring-inset",
  lastMove: "ring-2 ring-yellow-400 ring-inset",
};

export const woodBoardTheme: BoardTheme = {
  light: "bg-[#DEB887]/80",
  dark: "bg-[#8B4513]/80",
  selected: "ring-2 ring-yellow-400 ring-inset",
  highlight: "ring-2 ring-yellow-400 ring-inset",
  lastMove: "ring-2 ring-yellow-400 ring-inset",
};
