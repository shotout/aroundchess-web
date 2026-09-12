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
  // Live highlight in the "Choose Your Opponent" panel (before Start Game).
  // Drives the opponent bar over the board preview; not persisted.
  selectedOpponent: SelectedOpponent | null;
  setSelectedOpponent: (selectedOpponent: SelectedOpponent) => void;
  // Live "Choose Your Color" selection — flips the board preview; not persisted.
  selectedColor: "white" | "black";
  setSelectedColor: (selectedColor: "white" | "black") => void;
}

/** localStorage key holding the resume snapshot of an in-progress vs-AI game
 *  (PGN, opponent, colour, gameId). PlayingPage writes it on every move and
 *  reads it back on mount so a refresh lands you on the same board. */
export const VS_AI_CURRENT_GAME_KEY = "vs-ai-current-game";

/** Throw that snapshot away. Leaving a live game is documented as ending it —
 *  the leave guard says "end your current game. Your progress will not be
 *  saved" and the leaderboard one "you will lose all progress" — but the
 *  navigation alone never cleared the snapshot, so it stayed behind marked
 *  "Ongoing". Starting again against the same opponent in the same colour then
 *  matched it on the way back in and restored the abandoned position, moves and
 *  all, instead of dealing a new board. */
export function clearSavedVsAiGame() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(VS_AI_CURRENT_GAME_KEY);
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
