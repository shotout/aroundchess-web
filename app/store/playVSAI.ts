import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlayVSAIState {
  AIChoosed: any;
  setAIChoosed: (AIChoosed: any) => void;
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
          img: "/play-vs-ai/thomas.png",
        },
      },
      setAIChoosed: (AIChoosed) => set({ AIChoosed }),
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
