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
          name: "Thomas De",
          elo: 250,
          img: "/images/play-vs-ai/thomas.png",
        },
      },
      setAIChoosed: (AIChoosed) => set({ AIChoosed }),
    }),
    {
      name: "AI-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // use localStorage by default
      partialize: (state) => ({
        AIChoosed: state.AIChoosed,
      }),
    }
  )
);
