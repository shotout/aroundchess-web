import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LeaderboardData {
  my_elo: number;
  my_rank: number;
  moved_up: number | null;
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

/**
 * Pull the account's leaderboard standing and write it straight into the store.
 *
 * Used after a Chess.com sync, which recalculates the rating server-side and so
 * leaves everything reading `leaderboard` / `leaderboardMe` stale — the ELO and
 * rank in the play top bar, and `useEffectiveElo`, which feeds the recommended
 * opponents. Without this the old value survives until the user next opens
 * /play, so a freshly synced account still sees its onboarding rating.
 *
 * The two endpoints are passed in rather than imported: they come off the
 * useApiClient hook, which can't be called outside a component.
 *
 * Never rejects — a failed refresh must not take down the flow that called it;
 * the stale value simply survives until the next fetch.
 */
export async function refreshLeaderboard(
  getLeaderboardData: (params?: any) => Promise<any>,
  getLeaderboardMe: () => Promise<any>
): Promise<void> {
  const { setLeaderboard, setLeaderboardMe } = usePlayPageStore.getState();

  await Promise.all([
    Promise.resolve()
      .then(() => getLeaderboardData())
      .then((data: any) => {
        if (data?.success && data.data) setLeaderboard(data.data);
      })
      .catch(() => {}),
    Promise.resolve()
      .then(() => getLeaderboardMe())
      .then((res: any) => {
        if (res?.data) setLeaderboardMe(res.data);
      })
      .catch(() => {}),
  ]);
}
