import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TutorialState {
  tutorialType: "chesscom" | "no-chesscom" | null;
  hasCompletedTutorial: boolean;
  isCheckingTutorial: boolean;
  setTutorialType: (type: "chesscom" | "no-chesscom" | null) => void;
  setHasCompletedTutorial: (completed: boolean) => void;
  setIsCheckingTutorial: (checking: boolean) => void;
  reset: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      tutorialType: null,
      hasCompletedTutorial: false,
      isCheckingTutorial: false,
      setTutorialType: (type) => set({ tutorialType: type }),
      setHasCompletedTutorial: (completed) =>
        set({ hasCompletedTutorial: completed }),
      setIsCheckingTutorial: (checking) => set({ isCheckingTutorial: checking }),
      reset: () =>
        set({
          tutorialType: null,
          hasCompletedTutorial: false,
          isCheckingTutorial: false,
        }),
    }),
    {
      name: "tutorial-storage",
    }
  )
);
