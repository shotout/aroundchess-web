import { Board } from "../store/useChessStore";
import { IsMoveValid } from "../types/chess";

export const isMoveValid: IsMoveValid = (
  Board,
  fromRow,
  fromCol,
  toRow,
  toCol
) => {
  if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
      toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
    return false;
  }

  if (fromRow === toRow && fromCol === toCol) return false;
  const piece = Board[fromRow][fromCol];
  const target = Board[toRow][toCol];
  if (!piece) return false;
  if (
    piece &&
    target &&
    (piece.toUpperCase() === piece
      ? target.toUpperCase() === target
      : target.toLowerCase() === target)
  )
    return false;

  const isWhite = piece === piece.toUpperCase();
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;

  const moveIsValid = (() => {
    switch (piece.toLowerCase()) {
      case "p":
        if (isWhite) {
          return (
            (dy === -1 && dx === 0 && !Board[toRow][toCol]) ||
            (dy === -2 &&
              dx === 0 &&
              fromRow === 6 &&
              !Board[toRow][toCol] &&
              !Board[toRow + 1][toCol]) ||
            (dy === -1 &&
              Math.abs(dx) === 1 &&
              Board[toRow][toCol])
          );
        } else {
          return (
            (dy === 1 && dx === 0 && !Board[toRow][toCol]) ||
            (dy === 2 &&
              dx === 0 &&
              fromRow === 1 &&
              !Board[toRow][toCol] &&
              !Board[toRow - 1][toCol]) ||
            (dy === 1 &&
              Math.abs(dx) === 1 &&
              Board[toRow][toCol])
          );
        }
      case "r":
        return (
          (dx === 0 || dy === 0) &&
          !hasObstacles(Board, fromRow, fromCol, toRow, toCol)
        );
      case "n":
        return (
          (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
          (Math.abs(dx) === 1 && Math.abs(dy) === 2)
        );
      case "b":
        return (
          Math.abs(dx) === Math.abs(dy) &&
          !hasObstacles(Board, fromRow, fromCol, toRow, toCol)
        );
      case "q":
        return (
          (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) &&
          !hasObstacles(Board, fromRow, fromCol, toRow, toCol)
        );
      case "k":
        return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
      default:
        return false;
    }
  })();

  if (!moveIsValid) return false;
  return true;
};

export const hasObstacles = (
  Board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  const dx = Math.sign(toCol - fromCol);
  const dy = Math.sign(toRow - fromRow);
  let x = fromCol + dx;
  let y = fromRow + dy;

  while (x !== toCol || y !== toRow) {
    if (Board[y][x] !== null) return true;
    x += dx;
    y += dy;
  }

  return false;
};
