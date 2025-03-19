import { Chess } from 'chess.js';

class StockfishService {
  private worker: Worker | null = null;
  private isReady = false;
  private readonly DEFAULT_DEPTH = 20;
  private readonly DEFAULT_RANDOMNESS = 0;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = new Promise(async (resolve) => {
      if (typeof window !== 'undefined') {
        try {
          // Use single-threaded version of Stockfish
          this.worker = new Worker('/stockfish/Stockfish.js');

          this.worker.onmessage = (e) => {
            if (e.data === 'uciok') {
              this.isReady = true;
              this.worker?.postMessage('isready');
              resolve();
            } else if (e.data === 'readyok') {
              // Ready to accept commands
            }
          };

          this.worker.onerror = (error) => {
            console.error('Stockfish worker error:', error);
          };

          this.worker.postMessage('uci');
        } catch (error) {
          console.error('Error initializing Stockfish:', error);
        }
      }
    });
  }

  async waitReady(): Promise<void> {
    await this.initPromise;
    if (!this.isReady) {
      return new Promise((resolve) => {
        const checkReady = setInterval(() => {
          if (this.isReady) {
            clearInterval(checkReady);
            resolve();
          }
        }, 100);
      });
    }
  }

  // Helper function to get move weights based on ELO
  private getMoveWeights(elo: number): { normal: number; capture: number; check: number; stockfish: number } {
    if (elo <= 250) return { normal: 0.6, capture: 0.3, check: 0.1, stockfish: 0 };       // Complete beginner
    if (elo <= 400) return { normal: 0.5, capture: 0.3, check: 0.15, stockfish: 0.05 };   // Just learned rules
    if (elo <= 600) return { normal: 0.4, capture: 0.3, check: 0.15, stockfish: 0.15 };   // Starting to think
    if (elo <= 800) return { normal: 0.3, capture: 0.3, check: 0.15, stockfish: 0.25 };   // Basic understanding
    if (elo <= 1000) return { normal: 0.2, capture: 0.3, check: 0.15, stockfish: 0.35 };  // Developing player
    if (elo <= 1200) return { normal: 0.15, capture: 0.25, check: 0.1, stockfish: 0.5 };  // Casual player
    if (elo <= 1400) return { normal: 0.1, capture: 0.2, check: 0.1, stockfish: 0.6 };    // Club player
    if (elo <= 1600) return { normal: 0.05, capture: 0.15, check: 0.1, stockfish: 0.7 };  // Strong club player
    return { normal: 0, capture: 0, check: 0, stockfish: 1 };  // Above 1600: pure Stockfish
  }

  async getBestMove(
    fen: string,
    depth: number = this.DEFAULT_DEPTH,
    randomness: number = this.DEFAULT_RANDOMNESS
  ): Promise<string> {
    await this.waitReady();

    if (!this.worker || !this.isReady) {
      throw new Error('Stockfish not initialized');
    }

    return new Promise((resolve) => {
      if (!this.worker) return;

      // Calculate approximate ELO from depth and randomness
      const approximateElo = Math.round((1 - randomness) * 3000);
      const weights = this.getMoveWeights(approximateElo);

      // For lower ELOs, use a mix of human-like moves and Stockfish
      if (weights.stockfish < 1) {
        // Create a chess instance to get all legal moves
        const chess = new Chess(fen);
        const moves = chess.moves({ verbose: true });

        // Categorize moves
        const captures = moves.filter(m => m.flags.includes('c')); // Capture moves
        const checks = moves.filter(m => m.flags.includes('k')); // Check moves
        const normalMoves = moves.filter(m => !m.flags.includes('c') && !m.flags.includes('k')); // Non-capture, non-check moves

        const moveChoice = Math.random();
        let selectedMove;

        // Decide which type of move to make based on weights
        if (moveChoice < weights.normal && normalMoves.length > 0) {
          selectedMove = normalMoves[Math.floor(Math.random() * normalMoves.length)];
        } else if (moveChoice < weights.normal + weights.capture && captures.length > 0) {
          selectedMove = captures[Math.floor(Math.random() * captures.length)];
        } else if (moveChoice < weights.normal + weights.capture + weights.check && checks.length > 0) {
          selectedMove = checks[Math.floor(Math.random() * checks.length)];
        } else if (moveChoice < weights.normal + weights.capture + weights.check + weights.stockfish) {
          // Let Stockfish decide this percentage of moves
          this.worker.onmessage = (e) => {
            const msg = e.data;
            if (msg.startsWith('bestmove')) {
              const move = msg.split(' ')[1];
              resolve(move);
            }
          };

          const skillLevel = Math.floor((1 - randomness) * 20);
          this.worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
          this.worker.postMessage(`setoption name MultiPV value 1`);
          this.worker.postMessage(`setoption name Contempt value 0`);
          this.worker.postMessage(`setoption name Threads value 2`);
          this.worker.postMessage(`setoption name Hash value 1024`);

          this.worker.postMessage(`position fen ${fen}`);
          this.worker.postMessage(`go depth ${depth}`);
          return;
        } else {
          // If all else fails, make a random legal move
          selectedMove = moves[Math.floor(Math.random() * moves.length)];
        }

        resolve(selectedMove.from + selectedMove.to);
        return;
      }

      // For higher ELOs (above 1600), use pure Stockfish
      this.worker.onmessage = (e) => {
        const msg = e.data;
        if (msg.startsWith('bestmove')) {
          const move = msg.split(' ')[1];
          resolve(move);
        }
      };

      const skillLevel = Math.floor((1 - randomness) * 20);
      this.worker.postMessage(`setoption name Skill Level value ${skillLevel}`);
      this.worker.postMessage(`setoption name MultiPV value 1`);
      this.worker.postMessage(`setoption name Contempt value ${Math.min(skillLevel * 5, 50)}`);

      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  async getEvaluation(fen: string, depth: number = this.DEFAULT_DEPTH): Promise<number> {
    if (!this.worker || !this.isReady) {
      throw new Error('Stockfish not initialized');
    }

    return new Promise((resolve) => {
      if (!this.worker) return;

      this.worker.onmessage = (e) => {
        const msg = e.data;
        if (msg.startsWith('info') && msg.includes('score cp')) {
          const score = parseInt(msg.split('score cp ')[1].split(' ')[0]);
          resolve(score / 100); // Convert centipawns to pawns
        }
      };

      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  async getMoveAndEval(
    fen: string,
    depth: number = this.DEFAULT_DEPTH,
    moveTime: number = 60000
  ): Promise<{
    fen: string;
    depth: number;
    bestMove: string;
    alternativeBestMove: string;
    evaluationCentiPawns: number;
    evaluationPawns: number;
  }> {
    await this.waitReady();

    if (!this.worker || !this.isReady) {
      throw new Error('Stockfish not initialized');
    }

    return new Promise((resolve) => {
      if (!this.worker) return;

      let bestMove = '';
      let alternativeBestMove = '';
      let evalCp: number | null = null;
      let actualDepth = 0;
      const moves: { move: string, score: number }[] = [];

      this.worker.onmessage = (e) => {
        const msg = e.data;

        if (msg.startsWith('info') && msg.includes('score cp')) {
          try {
            const multipvMatch = msg.match(/multipv (\d+)/);
            const scoreMatch = msg.match(/score cp (-?\d+)/);
            const pv = msg.match(/pv ([a-h][1-8][a-h][1-8])/);
            const depthMatch = msg.match(/depth (\d+)/);

            if (multipvMatch && scoreMatch && pv) {
              const index = parseInt(multipvMatch[1]);
              const score = parseInt(scoreMatch[1]);
              const move = pv[1];

              moves[index - 1] = { move, score };

              if (index === 1) {
                evalCp = score;
                if (depthMatch) {
                  const currentDepth = parseInt(depthMatch[1]);
                  actualDepth = Math.max(actualDepth, currentDepth);
                }
              }
            }
          } catch (error) {
            console.error('Error parsing evaluation:', error);
          }
        }

        if (msg.startsWith('bestmove')) {
          bestMove = msg.split(' ')[1];

          if (moves.length >= 2) {
            alternativeBestMove = moves[1].move;
          } else {
            alternativeBestMove = bestMove;
          }

          const evaluationCentiPawns = evalCp !== null ? evalCp : 0;

          resolve({
            fen,
            depth: actualDepth,
            bestMove,
            alternativeBestMove,
            evaluationCentiPawns,
            evaluationPawns: evaluationCentiPawns / 100
          });
        }
      };

      this.worker.postMessage(`setoption name MultiPV value 2`);
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth} movetime ${moveTime}`);
    });
  }

  destroy() {
    this.worker?.terminate();
    this.worker = null;
    this.isReady = false;
  }
}

// Singleton instance
let stockfishService: StockfishService | null = null;

export const getStockfishService = () => {
  if (!stockfishService) {
    stockfishService = new StockfishService();
  }
  return stockfishService;
};
