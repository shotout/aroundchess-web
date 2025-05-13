export function createStockfish() {
  const worker = new Worker("/stockfish/stockfish-nnue-16-single.js");
 const send = (cmd: string) => worker.postMessage(cmd);

  const getEval = (
    fen: string,
    multipv: number = 3,
    depth: number = 15
  ): Promise<{ bestScore: number; bestMove: string; topMoves: string[] }> => {
    return new Promise((resolve) => {
      let evaluations: { score: number; move: string }[] = [];

      const onMessage = (event: MessageEvent) => {
        const line = event.data;

        if (typeof line === 'string' && line.includes('info') && line.includes(' pv ')) {
          const match = line.match(/score (cp|mate) (-?\d+).* pv ([a-h1-8\s]+)/);
          if (match) {
            const [_, type, value, pv] = match;
            const score = type === 'cp' ? parseInt(value, 10) : (value === '0' ? 0 : 10000);
            const move = pv.split(' ')[0];
            evaluations.push({ score, move });
          }
        }

        if (typeof line === 'string' && line.startsWith('bestmove')) {
          worker.removeEventListener('message', onMessage);
          evaluations.sort((a, b) => b.score - a.score);
          resolve({
            bestScore: evaluations[0].score,
            bestMove: evaluations[0].move,
            topMoves: evaluations.map(e => e.move),
          });
        }
      };

      worker.addEventListener('message', onMessage);

      send('ucinewgame');
      send(`setoption name MultiPV value ${multipv}`);
      send(`position fen ${fen}`);
      send(`go depth ${depth}`);
    });
  };

  return { getEval, terminate: () => worker.terminate() };
}