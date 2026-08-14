import { Board } from "../store/useChessStore";
import { NullableLastMove } from "../types/chess";

export const CheckEnpassant = (
  board: Board,
  currentMove: {
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  },
  lastMove: NullableLastMove
) => {
  if (!lastMove) return false;
  
  const piece = board[currentMove.fromRow][currentMove.fromCol];
  if (!piece) return false;
  
  const isPawn = piece.toUpperCase() === 'P';
  if (!isPawn) return false;

  const lastMovedPiece = board[lastMove.toRow][lastMove.toCol];
  if (!lastMovedPiece) return false;

  const isWhitePawn = piece === 'P';
  const direction = isWhitePawn ? -1 : 1;

  return (
    lastMovedPiece.toUpperCase() === 'P' &&
    Math.abs(lastMove.toRow - lastMove.fromRow) === 2 &&
    Math.abs(lastMove.toCol - lastMove.fromCol) === 0 &&
    currentMove.fromRow === lastMove.toRow &&
    Math.abs(currentMove.fromCol - lastMove.toCol) === 1 &&
    currentMove.toCol === lastMove.toCol &&
    currentMove.toRow === lastMove.toRow + direction
  );
};
