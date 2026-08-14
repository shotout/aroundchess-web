import { ChessMove } from "@/components/playground/src/types/computer-chess";

export function generateMoveNotation(
  moveOrPiece: ChessMove | string,
  boardOrFromRow: (string | null)[][] | number,
  fromCol?: number,
  toRow?: number,
  toCol?: number,
  capturedPiece?: string | null,
  isCheck?: boolean,
  isCheckmate?: boolean
): string {
  let piece: string;
  let from: { row: number; col: number };
  let to: { row: number; col: number };
  let board: (string | null)[][];
  let isCapture: boolean;

  if (typeof moveOrPiece === 'string') {
    piece = moveOrPiece;
    from = { row: boardOrFromRow as number, col: fromCol! };
    to = { row: toRow!, col: toCol! };
    isCapture = capturedPiece !== null && capturedPiece !== undefined;
  } else {
    piece = moveOrPiece.type;
    from = { row: moveOrPiece.fromRow, col: moveOrPiece.fromCol };
    to = { row: moveOrPiece.toRow, col: moveOrPiece.toCol };
    board = boardOrFromRow as (string | null)[][];
    isCapture = board[to.row][to.col] !== null;
  }

  piece = piece.toUpperCase();
  
  const files = 'abcdefgh';
  const ranks = '87654321';
  const fromSquare = `${files[from.col]}${ranks[from.row]}`;
  const toSquare = `${files[to.col]}${ranks[to.row]}`;
  
  if (piece === 'K' && Math.abs(to.col - from.col) === 2) {
    return `${to.col > from.col ? 'O-O' : 'O-O-O'}${isCheckmate ? '#' : isCheck ? '+' : ''}`;
  }
  
  if (piece === 'P') {
    if (isCapture) {
      return `${fromSquare[0]}x${toSquare}${isCheckmate ? '#' : isCheck ? '+' : ''}`;
    }
    return `${toSquare}${isCheckmate ? '#' : isCheck ? '+' : ''}`;
  }
  
  return `${piece}${isCapture ? 'x' : ''}${toSquare}${isCheckmate ? '#' : isCheck ? '+' : ''}`;
}
