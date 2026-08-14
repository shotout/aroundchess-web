import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { useProfileStore } from "@/app/store/profile";

export function useStockfishAnalysis() {
  const {
    setAnalyzeComplete,
    estimateMinute,
    estimateSecond,
    setEstimateMinute,
    setEstimateSecond,
  } = useLoadingAPI();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const { sessionId, setAlreadyFetch } = useProfileStore();

  const pgnToFenList = useCallback(
    (pgn: string, includeStartPosition: boolean = true): string[] => {
      const chess = new Chess();

      try {
        chess.loadPgn(pgn);
      } catch (error) {
        console.error("Error loading PGN:", error);
        return [];
      }

      const history = chess.history({ verbose: true });
      const fenList: string[] = [];

      chess.reset();

      if (includeStartPosition) {
        fenList.push(chess.fen());
      }

      for (const move of history) {
        chess.move(move);
        fenList.push(chess.fen());
      }

      return fenList;
    },
    []
  );

  const batchStockfishAnalysis = useCallback(
    async (
      fenPositions: string[],
      depth: number = 20,
      moveTime: number = 60000
    ) => {
      const results = [];
      let count = 0;

      const { getStockfishService } = await import(
        "@/lib/stockfish/stockfish-service"
      );
      const stockfishService = getStockfishService();
      await stockfishService.waitReady();

      for (let i = 0; i < fenPositions.length; i++) {
        const fen = fenPositions[i];
        const fenParts = fen.split(" ");
        const colorToMove = fenParts.length > 1 ? fenParts[1] : "w";
        const colorName = colorToMove === "w" ? "White" : "Black";
        count = Math.round(((i + 1) / fenPositions.length) * 100);

        console.log(`Analyzing position for ${colorName}:`, fen);
        console.log(`Analyzing position progress: ${progress}`);
        console.log("count progress", count);
        const analysis = await stockfishService.getMoveAndEval(
          fen,
          depth,
          moveTime
        );
        setProgress(count);

        results.push({
          fen: fen,
          moveNumber: i + 1,
          color: colorToMove,
          colorName: colorName,
          evaluation: analysis.evaluationPawns,
          bestMove: analysis.bestMove,
          depth: analysis.depth,
          evaluationCentiPawns: analysis.evaluationCentiPawns,
        });
      }
      return results;
    },
    []
  );

  const batchStockfishAnalysisAPI = useCallback(
    async (fenPositions: string[], depth: number = 14) => {
      if (depth < 10 || depth > 25) {
        throw new Error("Depth must be between 10 and 25");
      }

      const results = [];
      let count = 0;

      let endpoint = "";
      if (depth >= 10 && depth <= 15) {
        endpoint = `${process.env.BASE_URL}/stockfish/basic-analysis`;
      } else if (depth >= 16 && depth <= 18) {
        endpoint = `${process.env.BASE_URL}/stockfish/standard-analysis`;
      } else if (depth >= 19 && depth <= 25) {
        endpoint = `${process.env.BASE_URL}/stockfish/deep-analysis`;
      } else {
        throw new Error("Depth out of supported range");
      }

      try {
        const { default: axios } = await import("axios");
        const response = await axios.post(
          endpoint,
          {
            positions: fenPositions,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionId}`,
            },
          }
        );

        const apiResults = response.data?.data?.results || [];

        for (let i = 0; i < fenPositions.length; i++) {
          const fen = fenPositions[i];
          const fenParts = fen.split(" ");
          const colorToMove = fenParts.length > 1 ? fenParts[1] : "w";
          const colorName = colorToMove === "w" ? "White" : "Black";
          count = Math.round(((i + 1) / fenPositions.length) * 100);

          setProgress(count);

          const analysis = apiResults[i] || {};

          results.push({
            fen: fen,
            moveNumber: i + 1,
            color: colorToMove,
            colorName: colorName,
            evaluation: analysis.evaluation,
            bestMove: analysis.bestMove,
            depth: depth,
            evaluationCentiPawns: analysis.evaluationCentiPawns,
          });
        }
        return results;
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [sessionId]
  );

  const proceedAnalysis = useCallback(
    async (
      pgn: string,
      username?: string,
      depth: number = 20,
      moveTime: number = 60000
    ) => {
      if (!pgn) {
        setError(new Error("PGN is required"));
        throw new Error("PGN is required");
      }
      setAlreadyFetch(false);
      setIsAnalyzing(true);
      setError(null);
      setProgress(0);

      try {
        const { default: axios } = await import("axios");
        const isAlreadyAnalyzed = await axios.post(
          `${process.env.BASE_URL}/v2/analyze/check-exists`,
          {
            pgn: pgn,
            depth: depth,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionId}`,
            },
          }
        );

        console.log(isAlreadyAnalyzed.data);
        console.log(
          isAlreadyAnalyzed.data.data.exists
            ? "Analysis already exists"
            : "Analysis does not exist"
        );

        if (isAlreadyAnalyzed.data.data.exists) {
          console.log("Analysis already exists, retrieving existing analysis");
          try {
            setEstimateSecond(5);
            setEstimateMinute(0);
            const { default: axios } = await import("axios");
            const response = await axios.post(
              `${process.env.BASE_URL}/v2/analyze`,
              {
                pgn: pgn,
                username: username,
                depth: depth,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionId}`,
                },
              }
            );
            console.log("API response:", response.data);

            return response.data;
          } catch (apiError) {
            console.error("Error sending analysis to API:", apiError);
            setError(
              apiError instanceof Error ? apiError : new Error(String(apiError))
            );
            throw apiError;
          }
        } else {
          console.log("Analysis does not exist, proceeding with analysis");

          const fenPositions = pgnToFenList(pgn);
          console.log("Generated FEN positions:", fenPositions.length);

          const analysisResults: any[] = await batchStockfishAnalysisAPI(
            fenPositions,
            depth
          );

          console.log("Analysis complete:", analysisResults);
          setTimeout(() => {
            setAnalyzeComplete(true);
          }, 5000);
          try {
            console.log("Analysis analyze:", estimateMinute, estimateSecond);
            const { default: axios } = await import("axios");
            const response = await axios.post(
              `${process.env.BASE_URL}/v2/analyze`,
              {
                pgn: pgn,
                depth: depth,
                username: username,
                stockfishData: analysisResults,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionId}`,
                },
              }
            );

            console.log("API response:", response.data);
            setAnalyzeComplete(false);
            return response.data;
          } catch (apiError) {
            console.error("Error sending analysis to API:", apiError);
            setError(
              apiError instanceof Error ? apiError : new Error(String(apiError))
            );
            throw apiError;
          }
        }
      } catch (error) {
        console.error("Error analyzing PGN:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [sessionId, pgnToFenList, batchStockfishAnalysis]
  );

  return {
    proceedAnalysis,
    pgnToFenList,
    batchStockfishAnalysis,
    isAnalyzing,
    progress,
    error,
  };
}

