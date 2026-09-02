import { PieceType } from '../types/chess';
import { ComputerChessStoreState } from '../types/computer-chess';

export function boardToFen(board: (PieceType | null)[][], state?: Partial<ComputerChessStoreState>): string {
    let fen = '';
    let emptyCount = 0;

    // Process each row
    for (let row = 0; row < 8; row++) {
        if (row > 0) {
            fen += '/';
        }

        // Process each column in the row
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];

            if (piece === null) {
                emptyCount++;
            } else {
                // If there were empty squares before this piece, add the count
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                
                // Add the piece symbol - uppercase is white, lowercase is black
                fen += piece;
            }
        }

        // Add any remaining empty squares at the end of the row
        if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
        }
    }

    // Add the current player
    fen += ` ${state?.currentPlayer === 'white' ? 'w' : 'b'}`;

    // Add castling rights
    let castlingRights = '';
    if (state?.rookMoved) {
        if (!state.rookMoved.white?.left && !state.kingCheckOrMoved?.white) castlingRights += 'K';
        if (!state.rookMoved.white?.right && !state.kingCheckOrMoved?.white) castlingRights += 'Q';
        if (!state.rookMoved.black?.left && !state.kingCheckOrMoved?.black) castlingRights += 'k';
        if (!state.rookMoved.black?.right && !state.kingCheckOrMoved?.black) castlingRights += 'q';
    }
    fen += ` ${castlingRights || '-'}`;

    // Add en passant target square (currently not tracking this)
    fen += ' -';

    // Add halfmove clock (for fifty-move rule)
    fen += ` ${state?.fiftyMoveRuleCounter || '0'}`;

    // Add fullmove number
    fen += ` ${state?.numberOfFullMoves || '1'}`;

    return fen;
}
