import { syzygyService } from './syzygy-service';

interface SyzygyMove {
    uci: string;
    category: string;
    dtm: number | null;
}

interface SyzygyResponse {
    category: string;
    moves: SyzygyMove[];
}

export function getSyzygyMove(fen: string, chess: any, player: any) {
    return new Promise((resolve, reject) => {
        syzygyService.get(fen)
            .then(response => {
                const data: SyzygyResponse = response.data;
                let move;
                if (data.category == 'win' && data.moves.filter((move) => move.category === "loss" && move.dtm == null).length == 0) {
                    move = data.moves[0];
                }
                else {
                    const syzygyCandidates = data.category == 'win'
                        ? data.moves.filter(move => move.category == 'loss')
                        : data.moves.filter(move => move.category == 'draw');

                    if (syzygyCandidates.length == 1) {
                        move = syzygyCandidates[0];
                    } else {
                        const syzygyBestCandidate = data.category == 'win'
                            ? syzygyCandidates.reduce((minMove, currentMove) => {
                                if (minMove.dtm === null && currentMove.dtm === null) return minMove;
                                if (minMove.dtm === null) return currentMove;
                                if (currentMove.dtm === null) return minMove;
                                return Math.abs(currentMove.dtm) < Math.abs(minMove.dtm) ? currentMove : minMove;
                            }, syzygyCandidates[0])
                            : syzygyCandidates[0];

                        resolve({
                            needStockfish: true,
                            syzygyCandidates,
                            syzygyBestCandidate
                        });
                        return;
                    }
                }

                const bestmove = move.uci;
                const match = bestmove.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/);
                if (!match) {
                    reject(new Error('Invalid move format'));
                    return;
                }

                const [, from, to, promotion] = match;
                const mateDistance = move.dtm
                    ? move.dtm * (chess.turn() == player.value ? -1 : 1) * (player.value == 'b' ? -1 : 1)
                    : undefined;

                resolve({ from, to, promotion, mateDistance });
            })
            .catch(reject);
    });
}
