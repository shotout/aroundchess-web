import { Chess } from "chess.js";
 
export const analyzeMove = (game: Chess, move: any) => {
  if (!move) return null;

  // Check if castling: king moves 2 squares horizontally
  const castling =
    move.piece === "k" &&
    Math.abs(move.from.charCodeAt(0) - move.to.charCodeAt(0)) === 2;

  const result = {
    captured: move.captured || undefined,
    promotion: move.promotion || undefined,
    check: game.isCheck(),
    checkmate: game.isCheckmate(),
    castling,
  };

  // Undo move to restore state
  return result;
};
