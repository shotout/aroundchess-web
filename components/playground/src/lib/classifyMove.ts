import { Chess } from "chess.js";
import { createStockfish } from "./detectClassification";

export type MoveClassification =
  | "brilliant-move"
  | "excellent-move"
  | "great-move"
  | "good-move"
  | "best-move"
  | "miss-move"
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

  const { bestScore: scoreBefore } = await engine.getEval(fenBefore, 5, 14);

  const { bestScore: scoreAfter, topMoves } = await engine.getEval(
    fenAfter,
    5,
    14
  );

  const delta = scoreAfter - scoreBefore;
  const absDelta = Math.abs(delta);
  console.log("scoreAfter - scoreBefore", scoreAfter, scoreBefore);
  console.log("absDelta", absDelta);
  engine.terminate();

  const isTopMove = topMoves.includes(move);
  console.log("isTopMove", isTopMove);

  if (isTopMove && absDelta >= 200) return "brilliant-move";
  if (isTopMove && absDelta >= 0 && absDelta > 50) return "excellent-move";
  if (!isTopMove && absDelta >= -20 && delta < 0) return "great-move";
  if (!isTopMove && absDelta >= -50 && absDelta < -20) return "good-move";
  if (!isTopMove && absDelta == 0) return "best-move";
  if (absDelta < -50 && delta >= -100) return "miss-move";
  if (absDelta < -100 && delta >= -200) return "inaccuracy-move";
  if (absDelta < -200 && absDelta >= -500) return "mistake-move";
  return "blunder-move";
}
