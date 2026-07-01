import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LeaderboardData {
  my_elo: number;
  my_rank: number;
  moved_up: number | null;
}

interface LeaderboardMe {
  can_join: boolean;
  games_remaining: number;
}

interface PlayPageState {
  streak: number;
  leaderboard: LeaderboardData | null;
  leaderboardMe: LeaderboardMe | null;
  recentGames: any[];
  setStreak: (v: number) => void;
  setLeaderboard: (v: LeaderboardData) => void;
  setLeaderboardMe: (v: LeaderboardMe) => void;
  setRecentGames: (v: any[]) => void;
}

export const usePlayPageStore = create<PlayPageState>()(
  persist(
    (set) => ({
      streak: 0,
      leaderboard: null,
      leaderboardMe: null,
      recentGames: [],
      setStreak: (streak) => set({ streak }),
      setLeaderboard: (leaderboard) => set({ leaderboard }),
      setLeaderboardMe: (leaderboardMe) => set({ leaderboardMe }),
      setRecentGames: (recentGames) => set({ recentGames }),
    }),
    {
      name: "play-page-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
