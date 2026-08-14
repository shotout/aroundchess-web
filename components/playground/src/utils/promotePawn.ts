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
  
  if (piece !== (currentPlayer === "white" ? "P" : "p")) return null;
  
  if (currentPlayer === "white" && toRow === 0) {
    return {
      row: toRow,
      col: toCol,
      piece: piece,
    };
  }
  
  if (currentPlayer === "black" && toRow === 7) {
    return {
      row: toRow,
      col: toCol,
      piece: piece,
    };
  }

  return null;
};
