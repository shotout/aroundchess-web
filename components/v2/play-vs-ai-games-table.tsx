"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AlertCircle,
  ChartNoAxesColumn,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import { Game } from "@/components/game-history/types/GameHistoryTypes";
import { AnalyzeGameHistory } from "@/components/game-history/components/AnalyzeGameHistory";
import ChooseAnalysisMode from "@/components/game-history/components/ChooseAnalysisMode";
import ProcessingAnalysisMode from "@/components/game-history/components/ProcessingAnalysisMode";
import GameAnalysis from "@/components/game-history/components/GameAnalysis";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { useProfileStore } from "@/app/store/profile";
import { createPgnHash } from "@/utils/crypto-utils";

interface PlayVsAiGamesTableProps {
  currentGames: Game[];
  isLoading: boolean;
  error: Error | null;
  handleRetryFetch: () => void;
  pagination: {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
  };
}

const endpoint = process.env.BASE_URL;

// Crisp white ring + a glow in the button's own color — same style as the
// v2 Game History table buttons. Inline style so class-merging can't drop it.
const v2GlowStyle = (r: number, g: number, b: number): React.CSSProperties => ({
  boxShadow: `0 0 0 2px #ffffff, 0 0 10px 3px rgba(${r}, ${g}, ${b}, 0.6)`,
});

const fetchLastAnalysis = async (
  version: "v2" | "v3",
  pgnHash: string,
  sessionId: string
): Promise<any | null> => {
  try {
    const response = await fetch(
      `${endpoint}/${version}/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
      { headers: { Authorization: `Bearer ${sessionId}` } }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${version} analysis: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${version} last analysis:`, error);
    return null;
  }
};

