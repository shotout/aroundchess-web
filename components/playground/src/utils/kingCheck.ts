import type { Board, PieceType } from "../types/chess";
import { isMoveValid } from "./validMove";
import { typeCheckMate } from "../types/chess";
import { isMovePossible } from "./possibleMove";

export function isKingInCheck(board: (PieceType | null)[][], currentPlayer: "white" | "black"): boolean {
  const king = currentPlayer === "white" ? "K" : "k";
  let kingRow = -1;
  let kingCol = -1;

  // Find the king's position
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

  // Check for threats to the king
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
  // First check if the king is in check
  if (!isKingInCheck(board, color)) {
    console.log('Not in check, cannot be checkmate');
    return false;
  }

  console.log(`Checking checkmate for ${color}`);

  // Try all possible moves for all pieces of the current color
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      
      // Check if piece belongs to the current player
      const isPieceWhite = piece === piece.toUpperCase();
      if ((color === "white" && !isPieceWhite) || (color === "black" && isPieceWhite)) continue;

      // Try moving this piece to every possible square
      for (let newRow = 0; newRow < 8; newRow++) {
        for (let newCol = 0; newCol < 8; newCol++) {
          // Skip if it's the same position
          if (row === newRow && col === newCol) continue;
          
          // Try the move
          if (isMovePossible(board, row, col, newRow, newCol, color)) {
            // Make a deep copy of the board
            const newBoard = JSON.parse(JSON.stringify(board));
            
            // Make the move
            newBoard[newRow][newCol] = newBoard[row][col];
            newBoard[row][col] = null;
            
            // If this move gets us out of check, it's not checkmate
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

  // Remove kings from the list
  const nonKingPieces = pieces.filter((piece) => piece.toLowerCase() !== "k");

  // If there are no non-king pieces, it's a draw
  if (nonKingPieces.length === 0) {
    return true;
  }

  // If only one minor piece is left, it's a draw
  if (nonKingPieces.length === 1) {
    const piece = nonKingPieces[0].toLowerCase();
    if (piece === "b" || piece === "n") {
      return true;
    }
  }

  return false;
};
