"use client";
import { useEffect } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { useProfileStore } from "@/app/store/profile";
import { refreshStreakStatus } from "@/app/store/streak";
import { usePlayPageStore } from "@/app/store/playPage";
import { useApiClient } from "@/functions/api-client";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import Navigation from "@/components/navigator/navigation";
import { EloScoreLink, PlayTopBar } from "@/components/v2/play-top-bar";

import PlayingPage from "@/components/playground/play-vs-ai/PlayingPage";

export default function Playing() {
  const { isLoading: loadingAnalyze } = usePgnStore();
  const { sessionId } = useProfileStore();
  const { getStreakStatus, getLeaderboardData, getLeaderboardMe } = useApiClient();
  const {
    streak, setStreak,
    leaderboard, setLeaderboard,
    leaderboardMe, setLeaderboardMe,
  } = usePlayPageStore();

  useEffect(() => {
    if (!sessionId) return;

    refreshStreakStatus(sessionId, getStreakStatus).then((data: any) => {
      if (data?.success) setStreak(data.data?.currentStreak ?? 0);
    });

    getLeaderboardData()
      .then((data: any) => { if (data?.success) setLeaderboard(data.data); })
      .catch(() => {});

    getLeaderboardMe()
      .then((res: any) => { if (res?.data) setLeaderboardMe(res.data); })
      .catch(() => {});
  }, [sessionId]);

  if (loadingAnalyze) return <LoadingPage />;
  return (
    <Navigation>
      <div className="p-0 sm:p-[24px] flex flex-col max-w-[1200px] min-[1400px]:max-w-[1340px] min-[1600px]:max-w-[1400px] mx-auto w-full">
        <div className="hidden sm:flex justify-end mb-[10px]">
          <EloScoreLink />
        </div>
        <div className="rounded-none border-0 sm:rounded-[24px] sm:border sm:border-[#7CC0F2] bg-white p-[8px] sm:p-[16px] flex flex-col gap-[8px]">
          <PlayTopBar
            streak={streak}
            elo={leaderboard?.my_elo ?? 0}
            rank={leaderboard?.my_rank ?? 0}
            movedUp={leaderboard?.moved_up ?? null}
            canJoin={leaderboardMe?.can_join}
            gamesRemaining={leaderboardMe?.games_remaining}
            isInactive={leaderboardMe?.can_join === false && leaderboardMe?.is_inactive === true}
          />
          <PlayingPage />
        </div>
      </div>
    </Navigation>
  );
}
