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
  const { leaderboard, leaderboardMe } = usePlayPageStore();
  const { profile } = useProfileStore();

  const leaderboardElo = Number(leaderboard?.my_elo) || 0;
  if (leaderboardElo > 0) return leaderboardElo;

  // A Chess.com sync lands here first: /leaderboard/me carries the transferred
  // rating while the ranked table still reports my_elo 0. Without this step a
  // freshly synced account fell through to its onboarding rating and got the
  // wrong Recommended opponents, even though the play top bar showed the real
  // number (it has always read this field).
  const meElo = Number(leaderboardMe?.elo) || 0;
  if (meElo > 0) return meElo;

  // The /profile response is camelCased (imageUrl, isChessComConnected, …), so
  // the users.onboard_elo column arrives as onboardElo. The snake_case read is
  // kept as a fallback in case an endpoint returns the raw row.
  return Number(profile?.onboardElo ?? profile?.onboard_elo) || 0;
}
