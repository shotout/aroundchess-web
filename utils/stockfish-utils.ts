// useStockfishAnalysis.tsx
import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Chess } from 'chess.js';

export function useStockfishAnalysis() {
  const { sessionId } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Extract a list of FEN positions from a PGN string
   * @param pgn PGN string to convert
   * @param includeStartPosition Whether to include the starting position (default: true)
   * @returns Array of FEN position strings representing each move in the game
   */
  const pgnToFenList = useCallback((pgn: string, includeStartPosition: boolean = true): string[] => {
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
  }, []);

  /**
   * Analyze multiple chess positions with Stockfish
   * @param fenPositions Array of FEN position strings to analyze
   * @param depth Maximum depth for Stockfish analysis (default: 20)
   * @param moveTime Time in milliseconds for each position analysis (default: 60000)
   * @returns Array of analysis results for each position
   */
  const batchStockfishAnalysis = useCallback(async (
    fenPositions: string[],
    depth: number = 20,
    moveTime: number = 60000
  ) => {
    const results = [];

    const { getStockfishService } = await import(
      "@/lib/stockfish/stockfish-service"
    );
    const stockfishService = getStockfishService();
    await stockfishService.waitReady();

    for (let i = 0; i < fenPositions.length; i++) {
      const fen = fenPositions[i];
      const fenParts = fen.split(' ');
      const colorToMove = fenParts.length > 1 ? fenParts[1] : 'w';
      const colorName = colorToMove === 'w' ? 'White' : 'Black';

      console.log(`Analyzing position for ${colorName}:`, fen);
      
      // Update progress state
      setProgress(Math.round(((i + 1) / fenPositions.length) * 100));

      const analysis = await stockfishService.getMoveAndEval(fen, depth, moveTime);

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
  }, []);

  /**
   * Analyze a PGN and send results to API
   * @param pgn PGN string to analyze (required)
   * @param username Optional username for the analysis
   * @param depth Maximum depth for Stockfish analysis (default: 20)
   * @param moveTime Time in milliseconds for each position analysis (default: 60000)
   * @returns Analysis results
   */
  const proceedAnalysis = useCallback(async (
    pgn: string,
    username?: string,
    depth: number = 20,
    moveTime: number = 60000
  ) => {
    if (!pgn) {
      setError(new Error("PGN is required"));
      throw new Error("PGN is required");
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      const fenPositions = pgnToFenList(pgn);
      console.log("Generated FEN positions:", fenPositions.length);

      const analysisResults: any[] = await batchStockfishAnalysis(
        fenPositions,
        depth,
        moveTime
      );
      console.log("Analysis complete:", analysisResults);

      try {
        const { default: axios } = await import('axios');
        const response = await axios.post(
          `${process.env.BASE_URL}/v2/analyze`,
          {
            pgn: pgn,
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
        return response.data;
      } catch (apiError) {
        console.error("Error sending analysis to API:", apiError);
        setError(apiError instanceof Error ? apiError : new Error(String(apiError)));
        throw apiError;
      }
    } catch (error) {
      console.error("Error analyzing PGN:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [sessionId, pgnToFenList, batchStockfishAnalysis]);

  return {
    proceedAnalysis,
    pgnToFenList,
    batchStockfishAnalysis,
    isAnalyzing,
    progress,
    error
  };
}

// Example usage in a component:
// const AnalysisComponent = () => {
//   const { proceedAnalysis, isAnalyzing, progress, error } = useStockfishAnalysis();
//   const [pgn, setPgn] = useState('');
//   const [results, setResults] = useState(null);
//
//   const handleAnalyze = async () => {
//     try {
//       const analysisResults = await proceedAnalysis(pgn);
//       setResults(analysisResults);
//     } catch (err) {
//       console.error("Analysis failed:", err);
//     }
//   };
//
//   return (
//     <div>
//       <textarea value={pgn} onChange={(e) => setPgn(e.target.value)} placeholder="Paste PGN here" />
//       <button onClick={handleAnalyze} disabled={isAnalyzing || !pgn}>
//         {isAnalyzing ? 'Analyzing...' : 'Analyze PGN'}
//       </button>
//       {isAnalyzing && <progress value={progress} max="100" />}
//       {error && <div className="error">{error.message}</div>}
//       {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
//     </div>
//   );
// };