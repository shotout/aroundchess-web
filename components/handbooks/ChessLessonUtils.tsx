import { Chess } from "chess.js";
import { LessonType } from "./ChessLessonTypes";

// Cache for storing calculated FEN positions
const fenCache = new Map<string, string>();
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Check if a string is a valid FEN notation
 */
function isFenString(input: string): boolean {
  return (
    input.includes("/") &&
    /[1-8prnbqkPRNBQK]/.test(input) &&
    input.split("/").length === 8
  );
}

/**
 * Convert a moves notation to FEN
 */
export function getFenFromMoves(input: string | null): string {
  if (!input) {
    return DEFAULT_FEN;
  }

  if (fenCache.has(input)) {
    return fenCache.get(input)!;
  }

  if (isFenString(input)) {
    fenCache.set(input, input);
    return input;
  }

  try {
    const chess = new Chess();

    const moveList = input
      .replace(/\d+\./g, "") // Remove move numbers
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .split(" ")
      .filter((move) => move.length > 0);

    for (const move of moveList) {
      if (move && move.length > 1) {
        try {
          chess.move(move);
        } catch (moveError) {
          console.warn(`Skipping invalid move: ${move} in sequence ${input}`);
        }
      }
    }

    const fen = chess.fen();
    fenCache.set(input, fen);
    return fen;
  } catch (error) {
    console.error("Error generating FEN from moves:", error, "Input:", input);
    return DEFAULT_FEN;
  }
}

/**
 * Get the slug from an ID based on the lesson type
 */
export function getSlugFromId(id: string, lessonType: LessonType): string {
  const prefix = `${lessonType}_`;
  return id.startsWith(prefix) ? id.replace(prefix, "") : id;
}

/**
 * Get the ID from a slug based on the lesson type
 */
export function getIdFromSlug(slug: string, lessonType: LessonType): string {
  const prefix = `${lessonType}_`;
  return slug.startsWith(prefix) ? slug : `${prefix}${slug}`;
}
