"use client";

import { useEffect } from "react";
import { HeroGamePreview } from "@/components/v2/hero-game-preview";
import { PlayTopBar } from "@/components/v2/play-top-bar";
import { PlayRecentGames } from "@/components/v2/play-recent-games";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { gameHistoryApi } from "@/components/game-history/services/api";
import Navigation from "@/components/navigator/navigation";

export function PlayPage() {
  const { sessionId } = useProfileStore();
  const {
    streak, setStreak,
    leaderboard, setLeaderboard,
    leaderboardMe, setLeaderboardMe,
    recentGames, setRecentGames,
  } = usePlayPageStore();

  useEffect(() => {
    if (!sessionId) return;

    const headers = {
      Authorization: `Bearer ${sessionId}`,
      Accept: "*/*",
    };

    fetch(`${process.env.BASE_URL}/streaks/status?t=${Date.now()}`, { headers })
      .then((r) => r.json())
      .then((data) => { if (data?.success) setStreak(data.data?.currentStreak ?? 0); })
      .catch(() => {});

    fetch(`${process.env.BASE_URL}/v4/leaderboard?t=${Date.now()}`, { headers })
      .then((r) => r.json())
      .then((data) => { if (data?.success) setLeaderboard(data.data); })
      .catch(() => {});

    gameHistoryApi
      .getLeaderboardMe(sessionId)
      .then((res) => { if (res?.data) setLeaderboardMe(res.data); })
      .catch(() => {});

    gameHistoryApi
      .getUserGames(sessionId, { limit: 5, page: 1 })
      .then((res) => {
        if (res?.data) setRecentGames(Array.isArray(res.data) ? res.data.slice(0, 5) : []);
      })
      .catch(() => {});
  }, [sessionId]);

  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="p-[16px] sm:p-[24px] flex flex-col gap-[20px] max-w-[1200px] min-[1600px]:max-w-[1400px] mx-auto w-full">
            <PlayTopBar
              streak={streak}
              elo={leaderboard?.my_elo ?? 0}
              rank={leaderboard?.my_rank ?? 0}
              movedUp={leaderboard?.moved_up ?? null}
              canJoin={leaderboardMe?.can_join}
              gamesRemaining={leaderboardMe?.games_remaining}
            />

            <div className="bg-[#E6F7FE] p-7 rounded-3xl"><HeroGamePreview recommendedListHeightClass="h-[440px] min-[1600px]:h-[530px]" />

            <div className="pt-8"><PlayRecentGames games={recentGames} isLoading={false} /></div>
            </div>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
