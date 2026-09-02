"use client";

import { usePlayPageStore } from "@/app/store/playPage";

export function useHasFinishedCalibration(): boolean {
  const { leaderboardMe } = usePlayPageStore();
  if (!leaderboardMe) return false;

  const stillCalibrating =
    leaderboardMe.can_join === false &&
    leaderboardMe.is_inactive !== true &&
    (leaderboardMe.games_remaining ?? 0) > 0;

  return !stillCalibrating;
}
