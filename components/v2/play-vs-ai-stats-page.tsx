"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { useApiClient } from "@/functions/api-client";
import { GameHistoryTabs } from "@/components/v2/game-history-tabs";
import { useOpponentsPlayed } from "@/components/v2/hooks/useOpponentsPlayed";
import { PlayVsAiStatsOverview } from "@/components/v2/play-vs-ai-stats-overview";
import { PlayVsAiOpponentDetail } from "@/components/v2/play-vs-ai-opponent-detail";

export function PlayVsAiStatsPage() {
  const searchParams = useSearchParams();
  const opponent = searchParams.get("opponent");

  const { sessionId } = useProfileStore();
  const { getLeaderboardData } = useApiClient();
  const { setLeaderboard } = usePlayPageStore();
  const opponentsPlayedState = useOpponentsPlayed();

  useEffect(() => {
    if (!sessionId) return;

    getLeaderboardData()
      .then((data: any) => {
        if (data?.success && data.data) setLeaderboard(data.data);
      })
      .catch(() => {});
  }, [sessionId]);

  return (
    <div className="p-4 md:p-6">
      <GameHistoryTabs />

      {opponent ? (
        <PlayVsAiOpponentDetail
          opponentUsername={opponent}
          opponentsPlayed={opponentsPlayedState.opponents}
        />
      ) : (
        <PlayVsAiStatsOverview opponentsPlayedState={opponentsPlayedState} />
      )}
    </div>
  );
}

export default PlayVsAiStatsPage;
