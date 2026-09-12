import { usePlayPageStore } from "@/app/store/playPage";
import { usePlayVsAiStatsStore } from "@/app/store/playVsAiStats";
import { VS_AI_CURRENT_GAME_KEY } from "@/app/store/playVSAI";
import { useStreakStore } from "@/app/store/streak";

/**
 * Every localStorage entry holding one account's data.
 *
 * The signed-out state lives in localStorage, not in the session, so whatever
 * is left behind here belongs to the next account that signs in on this
 * browser. That is how a brand-new account arrived on /play already carrying
 * the previous account's ELO and rank: `play-page-storage` survived the delete,
 * the store rehydrated from it, and the top bar rendered a standing the account
 * had never earned. `day-streak-storage` did the same for the streak badge, and
 * `vs-ai-current-game` handed over a half-finished game.
 *
 * The last two were already being removed by every sign-out; the rest are the
 * ones that were missed.
 */
const ACCOUNT_SCOPED_STORAGE_KEYS = [
  "play-page-storage",
  "day-streak-storage",
  "play-vs-ai-stats-storage",
  VS_AI_CURRENT_GAME_KEY,
  "background-analysis-storage",
  "pgn-local-storage",
];

/**
 * Drop every per-account cache on sign-out and account deletion.
 *
 * Deliberately left alone: `chess-theme-storage`, `modal-settings` and
 * `AI-storage` are device preferences (board theme, cookie choice, last
 * opponent picked) rather than account data, and `tutorial-storage` is left
 * because clearing it would replay the onboarding tour every time someone signs
 * out and back in on the same account.
 */
export function clearAccountLocalState() {
  if (typeof window === "undefined") return;

  ACCOUNT_SCOPED_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

  // Removing the storage entry does not touch the already-hydrated store, and
  // sign-out is a client-side route change rather than a reload — so without
  // this the stale values stay on screen, and the first set() after sign-in
  // writes them straight back out to the key we just deleted.
  usePlayPageStore.setState({
    streak: 0,
    leaderboard: null,
    leaderboardMe: null,
    leaderboardEntries: null,
    recentGames: [],
  });
  useStreakStore.setState({
    status: null,
    currentStreak: 0,
    lastLoginModalDate: null,
    lastBrokenModalDate: null,
    lastSeenStreak: 0,
    lastPlayDate: null,
  });
  usePlayVsAiStatsStore.setState({
    opponentsPlayed: [],
    opponentsPlayedPagination: null,
    lastFetched: null,
  });
}
