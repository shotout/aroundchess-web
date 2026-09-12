"use client";

import { usePlayPageStore } from "@/app/store/playPage";

/**
 * Whether the account currently has a rank worth sharing.
 *
 * Only one state has none: still calibrating — can_join false with games left
 * to play, so there is no rank to put on the card yet.
 *
 * A frozen (inactive) player does still share, even though the API sends them
 * with can_join false and games_remaining set: they hold a real rank from
 * before the freeze, and product wants the button up in that state rather than
 * vanishing. Desktop has to place it above StatsCover for that to be true —
 * the cover is absolutely positioned over the stats block the button sits in,
 * so without a higher z-index the clicks never reach it.
 */
export function useCanShareRank(): boolean {
  const { leaderboardMe } = usePlayPageStore();
  if (!leaderboardMe) return false;

  if (leaderboardMe.is_inactive === true) return true;

  const stillCalibrating =
    leaderboardMe.can_join === false &&
    (leaderboardMe.games_remaining ?? 0) > 0;

  return !stillCalibrating;
}
