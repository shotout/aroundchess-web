// Add TypeScript declarations
declare global {
  interface Window {
    Stockfish?: any;
  }
}

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

    // Initialize with all settings at once
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
      //console.log("Sending command:", cmd);
      this.worker?.postMessage(cmd);
    });
  }

  private handleMessage(data: string) {
    // //console.log('Engine received:', data);

    // Handle initialization messages
    if (data === "readyok") {
      this.isReady = true;
      return;
    }

    if (!this.messageCallback) return;
    // //console.log("handleMessage",data)
    // Parse info messages for moves
    if (data.startsWith("info")) {
      // Look for score and pv
      const scoreMatch = data.match(/score (?:cp|mate) (-?\d+)/);
      const pvMatch = data.match(/pv ([a-h][1-8][a-h][1-8])/);
      const depthMatch = data.match(/depth (\d+)/);

      if (pvMatch && scoreMatch) {
        const move = pvMatch[1];
        const scoreType = scoreMatch[1];
        const value = parseInt(scoreMatch[2]);
        scoreType === "cp" ? value : value > 0 ? 10000 - value : -10000 - value;
        //console.log("Found move, depth move:", depthMatch, move);
        this.messageCallback({
          pv: move,
          depth: depthMatch ? parseInt(depthMatch[1]) : undefined,
          positionEvaluation: scoreType,
          bestMove: undefined,
        });
      }
    }

    // Handle bestmove messages
    if (data.startsWith("bestmove")) {
      const parts = data.split(" ");
      if (parts.length >= 2) {
        const move = parts[1];
        if (move && move !== "(none)" && move.length >= 4) {
          //console.log("Best move found:", move);
          this.messageCallback({
            pv: move,
            bestMove: move,
          });
          this.stop();
        }
      }
    }
  }

  async getStockfishMove(fen: string, playerElo: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const stockfish = new Worker("/stockfish/stockfish-nnue-16-single.js"); // or stockfish.wasm if using WebAssembly

      const skillLevel = this.eloToSkillLevel(playerElo);
      console.log("skillLevel", skillLevel);
      stockfish.postMessage("uci");
      stockfish.postMessage("setoption name Skill Level value " + skillLevel);
      stockfish.postMessage("ucinewgame");
      stockfish.postMessage("position fen " + fen);
      const depth = this.eloToDepth(playerElo);
      console.log("depth", depth);
      stockfish.postMessage(`go depth ${depth}`);

      stockfish.onmessage = function (e) {
        const line = typeof e === "object" ? e.data : e;
        if (line.startsWith("bestmove")) {
          const move = line.split(" ")[1];
          stockfish.terminate();
          resolve(move);
        }
      };

      stockfish.onerror = (err) => {
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

    // Stop any ongoing analysis
    this.stop();

    // Set position and start analysis
    // //console.log('Evaluating position:', fen);
    this.worker.postMessage("position fen " + fen);
    this.worker.postMessage(`go depth ${stockfishLevel}`);
    this.worker.postMessage("go movetime 2000"); // Just use movetime for faster response
  }

  onMessage(callback: EngineMessageCallback) {
    this.messageCallback = callback;
  }

  stop() {
    if (!this.worker) return;
    //console.log("Stopping engine");
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

// Singleton instance
let stockfishService: Engine | null = null;

export const getStockfishService = () => {
  if (!stockfishService) {
    //console.log("Creating new StockfishService instance"); // Debug log
    stockfishService = new Engine();
  }
  return stockfishService;
};
