import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface OpponentSummary {
  opponentUsername: string;
  opponentElo: number | null;
  opponentAvatar: string | null;
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface OpponentsPlayedPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PlayVsAiStatsState {
  opponentsPlayed: OpponentSummary[];
  opponentsPlayedPagination: OpponentsPlayedPagination | null;
  lastFetched: number | null;
  setOpponentsPlayed: (
    data: OpponentSummary[],
    pagination: OpponentsPlayedPagination | null
  ) => void;
}

export const usePlayVsAiStatsStore = create<PlayVsAiStatsState>()(
  persist(
    (set) => ({
      opponentsPlayed: [],
      opponentsPlayedPagination: null,
      lastFetched: null,
      setOpponentsPlayed: (opponentsPlayed, opponentsPlayedPagination) =>
        set({ opponentsPlayed, opponentsPlayedPagination, lastFetched: Date.now() }),
    }),
    {
      name: "play-vs-ai-stats-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
