import { create } from "zustand";

interface AnalysisDialogState {
  isOpen: boolean;
  username: string;
  selectedGamePgn: string;
  openDialog: (username: string, pgn: string) => void;
  closeDialog: () => void;
}

export const useAnalysisDialogStore = create<AnalysisDialogState>((set) => ({
  isOpen: false,
  username: "",
  selectedGamePgn: "",
  openDialog: (username, selectedGamePgn) =>
    set({ isOpen: true, username, selectedGamePgn }),
  closeDialog: () => set({ isOpen: false, username: "", selectedGamePgn: "" }),
}));
