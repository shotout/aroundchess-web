"use client";

import { usePlayPageStore } from "@/app/store/playPage";
import { useProfileStore } from "@/app/store/profile";

/**
 * The ELO the player should be rated at when picking Recommended opponents.
 *
 * A brand-new account has no leaderboard ELO until it has played (the play page
 * shows "Calibrating…"), so `leaderboard.my_elo` is 0 — which fell through to
 * the fixed beginner spread (250/400/500/600) even for someone who told
 * onboarding they were an advanced player. Onboarding records a level
 * server-side and `/profile` returns the resulting `onboardElo`, so use that
 * until a real rating exists.
 *
 * Returns 0 when neither is known (signed-out visitors), so callers can still
 * apply their own default.
 */
export function useEffectiveElo(): number {
  const { leaderboard } = usePlayPageStore();
  const { profile } = useProfileStore();

  const leaderboardElo = Number(leaderboard?.my_elo) || 0;
  if (leaderboardElo > 0) return leaderboardElo;

  // The /profile response is camelCased (imageUrl, isChessComConnected, …), so
  // the users.onboard_elo column arrives as onboardElo. The snake_case read is
  // kept as a fallback in case an endpoint returns the raw row.
  return Number(profile?.onboardElo ?? profile?.onboard_elo) || 0;
}
