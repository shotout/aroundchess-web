"use client";

import { usePlayPageStore } from "@/app/store/playPage";

/**
 * Whether the account currently has a rank worth sharing.
 *
 * Two states have none:
 *  • still calibrating — can_join false with games left to play, so no rank yet.
 *  • frozen after inactivity — dropped off the leaderboard, so the card would
 *    advertise a rank the player no longer holds.
 *
 * Desktop only kept the frozen case inert by accident: StatsCover is absolutely
 * positioned over the stats block the button sits inside, so taps never reached
 * it. The mobile card puts the button in its header, outside the cover, where it
 * stayed live — hence the check here rather than per layout.
 */
export function useCanShareRank(): boolean {
  const { leaderboardMe } = usePlayPageStore();
  if (!leaderboardMe) return false;

  if (leaderboardMe.is_inactive === true) return false;

  const stillCalibrating =
    leaderboardMe.can_join === false &&
    (leaderboardMe.games_remaining ?? 0) > 0;

  return !stillCalibrating;
}
