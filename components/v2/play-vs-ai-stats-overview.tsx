"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePlayPageStore } from "@/app/store/playPage";
import { PlayVsAiTopStats } from "@/components/v2/play-vs-ai-top-stats";
import { PlayVsAiOpponentsPlayedList } from "@/components/v2/play-vs-ai-opponents-played-list";
import { PlayVsAiRecommendedOpponents } from "@/components/v2/play-vs-ai-recommended-opponents";
import { useEffectiveElo } from "@/components/v2/hooks/useEffectiveElo";
import type { OpponentSummary, OpponentsPlayedPagination } from "@/app/store/playVsAiStats";

interface PlayVsAiStatsOverviewProps {
  opponentsPlayedState: {
    opponents: OpponentSummary[];
    isLoading: boolean;
    error: Error | null;
    handleRetryFetch: () => void;
    loadMore: () => void;
    pagination: OpponentsPlayedPagination | null;
  };
}

export function PlayVsAiStatsOverview({ opponentsPlayedState }: PlayVsAiStatsOverviewProps) {
  const { leaderboard } = usePlayPageStore();
  const myElo = leaderboard?.my_elo ?? 0;
  // Falls back to the onboarding level so new accounts get tier-appropriate
  // recommendations rather than the 1200 default.
  const effectiveElo = useEffectiveElo();
  const myRank = leaderboard?.my_rank ?? 0;

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[8px]">
        <Link href="/my-game-history" aria-label="Back to Game History" className="shrink-0">
          <ChevronLeft className="w-[24px] h-[24px] text-[#111827]" />
        </Link>
        <h1 className="text-[20px] md:text-[24px] font-bold text-[#111827]">
          Your Play VS AI Stats
        </h1>
      </div>

      <PlayVsAiTopStats elo={myElo} rank={myRank} movedUp={leaderboard?.moved_up ?? null} />

      <PlayVsAiOpponentsPlayedList {...opponentsPlayedState} />

      <PlayVsAiRecommendedOpponents userElo={effectiveElo} />
    </div>
  );
}
