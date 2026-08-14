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

  if (piece.toUpperCase() === 'K') {
    if (Math.abs(toCol - fromCol) === 2 && fromRow === toRow) {
      const isWhite = piece === 'K';
      const row = isWhite ? 7 : 0;
      
      if (kingCheckOrMoved?.[isWhite ? 'white' : 'black']) {
        return false;
      }

      if (isKingInCheck(board as (PieceType | null)[][], isWhite ? 'white' : 'black')) {
        return false;
      }

      if (toCol === 6) {
        const rookHasMoved = rookMoved?.[isWhite ? 'white' : 'black'].right;
        if (!rookHasMoved && 
            !board[row][5] && 
            !board[row][6] && 
            board[row][7]?.toUpperCase() === 'R') {
          const tempBoard = board.map(row => [...row]);
          tempBoard[row][5] = piece;
          tempBoard[row][4] = null;
          if (isKingInCheck(tempBoard as (PieceType | null)[][], isWhite ? 'white' : 'black')) {
            return false;
          }
          tempBoard[row][6] = piece;
          tempBoard[row][5] = null;
          return !isKingInCheck(tempBoard as (PieceType | null)[][], isWhite ? 'white' : 'black');
        }
      }
      
      if (toCol === 2) {
        const rookHasMoved = rookMoved?.[isWhite ? 'white' : 'black'].left;
        if (!rookHasMoved && 
            !board[row][1] && 
            !board[row][2] && 
            !board[row][3] && 
            board[row][0]?.toUpperCase() === 'R') {
          const tempBoard = board.map(row => [...row]);
          tempBoard[row][3] = piece;
          tempBoard[row][4] = null;
          if (isKingInCheck(tempBoard as (PieceType | null)[][], isWhite ? 'white' : 'black')) {
            return false;
          }
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

  if (
    lastMove &&
    piece?.toUpperCase() === 'P' &&
    CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)
  ) {
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    newBoard[lastMove.toRow][lastMove.toCol] = null;
    Enpassant = true;
    return true;
  }

  if (isMoveValid(board, fromRow, fromCol, toRow, toCol)) {
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

  const color = piece === piece.toUpperCase() ? "white" : "black";
  if (isKingInCheck(newBoard, color)) return false;
  return move || Enpassant || Castle;
};

export function hasAnyValidMoves(board: Board, player: "white" | "black"): boolean {
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (!piece) continue;
      
      const isPieceWhite = piece === piece.toUpperCase();
      if ((player === 'white' && !isPieceWhite) || (player === 'black' && isPieceWhite)) {
        continue;
      }

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
