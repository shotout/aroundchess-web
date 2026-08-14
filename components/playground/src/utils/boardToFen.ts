import { PieceType } from '../types/chess';
import { ComputerChessStoreState } from '../types/computer-chess';

export function boardToFen(board: (PieceType | null)[][], state?: Partial<ComputerChessStoreState>): string {
    let fen = '';
    let emptyCount = 0;

    for (let row = 0; row < 8; row++) {
        if (row > 0) {
            fen += '/';
        }

        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];

            if (piece === null) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                
                fen += piece;
            }
        }

        if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
        }
    }

    fen += ` ${state?.currentPlayer === 'white' ? 'w' : 'b'}`;

    let castlingRights = '';
    if (state?.rookMoved) {
        if (!state.rookMoved.white?.left && !state.kingCheckOrMoved?.white) castlingRights += 'K';
        if (!state.rookMoved.white?.right && !state.kingCheckOrMoved?.white) castlingRights += 'Q';
        if (!state.rookMoved.black?.left && !state.kingCheckOrMoved?.black) castlingRights += 'k';
        if (!state.rookMoved.black?.right && !state.kingCheckOrMoved?.black) castlingRights += 'q';
    }
    fen += ` ${castlingRights || '-'}`;

    fen += ' -';

    fen += ` ${state?.fiftyMoveRuleCounter || '0'}`;

    fen += ` ${state?.numberOfFullMoves || '1'}`;

    return fen;
}
