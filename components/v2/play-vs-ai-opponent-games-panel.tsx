"use client";

import { usePagination } from "@/components/pagination/hook/usePagination";
import { useOpponentGames } from "@/components/v2/hooks/useOpponentGames";
import { PlayVsAiGamesTable } from "@/components/v2/play-vs-ai-games-table";
import { stripAiSuffix } from "@/components/v2/play-vs-ai-roster-data";

interface PlayVsAiOpponentGamesPanelProps {
  opponentUsername: string;
}

export function PlayVsAiOpponentGamesPanel({ opponentUsername }: PlayVsAiOpponentGamesPanelProps) {
  const { games, isLoading, error, handleRetryFetch } = useOpponentGames(opponentUsername);
  const paginationProps = usePagination(games, 3);

  return (
    <div className="h-full rounded-2xl border border-[#221AE9] bg-white p-[16px] md:p-[20px] flex flex-col">
      <h3 className="text-[18px] md:text-[20px] font-bold text-[#111827] mb-[12px]">
        Your Games against {stripAiSuffix(opponentUsername)}
      </h3>

      <PlayVsAiGamesTable
        currentGames={paginationProps.currentData}
        isLoading={isLoading}
        error={error}
        handleRetryFetch={handleRetryFetch}
        pagination={paginationProps}
      />
    </div>
  );
}
