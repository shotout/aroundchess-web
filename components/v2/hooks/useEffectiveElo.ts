"use client";

import { usePlayPageStore } from "@/app/store/playPage";
import { useProfileStore } from "@/app/store/profile";

export function useEffectiveElo(): number {
  const { leaderboard } = usePlayPageStore();
  const { profile } = useProfileStore();

  const leaderboardElo = Number(leaderboard?.my_elo) || 0;
  if (leaderboardElo > 0) return leaderboardElo;

  return Number(profile?.onboardElo ?? profile?.onboard_elo) || 0;
}
