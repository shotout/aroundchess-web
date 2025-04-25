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
    if (typeof window !== 'undefined') {
      this.worker = new Worker('/stockfish/stockfish-nnue-16-single.js');
      this.worker.onmessage = (e) => this.handleMessage(e.data);
      this.init();
    }
  }

  private init() {
    if (!this.worker) return;
    
    // Initialize with all settings at once
    const commands = [
      'uci',
      'setoption name Use NNUE value false',
      'setoption name UCI_AnalyseMode value true',
      'setoption name MultiPV value 1',
      'setoption name Hash value 16',
      'setoption name Threads value 1',
      'isready'
    ];
    
    commands.forEach(cmd => {
      console.log('Sending command:', cmd);
      this.worker?.postMessage(cmd);
    });
  }

  private handleMessage(data: string) {
    // console.log('Engine received:', data);

    // Handle initialization messages
    if (data === 'readyok') {
      this.isReady = true;
      return;
    }

    if (!this.messageCallback) return;
    // console.log("handleMessage",data)
    // Parse info messages for moves
    if (data.startsWith('info')) {
      // Look for score and pv
      const scoreMatch = data.match(/score (?:cp|mate) (-?\d+)/);
      const pvMatch = data.match(/pv ([a-h][1-8][a-h][1-8])/);
      const depthMatch = data.match(/depth (\d+)/);
      
      if (pvMatch) {
        const move = pvMatch[1];
        console.log('Found move, depth move:',depthMatch, move);
        this.messageCallback({
          pv: move,
          depth: depthMatch ? parseInt(depthMatch[1]) : undefined,
          positionEvaluation: scoreMatch ? scoreMatch[1] : undefined,
          bestMove: undefined
        });
      }
    }
    
    // Handle bestmove messages
    if (data.startsWith('bestmove')) {
      const parts = data.split(' ');
      if (parts.length >= 2) {
        const move = parts[1];
        if (move && move !== '(none)' && move.length >= 4) {
          console.log('Best move found:', move);
          this.messageCallback({
            pv: move,
            bestMove: move
          });
          this.stop();
        }
      }
    }
  }

  setSkillLevel(skillLevel: number) {
    if (!this.worker) return;
    
    // Set UCI_LimitStrength and UCI_Elo for accurate ELO-based play
    const commands = [
      `setoption name UCI_LimitStrength value true`,
      `setoption name UCI_Elo value ${skillLevel}`,
      'isready'
    ];
    
    commands.forEach(cmd => {
      console.log('Setting skill level:', cmd);
      this.worker?.postMessage(cmd);
    });
  }



  evaluatePosition(fen: string, stockfishLevel: number) {
    if (!this.worker) return;
    
    // Stop any ongoing analysis
    this.stop();
    
    // Set position and start analysis
    // console.log('Evaluating position:', fen);
    this.worker.postMessage('position fen ' + fen);
    this.worker.postMessage(`go depth ${stockfishLevel}`);
    this.worker.postMessage('go movetime 2000'); // Just use movetime for faster response
  }

  onMessage(callback: EngineMessageCallback) {
    this.messageCallback = callback;
  }

  stop() {
    if (!this.worker) return;
    console.log('Stopping engine');
    this.worker.postMessage('stop');
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
    console.log('Creating new StockfishService instance'); // Debug log
    stockfishService = new Engine();
  }
  return stockfishService;
};
