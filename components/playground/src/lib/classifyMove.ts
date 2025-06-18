export type MoveClassification =
  | "brilliant-move"
  | "excellent-move"
  | "great-move"
  | "good-move"
  | "best-move"
  | "miss-move"
  | "inaccuracy-move"
  | "mistake-move"
  | "blunder-move";

let globalStockfishEngine: ReturnType<typeof createStockfish> | null = null;

function getGlobalStockfish() {
  if (!globalStockfishEngine) {
    globalStockfishEngine = createStockfish();
  }
  return globalStockfishEngine;
}

const evaluationCache = new Map<
  string,
  { bestScore: number; bestMove: string; topMoves: string[] }
>();
const CACHE_SIZE = 100;

function getCachedEval(fen: string, depth: number) {
  const key = `${fen}-${depth}`;
  return evaluationCache.get(key);
}

function setCachedEval(
  fen: string,
  depth: number,
  result: { bestScore: number; bestMove: string; topMoves: string[] }
) {
  const key = `${fen}-${depth}`;

  if (evaluationCache.size >= CACHE_SIZE) {
    const firstKey = evaluationCache.keys().next().value;
    if (firstKey) {
      evaluationCache.delete(firstKey);
    }
  }

  evaluationCache.set(key, result);
}

export async function classifyMove(
  fenBefore: string,
  fenAfter: string,
  move: string
): Promise<MoveClassification> {
  const engine = getGlobalStockfish();
  const classificationDepth = 8;

  try {
    let evalBefore = getCachedEval(fenBefore, classificationDepth);
    if (!evalBefore) {
      evalBefore = await engine.getEval(fenBefore, 3, classificationDepth);
      setCachedEval(fenBefore, classificationDepth, evalBefore);
    }

    let evalAfter = getCachedEval(fenAfter, classificationDepth);
    if (!evalAfter) {
      evalAfter = await engine.getEval(fenAfter, 3, classificationDepth);
      setCachedEval(fenAfter, classificationDepth, evalAfter);
    }

    const delta = evalAfter.bestScore - evalBefore.bestScore;
    const absDelta = Math.abs(delta);
    const isTopMove = evalBefore.topMoves.includes(move);

    if (isTopMove && absDelta >= 200) return "brilliant-move";
    if (isTopMove && absDelta >= 0 && absDelta > 50) return "excellent-move";
    if (!isTopMove && absDelta >= -20 && delta < 0) return "great-move";
    if (!isTopMove && absDelta >= -50 && absDelta < -20) return "good-move";
    if (!isTopMove && absDelta == 0) return "best-move";
    if (absDelta < -50 && delta >= -100) return "miss-move";
    if (absDelta < -100 && delta >= -200) return "inaccuracy-move";
    if (absDelta < -200 && absDelta >= -500) return "mistake-move";
    return "blunder-move";
  } catch (error) {
    console.error("Error in classifyMove:", error);
    throw error;
  }
}

export function createStockfish() {
  const worker = new Worker("/stockfish/stockfish-nnue-16-single.js");
  const send = (cmd: string) => worker.postMessage(cmd);

  let isBusy = false;
  const requestQueue: Array<() => void> = [];

  const processQueue = () => {
    if (!isBusy && requestQueue.length > 0) {
      const nextRequest = requestQueue.shift();
      if (nextRequest) nextRequest();
    }
  };

  const getEval = (
    fen: string,
    multipv: number = 3,
    depth: number = 8
  ): Promise<{ bestScore: number; bestMove: string; topMoves: string[] }> => {
    return new Promise((resolve, reject) => {
      const executeEval = () => {
        isBusy = true;
        const evaluations: { score: number; move: string }[] = [];

        const timeout = setTimeout(() => {
          worker.removeEventListener("message", onMessage);
          isBusy = false;
          processQueue();
          reject(new Error("Stockfish evaluation timeout"));
        }, 10000);

        const onMessage = (event: MessageEvent) => {
          const line = event.data;

          if (
            typeof line === "string" &&
            line.includes("info") &&
            line.includes(" pv ")
          ) {
            const match = line.match(
              /score (cp|mate) (-?\d+).* pv ([a-h1-8\s]+)/
            );
            if (match) {
              const [_, type, value, pv] = match;
              const score =
                type === "cp" ? parseInt(value, 10) : value === "0" ? 0 : 10000;
              const move = pv.split(" ")[0];
              evaluations.push({ score, move });
            }
          }

          if (typeof line === "string" && line.startsWith("bestmove")) {
            worker.removeEventListener("message", onMessage);
            clearTimeout(timeout);
            isBusy = false;

            evaluations.sort((a, b) => b.score - a.score);
            resolve({
              bestScore: evaluations[0]?.score || 0,
              bestMove: evaluations[0]?.move || "",
              topMoves: evaluations.map((e) => e.move),
            });

            setTimeout(processQueue, 0);
          }
        };

        worker.addEventListener("message", onMessage);

        send("ucinewgame");
        send(`setoption name MultiPV value ${multipv}`);
        send(`position fen ${fen}`);
        send(`go depth ${depth}`);
      };

      if (isBusy) {
        requestQueue.push(executeEval);
      } else {
        executeEval();
      }
    });
  };

  return {
    getEval,
    terminate: () => {
      worker.terminate();
      globalStockfishEngine = null;
    },
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (globalStockfishEngine) {
      globalStockfishEngine.terminate();
    }
  });
}
