import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LeaderboardData {
  my_elo: number;
  my_rank: number;
  moved_up: number | null;
  /** Total number of ranked players on the leaderboard. */
  total?: number;
}

interface LeaderboardMe {
  can_join: boolean;
  is_inactive: boolean;
  games_remaining: number;
  ac_games_played?: number;
  elo?: number;
  rank?: number | null;
  rank_change?: number | null;
  chess_com_elo_transferred?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  rankChange: number | null;
  isMe: boolean;
}

interface PlayPageState {
  streak: number;
  leaderboard: LeaderboardData | null;
  leaderboardMe: LeaderboardMe | null;
  leaderboardEntries: LeaderboardEntry[] | null;
  recentGames: any[];
  setStreak: (v: number) => void;
  setLeaderboard: (v: LeaderboardData) => void;
  setLeaderboardMe: (v: LeaderboardMe) => void;
  setLeaderboardEntries: (v: LeaderboardEntry[]) => void;
  setRecentGames: (v: any[]) => void;
}

export const usePlayPageStore = create<PlayPageState>()(
  persist(
    (set) => ({
      streak: 0,
      leaderboard: null,
      leaderboardMe: null,
      leaderboardEntries: null,
      recentGames: [],
      setStreak: (streak) => set({ streak }),
      setLeaderboard: (leaderboard) => set({ leaderboard }),
      setLeaderboardMe: (leaderboardMe) => set({ leaderboardMe }),
      setLeaderboardEntries: (leaderboardEntries) => set({ leaderboardEntries }),
      setRecentGames: (recentGames) => set({ recentGames }),
    }),
    {
      name: "play-page-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
