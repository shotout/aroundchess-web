import { Chess } from "chess.js";
import { createStockfish } from "./detectClassification";

export type MoveClassification =
  | "brilliant-move"
  | "excellent-move"
  | "good-move"
  | "inaccuracy-move"
  | "mistake-move"
  | "blunder-move";

export async function classifyMove(
  fenBefore: string,
  fenAfter: string,
  move: string
): Promise<MoveClassification> {
  const engine = createStockfish();
  const chess = new Chess(fenBefore);

  const { bestScore: scoreBefore } = await engine.getEval(fenBefore, 5, 10);
 
  const { bestScore: scoreAfter, topMoves } = await engine.getEval(
    fenAfter,
    5,
    10
  );

  const delta = scoreAfter - scoreBefore;
  const absDelta = Math.abs(delta);
  console.log("scoreAfter - scoreBefore", scoreAfter, scoreBefore);
  console.log("absDelta", absDelta);
  engine.terminate();

  const isTopMove = topMoves.includes(move);
  console.log("isTopMove", isTopMove);

  if (isTopMove && absDelta > 300) return "brilliant-move";
  if (isTopMove) return "excellent-move";
  if (!isTopMove && absDelta < 50) return "good-move";
  if (absDelta < 100) return "inaccuracy-move";
  if (absDelta < 300) return "mistake-move";
  return "blunder-move";
}