/** "YYYY-MM-DD" → "DD.MM.YYYY", plus the game's end time from the PGN when available. */
const formatRowDate = (game: Game): string => {
  const [y, m, d] = (game.date || "").split("-");
  const date = y && m && d ? `${d}.${m}.${y}` : game.date || "—";
  const pgn = game.pgn || "";
  const time =
    pgn.match(/\[EndTime "(\d{2}:\d{2})/) ??
    pgn.match(/\[UTCTime "(\d{2}:\d{2})/) ??
    pgn.match(/\[StartTime "(\d{2}:\d{2})/);
  return time ? `${date} · ${time[1]}` : date;
};

function ResultLabel({ game }: { game: Game }) {
  const raw = Number(String(game.eloChange ?? "0").replace("+", ""));
  const eloValue = Number.isNaN(raw) ? 0 : raw;
  const eloPart = ` (${eloValue > 0 ? "+" : ""}${eloValue})`;

  if (game.result === "WIN") {
    return (
      <span className="flex items-center gap-[4px] font-bold text-[#19B67A] whitespace-nowrap">
        WIN{eloPart}
        <Image
          src="/images/v2/play/up.png"
          alt=""
          width={14}
          height={14}
          className="w-[14px] h-[14px] object-contain"
        />
      </span>
    );
  }
  if (game.result === "LOSS") {
    return (
      <span className="flex items-center gap-[4px] font-bold text-[#DC2626] whitespace-nowrap">
        LOSS{eloPart}
        <Image
          src="/images/v2/play/down.png"
          alt=""
          width={14}
          height={14}
          className="w-[14px] h-[14px] object-contain"
        />
      </span>
    );
  }
  return <span className="font-bold text-[#6B7280] whitespace-nowrap">DRAW{eloPart}</span>;
}

function PageNumbers({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) {
  const pages: number[] = [];
  const windowStart = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  for (let i = windowStart; i <= Math.min(windowStart + 2, totalPages); i++) {
    pages.push(i);
  }
  const showEllipsis = pages[pages.length - 1] < totalPages;

  return (
    <div className="flex items-center gap-[6px]">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`w-[32px] h-[32px] rounded-[8px] border text-[13px] font-semibold transition-colors ${
            currentPage === page
              ? "bg-[#EEF1FE] border-[#221AE9] text-[#221AE9]"
              : "bg-white border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFB]"
          }`}
        >
          {page}
        </button>
      ))}
      {showEllipsis && (
        <span className="w-[32px] h-[32px] rounded-[8px] border border-[#E5E7EB] bg-white text-[13px] text-[#4B5563] flex items-center justify-center">
          …
        </span>
      )}
    </div>
  );
}

export function PlayVsAiGamesTable({
  currentGames,
  isLoading,
  error,
  handleRetryFetch,
  pagination,
}: PlayVsAiGamesTableProps) {
  const { getJobByGameId } = useBackgroundAnalysisStore();
  const { sessionId } = useProfileStore();

  const [analyzeGameId, setAnalyzeGameId] = useState<string | number | null>(null);
  const [chooseGameId, setChooseGameId] = useState<string | number | null>(null);
  const [processingGameId, setProcessingGameId] = useState<string | number | null>(null);
  const [gameAnalysisId, setGameAnalysisId] = useState<string | number | null>(null);
  const [busyGameId, setBusyGameId] = useState<string | number | null>(null);
  const [shortAnalysisData, setShortAnalysisData] = useState<any>(null);
  const [v2AnalysisData, setV2AnalysisData] = useState<any>(null);
  const [v3AnalysisResult, setV3AnalysisResult] = useState<any>(null);

  const jobInProgress = (game: Game) => {
    const job = getJobByGameId(game.id);
    return (
      !!job && ["pending", "processing", "waiting", "finalizing"].includes(job.status)
    );
  };

  const isAnalyzed = (game: Game) => {
    const job = getJobByGameId(game.id);
    return game.isAnalysis || (!!job && job.status === "completed");
  };

  const jobFailed = (game: Game) => getJobByGameId(game.id)?.status === "failed";

  const handleSeeMistakes = async (game: Game) => {
    // Analysis still running — open the loading dialog directly.
    if (!isAnalyzed(game) && jobInProgress(game)) {
      setProcessingGameId(game.id);
      return;
    }

    try {
      setBusyGameId(game.id);
      const pgnHash = createPgnHash(game.pgn);
      const [v2Analysis, v3Analysis] = await Promise.all([
        fetchLastAnalysis("v2", pgnHash, sessionId),
        fetchLastAnalysis("v3", pgnHash, sessionId),
      ]);

      setV2AnalysisData(v2Analysis);
      setShortAnalysisData(v3Analysis);

      const job = getJobByGameId(game.id);
      if (v3Analysis?.success && v3Analysis.data?.summary) {
        // Skip ChooseAnalysisMode — show the mistakes result right away
        setV3AnalysisResult({
          ...v3Analysis.data,
          analysisId: v3Analysis.data.analysisId || v3Analysis.data.id,
        });
        setGameAnalysisId(game.id);
      } else if (v3Analysis?.success && v3Analysis.data) {
        // v3 data without a summary — the choose dialog still handles this shape
        setChooseGameId(game.id);
      } else if (job?.result) {
        setShortAnalysisData({ data: job.result });
        setChooseGameId(game.id);
      } else {
        setAnalyzeGameId(game.id);
      }
    } catch (err) {
      console.error("Error opening analysis:", err);
      setAnalyzeGameId(game.id);
    } finally {
      setBusyGameId(null);
    }
  };

  const findGame = (id: string | number | null) =>
    currentGames.find((g) => g.id === id);

  const analyzeGame = findGame(analyzeGameId);
  const chooseGame = findGame(chooseGameId);
  const processingGame = findGame(processingGameId);

  if (isLoading) {
    return (
      <div className="flex flex-col divide-y divide-[#E5E7EB]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-[12px]">
            <div className="h-[14px] w-[220px] bg-gray-200 rounded animate-pulse" />
            <div className="h-[36px] w-[170px] bg-gray-200 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-[24px] text-center flex flex-col items-center gap-[8px]">
        <span className="text-[14px] text-[#6B7280]">Couldn&apos;t load these games.</span>
        <button
          type="button"
          onClick={handleRetryFetch}
          className="text-[14px] font-semibold text-[#221AE9] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (currentGames.length === 0) {
    return (
      <div className="py-[24px] text-center text-[14px] text-[#6B7280]">
        No games against this opponent yet.
      </div>
    );
  }

  return (
    <>
      {analyzeGame && (
        // Headless: open stays false so the depth dialog never shows; autoStart
        // runs the Standard analysis on mount and the loading dialog opens at
        // onAnalysisStarted. Cleared (unmounted) only in onAutoStartComplete.
        <AnalyzeGameHistory
          open={false}
          onOpenChange={(o: boolean) => setAnalyzeGameId(o ? analyzeGame.id : null)}
          game={analyzeGame}
          autoStart
          onAutoStartComplete={() => setAnalyzeGameId(null)}
          onAnalysisStarted={() => setProcessingGameId(analyzeGame.id)}
          onShortAnalysisReceived={(data: any) => setShortAnalysisData(data)}
        />
      )}

      {chooseGame && (
        <ChooseAnalysisMode
          open
          onOpenChange={(o: boolean) => setChooseGameId(o ? chooseGame.id : null)}
          game={chooseGame}
          shortAnalysisData={shortAnalysisData}
          v2AnalysisData={v2AnalysisData}
          onOpenProcessingMode={() => setProcessingGameId(chooseGame.id)}
          onOpenGameAnalysis={(v3Result: any) => {
            setV3AnalysisResult(v3Result);
            setGameAnalysisId(chooseGame.id);
          }}
        />
      )}

      {processingGame && (
        <ProcessingAnalysisMode
          open
          onOpenChange={(o: boolean) => setProcessingGameId(o ? processingGame.id : null)}
          game={processingGame}
          onOpenGameAnalysis={(v3Result: any) => {
            setV3AnalysisResult(v3Result);
            setGameAnalysisId(processingGame.id);
          }}
        />
      )}

      <GameAnalysis
        open={gameAnalysisId !== null}
        onOpenChange={(o: boolean) => setGameAnalysisId(o ? gameAnalysisId : null)}
        v3Result={v3AnalysisResult}
      />

      {/* No overflow-hidden here — it would cut the buttons' glow flat at the row edge. */}
      <div className="flex-1 min-h-0 flex flex-col divide-y divide-[#E5E7EB]">
        {currentGames.map((game) => {
          const analyzed = isAnalyzed(game) || jobInProgress(game);
          const failed = jobFailed(game);
          const isBusy = busyGameId === game.id || analyzeGameId === game.id;

          return (
            <div
              key={game.id}
              className="flex items-center justify-between gap-x-[8px] md:gap-x-[12px] py-[10px]"
            >
              {/* Date + result */}
              <div className="flex items-center gap-[4px] md:gap-[6px] text-[12px] md:text-[14px] min-w-0">
                <span className="text-[#9CA3AF] truncate min-w-0">
                  {formatRowDate(game)} ·
                </span>
                <ResultLabel game={game} />
              </div>

              {/* Action */}
              {failed ? (
                <button
                  type="button"
                  onClick={() => setAnalyzeGameId(game.id)}
                  disabled={isBusy}
                  className="h-[32px] md:min-h-[40px] min-w-[140px] md:min-w-[170px] px-[12px] md:px-[16px] rounded-full bg-red-600 hover:bg-red-700 text-white text-[12px] md:text-[14px] whitespace-nowrap shrink-0 flex items-center justify-center transition-colors duration-150 disabled:opacity-60"
                  style={v2GlowStyle(220, 38, 38)}
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 animate-spin" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                  )}
                  Retry
                </button>
              ) : analyzed ? (
                <button
                  type="button"
                  onClick={() => handleSeeMistakes(game)}
                  disabled={isBusy}
                  className="h-[32px] md:min-h-[40px] min-w-[140px] md:min-w-[170px] px-[12px] md:px-[16px] rounded-full bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:opacity-90 text-white text-[12px] md:text-[14px] whitespace-nowrap shrink-0 flex items-center justify-center transition-opacity duration-150 disabled:opacity-60"
                  style={v2GlowStyle(10, 216, 71)}
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 animate-spin" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                  )}
                  See Mistakes
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAnalyzeGameId(game.id)}
                  disabled={isBusy}
                  className="h-[32px] md:min-h-[40px] min-w-[140px] md:min-w-[170px] px-[12px] md:px-[16px] rounded-full bg-[#221AE9] hover:bg-[#1B14CC] text-white text-[12px] md:text-[14px] whitespace-nowrap shrink-0 flex items-center justify-center transition-colors duration-150 disabled:opacity-60"
                  style={v2GlowStyle(34, 26, 233)}
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 animate-spin" />
                  ) : (
                    <ChartNoAxesColumn className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                  )}
                  Analyze Mistakes
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-[14px] border-t border-[#E5E7EB] mt-[2px]">
          <button
            type="button"
            onClick={pagination.goToPreviousPage}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-[4px] text-[14px] font-semibold text-[#111827] disabled:opacity-40"
          >
            <ChevronLeft className="w-[18px] h-[18px] text-[#4E9AF3]" strokeWidth={2.5} />
            Previous
          </button>

          <PageNumbers
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            setCurrentPage={pagination.setCurrentPage}
          />

          <button
            type="button"
            onClick={pagination.goToNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-[4px] text-[14px] font-semibold text-[#111827] disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-[18px] h-[18px] text-[#4E9AF3]" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </>
  );
}
