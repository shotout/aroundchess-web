import type { Board, PieceType } from "../types/chess";
import { isMoveValid } from "./validMove";
import { typeCheckMate } from "../types/chess";
import { isMovePossible } from "./possibleMove";

export function isKingInCheck(board: (PieceType | null)[][], currentPlayer: "white" | "black"): boolean {
  const king = currentPlayer === "white" ? "K" : "k";
  let kingRow = -1;
  let kingCol = -1;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === king) {
        kingRow = row;
        kingCol = col;
        break;
      }
    }
    if (kingRow !== -1) break;
  }

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (
        piece &&
        (currentPlayer === "white"
          ? piece === piece.toLowerCase()
          : piece === piece.toUpperCase())
      ) {
        if (isMoveValid(board as (PieceType | null)[][], row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isCheckMate(board: Board, color: "white" | "black"): boolean {
  if (!isKingInCheck(board, color)) {
    console.log('Not in check, cannot be checkmate');
    return false;
  }

  console.log(`Checking checkmate for ${color}`);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      const isPieceWhite = piece === piece.toUpperCase();
      if ((color === "white" && !isPieceWhite) || (color === "black" && isPieceWhite)) continue;

      for (let newRow = 0; newRow < 8; newRow++) {
        for (let newCol = 0; newCol < 8; newCol++) {
          if (row === newRow && col === newCol) continue;
          
          if (isMovePossible(board, row, col, newRow, newCol, color)) {
            const newBoard = JSON.parse(JSON.stringify(board));
            
            newBoard[newRow][newCol] = newBoard[row][col];
            newBoard[row][col] = null;
            
            if (!isKingInCheck(newBoard, color)) {
              console.log(`Found escape move: ${row},${col} to ${newRow},${newCol}`);
              return false;
            }
          }
        }
      }
    }
  }
  
  console.log('No escape moves found - checkmate!');
  return true;
}

const isInsufficientMaterial = (board: Board): boolean => {
  const pieces = board.flat().filter((piece) => piece !== null);

  const nonKingPieces = pieces.filter((piece) => piece.toLowerCase() !== "k");

  if (nonKingPieces.length === 0) {
    return true;
  }

  if (nonKingPieces.length === 1) {
    const piece = nonKingPieces[0].toLowerCase();
    if (piece === "b" || piece === "n") {
      return true;
    }
  }

  return false;
};
