import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SelectedOpponent {
  name: string;
  elo: number;
  img: string;
}

interface PlayVSAIState {
  AIChoosed: any;
  setAIChoosed: (AIChoosed: any) => void;
  selectedOpponent: SelectedOpponent | null;
  setSelectedOpponent: (selectedOpponent: SelectedOpponent) => void;
  selectedColor: "white" | "black";
  setSelectedColor: (selectedColor: "white" | "black") => void;
}

export const usePlayVSAIStore = create<PlayVSAIState>()(
  persist(
    (set) => ({
      AIChoosed: {
        color: "white",
        difficulty: "beginner",
        opponent: {
          id: 0,
          name: "Thomas",
          elo: 250,
          img: "/images/v2/AI avatar/Beginner/Thomas.png",
        },
      },
      setAIChoosed: (AIChoosed) => set({ AIChoosed }),
      selectedOpponent: null,
      setSelectedOpponent: (selectedOpponent) => set({ selectedOpponent }),
      selectedColor: "white",
      setSelectedColor: (selectedColor) => set({ selectedColor }),
    }),
    {
      name: "AI-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        AIChoosed: state.AIChoosed,
      }),
    }
  )
);
