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

  // Get the last moved piece
  const lastMovedPiece = board[lastMove.toRow][lastMove.toCol];
  if (!lastMovedPiece) return false;

  const isWhitePawn = piece === 'P';
  const direction = isWhitePawn ? -1 : 1;

  // En passant rules:
  // 1. Last move must be a pawn moving two squares from starting position
  // 2. Capturing pawn must be on the same rank as the captured pawn
  // 3. Capturing pawn must be adjacent to the captured pawn
  // 4. Target square must be behind the captured pawn (the square it skipped)
  return (
    lastMovedPiece.toUpperCase() === 'P' &&                   // Must capture a pawn
    Math.abs(lastMove.toRow - lastMove.fromRow) === 2 &&      // Pawn moved two squares
    Math.abs(lastMove.toCol - lastMove.fromCol) === 0 &&      // Pawn moved vertically
    currentMove.fromRow === lastMove.toRow &&                 // Capturing pawn is on same rank
    Math.abs(currentMove.fromCol - lastMove.toCol) === 1 &&   // Pawns are on adjacent files
    currentMove.toCol === lastMove.toCol &&                   // Target square is same file as captured pawn
    currentMove.toRow === lastMove.toRow + direction          // Target square is one row behind captured pawn
  );
};
