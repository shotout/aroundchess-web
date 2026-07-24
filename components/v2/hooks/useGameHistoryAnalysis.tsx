"use client";

import React, { useState } from "react";
import { Game } from "@/components/game-history/types/GameHistoryTypes";
import { AnalyzeGameHistory } from "@/components/game-history/components/AnalyzeGameHistory";
import ChooseAnalysisMode from "@/components/game-history/components/ChooseAnalysisMode";
import ProcessingAnalysisMode from "@/components/game-history/components/ProcessingAnalysisMode";
import GameAnalysis from "@/components/game-history/components/GameAnalysis";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { useProfileStore } from "@/app/store/profile";
import { createPgnHash } from "@/utils/crypto-utils";

// Mirrors GameCard's analysis flow so the play page's Recent Games buttons run
// exactly what the history page does — without changing the row layout.
const endpoint = process.env.BASE_URL;

const fetchLastAnalysis = async (
  version: "v2" | "v3",
  pgnHash: string,
  sessionId: string
): Promise<any | null> => {
  try {
    const response = await fetch(
      `${endpoint}/${version}/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
      { method: "GET", headers: { Authorization: `Bearer ${sessionId}` } }
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

/**
 * Encapsulates the game-history analysis flow for a single game. Render the
 * returned `modals` once, and wire any button's onClick to `trigger`.
 */
export function useGameHistoryAnalysis(game: Game) {
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [autoStartAnalyze, setAutoStartAnalyze] = useState(false);
  const [isChooseAnalysisModeOpen, setIsChooseAnalysisModeOpen] = useState(false);
  const [shortAnalysisData, setShortAnalysisData] = useState<any>(null);
  const [v2AnalysisData, setV2AnalysisData] = useState<any>(null);
  const [processingAnalysisModeOpen, setProcessingAnalysisModeOpen] = useState(false);
  const [gameAnalysisOpen, setGameAnalysisOpen] = useState(false);
  const [v3AnalysisResult, setV3AnalysisResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const { getJobByGameId } = useBackgroundAnalysisStore();
  const { sessionId } = useProfileStore();

  const trigger = async () => {
    const job = getJobByGameId(game.id);

    if (game.isAnalysis || (job && job.status === "completed")) {
      // Already analysed — fetch and show the result (mistakes) directly.
      setBusy(true);
      try {
        const pgnHash = createPgnHash(game.pgn);
        const [v2Analysis, v3Analysis] = await Promise.all([
          fetchLastAnalysis("v2", pgnHash, sessionId),
          fetchLastAnalysis("v3", pgnHash, sessionId),
        ]);
        setV2AnalysisData(v2Analysis);
        setShortAnalysisData(v3Analysis);

        if (v3Analysis?.success && v3Analysis.data?.summary) {
          setV3AnalysisResult({
            ...v3Analysis.data,
            analysisId: v3Analysis.data.analysisId || v3Analysis.data.id,
          });
          setGameAnalysisOpen(true);
        } else if (v3Analysis?.success && v3Analysis.data) {
          setIsChooseAnalysisModeOpen(true);
        } else if (job && job.result) {
          setShortAnalysisData({ data: job.result });
          setIsChooseAnalysisModeOpen(true);
        } else {
          setAutoStartAnalyze(true);
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
        if (job && job.result) {
          setShortAnalysisData({ data: job.result });
          setIsChooseAnalysisModeOpen(true);
        } else {
          setAutoStartAnalyze(true);
        }
      } finally {
        setBusy(false);
      }
    } else if (
      job &&
      ["pending", "processing", "waiting", "finalizing"].includes(job.status)
    ) {
      setProcessingAnalysisModeOpen(true);
    } else {
      // Not analysed yet — start the analysis flow.
      setAutoStartAnalyze(true);
    }
  };

  const modals = (
    <>
      <AnalyzeGameHistory
        open={isAnalyzeOpen}
        onOpenChange={setIsAnalyzeOpen}
        game={game}
        autoStart={autoStartAnalyze}
        onAutoStartComplete={() => setAutoStartAnalyze(false)}
        onAnalysisStarted={() => setProcessingAnalysisModeOpen(true)}
        onShortAnalysisReceived={(data: any) => setShortAnalysisData(data)}
      />
      <ChooseAnalysisMode
        open={isChooseAnalysisModeOpen}
        onOpenChange={setIsChooseAnalysisModeOpen}
        game={game}
        shortAnalysisData={shortAnalysisData}
        v2AnalysisData={v2AnalysisData}
        onOpenProcessingMode={() => setProcessingAnalysisModeOpen(true)}
        onOpenGameAnalysis={(v3Result: any) => {
          setV3AnalysisResult(v3Result);
          setGameAnalysisOpen(true);
        }}
      />
      <ProcessingAnalysisMode
        open={processingAnalysisModeOpen}
        onOpenChange={setProcessingAnalysisModeOpen}
        game={game}
        onOpenGameAnalysis={(v3Result: any) => {
          setV3AnalysisResult(v3Result);
          setGameAnalysisOpen(true);
        }}
      />
      <GameAnalysis
        open={gameAnalysisOpen}
        onOpenChange={setGameAnalysisOpen}
        v3Result={v3AnalysisResult}
      />
    </>
  );

  return { trigger, busy, modals };
}
