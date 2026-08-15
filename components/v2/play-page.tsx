"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PlayHeroGamePreview } from "@/components/v2/play-hero-game-preview";
import { PlayGreeting, PlayTopBar } from "@/components/v2/play-top-bar";
import { PlayRecentGames } from "@/components/v2/play-recent-games";
import { useProfileStore } from "@/app/store/profile";
import { refreshStreakStatus } from "@/app/store/streak";
import { usePlayPageStore } from "@/app/store/playPage";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { transformApiDataToComponentFormat } from "@/components/game-history/hooks/useGameData";
import Navigation from "@/components/navigator/navigation";
import { useApiClient } from "@/functions/api-client";

export function PlayPage() {
  const { sessionId } = useProfileStore();
  // Same preview convention as the leaderboard page: append ?previewModal=join
  // (uncalibrated) or ?previewModal=inactive (frozen) to force the top-bar
  // states without touching the account. Render-time override only — the real
  // API data is still fetched and left untouched.
  const previewModal = useSearchParams().get("previewModal");
  const { getStreakStatus, getLeaderboardData, getLeaderboardMe } = useApiClient();
  const {
    streak, setStreak,
    leaderboard, setLeaderboard,
    leaderboardMe, setLeaderboardMe,
    recentGames, setRecentGames,
  } = usePlayPageStore();

  useEffect(() => {
    if (!sessionId) return;

    // Shared once-per-page-load refresh (also syncs the streak store's status,
    // so the badge click can detect a just-broken streak).
    refreshStreakStatus(sessionId, getStreakStatus).then((data: any) => {
      if (data?.success) setStreak(data.data?.currentStreak ?? 0);
    });

    getLeaderboardData()
      .then((data: any) => { if (data?.success) setLeaderboard(data.data); })
      .catch(() => {});

    getLeaderboardMe()
      .then((res: any) => { if (res?.data) setLeaderboardMe(res.data); })
      .catch(() => {});

    gameHistoryApi
      .getUserGames(sessionId, {
        sources: ["chesscom", "vs_ai", "pgn_upload"],
        limit: 5,
        page: 1,
      })
      .then((res) => {
        if (res?.data) setRecentGames(transformApiDataToComponentFormat(Array.isArray(res.data) ? res.data.slice(0, 5) : []));
      })
      .catch(() => {});
  }, [sessionId]);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="flex flex-col gap-[10px] max-w-[1080px] min-[1600px]:max-w-[1260px] mx-auto w-full pt-[10px] sm:pt-[24px]">
            <div className="px-[10px] sm:px-0"><PlayGreeting /></div>
            <div className="p-[10px] sm:p-[24px] flex flex-col gap-[20px] w-full sm:border-2 rounded-2xl sm:border-[#81CFF3]">
            {/* rank/movedUp fall back to /leaderboard/me for the same reason
                elo already did: right after a Chess.com sync that endpoint has
                the account's standing while the ranked table still reports
                zeros, which is why ELO showed but rank read "–". */}
            <PlayTopBar
              streak={streak}
              elo={leaderboard?.my_elo || leaderboardMe?.elo || 0}
              rank={leaderboard?.my_rank || leaderboardMe?.rank || 0}
              movedUp={leaderboard?.moved_up ?? leaderboardMe?.rank_change ?? null}
              canJoin={previewModal === "join" ? false : previewModal === "inactive" ? false : leaderboardMe?.can_join}
              gamesRemaining={leaderboardMe?.games_remaining ?? (previewModal === "join" ? 3 : undefined)}
              isInactive={
                previewModal === "inactive"
                  ? true
                  : previewModal === "join"
                    ? false
                    : leaderboardMe?.can_join === false && leaderboardMe?.is_inactive === true
              }
            />

            <div className="sm:bg-[#E6F7FE] p-0 sm:p-7 rounded-3xl"><PlayHeroGamePreview recommendedListHeightClass="sm:flex-1 sm:min-h-0" />

            <div className="pt-8"><PlayRecentGames games={recentGames} isLoading={false} /></div>
            </div>
            </div>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
