export interface CheckmatePosition {
    fen: string;         // FEN notation for the chess position
    moves: string[];     // List of moves to reach checkmate
    name?: string;       // Optional name for the position
    difficulty?: number; // Optional difficulty rating
  }
  
  export interface CheckmateCategory {
    movesToCheckmate: number;  // Number of moves until checkmate
    positions: CheckmatePosition[];
    description?: string;      // Optional description of this category
  }
  
  export interface CheckmateData {
    categories: CheckmateCategory[];
  }