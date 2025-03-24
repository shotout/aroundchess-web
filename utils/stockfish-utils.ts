import { useLoadingNumber } from '@/app/store/loadingNumber';
import { Chess } from 'chess.js';

/**
 * Analyze multiple chess positions with Stockfish
 * @param fenPositions Array of FEN position strings to analyze
 * @param depth Maximum depth for Stockfish analysis (default: 20)
 * @param moveTime Time in milliseconds for each position analysis (default: 60000)
 * @returns Array of analysis results for each position
 */
export async function batchStockfishAnalysis(
    fenPositions: string[],
    depth: number = 20,
    moveTime: number = 60000
) {
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
}

/**
 * Extract a list of FEN positions from a PGN string
 * @param pgn PGN string to convert
 * @param includeStartPosition Whether to include the starting position (default: true)
 * @returns Array of FEN position strings representing each move in the game
 */
export function pgnToFenList(pgn: string, includeStartPosition: boolean = true): string[] {
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
}

/**
 * Analyze a PGN and send results to API
 * @param pgn PGN string to analyze (required)
 * @param username Optional username for the analysis
 * @param depth Maximum depth for Stockfish analysis (default: 20)
 * @param moveTime Time in milliseconds for each position analysis (default: 60000)
 * @returns Analysis results
 */
export async function proceedAnalysis(
    pgn: string,
    username?: string,
    depth: number = 20,
    moveTime: number = 60000
) {
    if (!pgn) throw new Error("PGN is required");

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
                }
            );

            console.log("API response:", response.data);
            return response.data;
        } catch (apiError) {
            console.error("Error sending analysis to API:", apiError);
            throw apiError;
        }
    } catch (error) {
        console.error("Error analyzing PGN:", error);
        throw error;
    }
}