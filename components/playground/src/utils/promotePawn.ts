import { Player } from "../types/chess";
import { Board } from "../store/useChessStore";
import { typePromotePawn } from "../types/chess";

export const promotePawn = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  currentPlayer: Player
): typePromotePawn | null => {
  const piece = board[fromRow][fromCol];
  
  // Check if it's a pawn
  if (piece !== (currentPlayer === "white" ? "P" : "p")) return null;
  
  // Check if white pawn reaches the top rank (row 0)
  if (currentPlayer === "white" && toRow === 0) {
    return {
      row: toRow,
      col: toCol,
      piece: piece,
    };
  }
  
  // Check if black pawn reaches the bottom rank (row 7)
  if (currentPlayer === "black" && toRow === 7) {
    return {
      row: toRow,
      col: toCol,
      piece: piece,
    };
  }

  return null;
};
