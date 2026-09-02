import { Board, PieceType } from "../types/chess";
import { checkCastling } from "./castle";
import { CheckEnpassant } from "./enpassant";
import { isKingInCheck } from "./kingCheck";
import { isMoveValid } from "./validMove";

export const isMovePossible = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  currentPlayer: "white" | "black",
  lastMove?: { type: string; fromRow: number; fromCol: number; toRow: number; toCol: number } | null,
  rookMoved?: { white: { left: boolean; right: boolean }; black: { left: boolean; right: boolean } },
  kingCheckOrMoved?: { white: boolean; black: boolean }
): boolean => {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  // Castling logic for King
  if (piece.toUpperCase() === 'K') {
    // Check if it's a castling move (2 squares horizontally)
    if (Math.abs(toCol - fromCol) === 2 && fromRow === toRow) {
      const isWhite = piece === 'K';
      const row = isWhite ? 7 : 0;
      
      // Check if king hasn't moved and isn't in check
      if (kingCheckOrMoved?.[isWhite ? 'white' : 'black']) {
        return false;
      }

      // Check if king is in check
      if (isKingInCheck(board as (PieceType | null)[][], isWhite ? 'white' : 'black')) {
        return false;
      }

      // Kingside castling
      if (toCol === 6) {
        const rookHasMoved = rookMoved?.[isWhite ? 'white' : 'black'].right;
        if (!rookHasMoved && 
            !board[row][5] && 
            !board[row][6] && 
            board[row][7]?.toUpperCase() === 'R') {
          // Check if squares are not under attack
          const tempBoard = board.map(row => [...row]);
          // Check intermediate square
          tempBoard[row][5] = piece;
          tempBoard[row][4] = null;
          if (isKingInCheck(tempBoard as (PieceType | null)[][], isWhite ? 'white' : 'black')) {
            return false;
          }
          // Check final square
          tempBoard[row][6] = piece;
          tempBoard[row][5] = null;
          return !isKingInCheck(tempBoard as (PieceType | null)[][], isWhite ? 'white' : 'black');
        }
      }
      
      // Queenside castling
      if (toCol === 2) {
        const rookHasMoved = rookMoved?.[isWhite ? 'white' : 'black'].left;
        if (!rookHasMoved && 
            !board[row][1] && 
            !board[row][2] && 
            !board[row][3] && 
            board[row][0]?.toUpperCase() === 'R') {
          // Check if squares are not under attack
          const tempBoard = board.map(row => [...row]);
          // Check intermediate square
          tempBoard[row][3] = piece;
          tempBoard[row][4] = null;
          if (isKingInCheck(tempBoard as (PieceType | null)[][], isWhite ? 'white' : 'black')) {
            return false;
          }
          // Check final square
          tempBoard[row][2] = piece;
          tempBoard[row][3] = null;
          return !isKingInCheck(tempBoard as (PieceType | null)[][], isWhite ? 'white' : 'black');
        }
      }
      return false;
    }
  }

  let Enpassant = false;
  let Castle = false;
  let move = false;

  const newBoard = board.map((row) => row.slice());

  // Check for en passant first
  if (
    lastMove &&
    piece?.toUpperCase() === 'P' && // Only check en passant for pawns
    CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)
  ) {
    // Move the capturing pawn
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    // Remove the captured pawn
    newBoard[lastMove.toRow][lastMove.toCol] = null;
    Enpassant = true;
    return true; // En passant is always a valid move if conditions are met
  }

  // Check regular moves
  if (isMoveValid(board, fromRow, fromCol, toRow, toCol)) {
    // Create a copy of the board to simulate the move
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    move = true;
  }

  if (rookMoved && kingCheckOrMoved) {
    const data = checkCastling(
      fromRow,
      fromCol,
      toRow,
      toCol,
      newBoard,
      currentPlayer,
      rookMoved,
      kingCheckOrMoved
    );
    if (data) {
      Castle = true;
      newBoard[fromRow][data.rookCol] = null;
      newBoard[fromRow][data.newRookCol] = data.rook as PieceType;
    }
  }

  // Check if the move leaves the king in check
  const color = piece === piece.toUpperCase() ? "white" : "black";
  if (isKingInCheck(newBoard, color)) return false;
  return move || Enpassant || Castle;
};

export function hasAnyValidMoves(board: Board, player: "white" | "black"): boolean {
  // Check all possible moves for all pieces of the current player
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (!piece) continue;
      
      // Check if piece belongs to the current player
      const isPieceWhite = piece === piece.toUpperCase();
      if ((player === 'white' && !isPieceWhite) || (player === 'black' && isPieceWhite)) {
        continue;
      }

      // Try all possible destinations
      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (isMovePossible(board, fromRow, fromCol, toRow, toCol, player, null, {
            white: { left: false, right: false },
            black: { left: false, right: false }
          }, {
            white: false,
            black: false
          })) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Helper function to check if a square is under attack
const isSquareUnderAttack = (
  board: Board,
  row: number,
  col: number,
  defendingPlayer: "white" | "black"
): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      
      const isPieceWhite = piece === piece.toUpperCase();
      if ((defendingPlayer === "white" && !isPieceWhite) || 
          (defendingPlayer === "black" && isPieceWhite)) {
        if (isMoveValid(board, r, c, row, col)) {
          return true;
        }
      }
    }
  }
  return false;
};
