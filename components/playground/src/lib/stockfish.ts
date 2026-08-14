declare global {
  interface Window {
    Stockfish?: any;
  }
}

import { Chess } from "chess.js";

interface EngineMessage {
  bestMove: any;
  positionEvaluation?: string;
  possibleMate?: string;
  pv?: string;
  depth?: number;
}

interface EngineMessageCallback {
  (message: EngineMessage): void;
}

interface EloSettings {
  depth: number;
  randomness: number;
}

export class Engine {
  private worker: Worker | null = null;
  private messageCallback: EngineMessageCallback | null = null;
  private isReady: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.worker = new Worker("/stockfish/stockfish-nnue-16-single.js");
      this.worker.onmessage = (e) => this.handleMessage(e.data);
      this.init();
    }
  }

  private init() {
    if (!this.worker) return;

    const commands = [
      "uci",
      "setoption name Use NNUE value false",
      "setoption name UCI_AnalyseMode value true",
      "setoption name MultiPV value 1",
      "setoption name Hash value 16",
      "setoption name Threads value 1",
      "isready",
    ];

    commands.forEach((cmd) => {
      this.worker?.postMessage(cmd);
    });
  }

  private handleMessage(data: string) {
    if (data === "readyok") {
      this.isReady = true;
      return;
    }

    if (!this.messageCallback) return;

    if (data.startsWith("info")) {
      const scoreMatch = data.match(/score (?:cp|mate) (-?\d+)/);
      const pvMatch = data.match(/pv ([a-h][1-8][a-h][1-8])/);
      const depthMatch = data.match(/depth (\d+)/);

      if (pvMatch && scoreMatch) {
        const move = pvMatch[1];
        const scoreType = scoreMatch[1];
        const value = parseInt(scoreMatch[2]);
        scoreType === "cp" ? value : value > 0 ? 10000 - value : -10000 - value;

        this.messageCallback({
          pv: move,
          depth: depthMatch ? parseInt(depthMatch[1]) : undefined,
          positionEvaluation: scoreType,
          bestMove: undefined,
        });
      }
    }

    if (data.startsWith("bestmove")) {
      const parts = data.split(" ");
      if (parts.length >= 2) {
        const move = parts[1];
        if (move && move !== "(none)" && move.length >= 4) {
          this.messageCallback({
            pv: move,
            bestMove: move,
          });
          this.stop();
        }
      }
    }
  }

  private getEloSettings(elo: number): EloSettings {
    if (elo <= 250) return { depth: 1, randomness: 1.0 };
    else if (elo <= 400) return { depth: 1, randomness: 0.95 };
    else if (elo <= 600) return { depth: 2, randomness: 0.9 };
    else if (elo <= 800) return { depth: 2, randomness: 0.85 };
    else if (elo <= 1000) return { depth: 3, randomness: 0.8 };
    else if (elo <= 1200) return { depth: 4, randomness: 0.7 };
    else if (elo <= 1400) return { depth: 5, randomness: 0.6 };
    else if (elo <= 1600) return { depth: 6, randomness: 0.5 };
    else if (elo <= 1800) return { depth: 8, randomness: 0.4 };
    else if (elo <= 2000) return { depth: 10, randomness: 0.3 };
    else if (elo <= 2200) return { depth: 12, randomness: 0.2 };
    else if (elo <= 2400) return { depth: 14, randomness: 0.15 };
    else if (elo <= 2600) return { depth: 16, randomness: 0.1 };
    else return { depth: 18, randomness: 0.01 };
  }

  private getRandomMove(fen: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const tempGame = new Chess(fen);
        const legalMoves = tempGame.moves({ verbose: true });

        if (legalMoves.length === 0) {
          reject(new Error("No legal moves available"));
          return;
        }

        const randomIndex = Math.floor(Math.random() * legalMoves.length);
        const randomMove = legalMoves[randomIndex];

        let moveString = randomMove.from + randomMove.to;
        if (randomMove.promotion) {
          moveString += randomMove.promotion;
        }

        console.log("🎲");
        resolve(moveString);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getStockfishMove(fen: string, playerElo: number): Promise<string> {
    const settings = this.getEloSettings(playerElo);
    const shouldUseRandomMove = Math.random() < settings.randomness;

    if (shouldUseRandomMove && playerElo <= 400) {
      return this.getRandomMove(fen);
    }

    if (playerElo <= 1000) {
      console.log("🤖");
    } else {
      console.log("🔍");
    }

    return new Promise((resolve, reject) => {
      const stockfish = new Worker("/stockfish/stockfish-nnue-16-single.js");

      let skillLevel;
      if (playerElo <= 250) {
        skillLevel = 0;
      } else if (playerElo <= 400) {
        skillLevel = 1;
      } else if (playerElo <= 600) {
        skillLevel = 2;
      } else {
        skillLevel = Math.floor((1 - settings.randomness) * 20);
      }

      stockfish.postMessage("uci");
      stockfish.postMessage(`setoption name Skill Level value ${skillLevel}`);

      if (playerElo <= 600) {
        stockfish.postMessage("setoption name Use NNUE value false");
        stockfish.postMessage("setoption name Hash value 1");
        stockfish.postMessage("setoption name Threads value 8");
        stockfish.postMessage("setoption name Contempt value -100");
      }

      stockfish.postMessage(`setoption name MultiPV value 1`);
      stockfish.postMessage("ucinewgame");
      stockfish.postMessage(`position fen ${fen}`);

      if (playerElo <= 250) {
        stockfish.postMessage("go movetime 50");
      } else if (playerElo <= 400) {
        stockfish.postMessage("go movetime 100");
      } else {
        stockfish.postMessage(`go depth ${settings.depth}`);
      }

      const timeout = setTimeout(() => {
        stockfish.terminate();
        reject(new Error("Stockfish timeout"));
      }, 5000);

      stockfish.onmessage = function (e) {
        const line = typeof e === "object" ? e.data : e;

        if (line.startsWith("bestmove")) {
          clearTimeout(timeout);
          const move = line.split(" ")[1];
          stockfish.terminate();
          if (!move || move === "(none)" || move === "0000") {
            reject(new Error("No legal moves available"));
            return;
          }
          resolve(move);
        }
      };

      stockfish.onerror = (err) => {
        clearTimeout(timeout);
        stockfish.terminate();
        reject(err);
      };
    });
  }

  eloToDepth(elo: number): number {
    const minDepth = 1;
    const maxDepth = 26;
    const minElo = 250;
    const maxElo = 2800;
    const clampedElo = Math.min(Math.max(elo, minElo), maxElo);
    return Math.round(
      ((clampedElo - minElo) / (maxElo - minElo)) * (maxDepth - minDepth) +
        minDepth
    );
  }

  eloToSkillLevel(elo: number): number {
    const minElo = 250;
    const maxElo = 2800;
    const clampedElo = Math.min(Math.max(elo, minElo), maxElo);
    return Math.round(((clampedElo - minElo) / (maxElo - minElo)) * 20);
  }

  evaluatePosition(fen: string, stockfishLevel: number) {
    if (!this.worker) return;
    this.stop();
    this.worker.postMessage("position fen " + fen);
    this.worker.postMessage(`go depth ${stockfishLevel}`);
    this.worker.postMessage("go movetime 2000");
  }

  onMessage(callback: EngineMessageCallback) {
    this.messageCallback = callback;
  }

  stop() {
    if (!this.worker) return;
    this.worker.postMessage("stop");
  }

  destroy() {
    if (!this.worker) return;
    this.stop();
    this.worker.terminate();
    this.worker = null;
    this.isReady = false;
  }
}

let stockfishService: Engine | null = null;

export const getStockfishService = () => {
  if (!stockfishService) {
    stockfishService = new Engine();
  }
  return stockfishService;
};
