export interface CheckmatePosition {
    fen: string;
    moves: string[];
    name?: string;
    difficulty?: number;
  }
  
  export interface CheckmateCategory {
    movesToCheckmate: number;
    positions: CheckmatePosition[];
    description?: string;
  }
  
  export interface CheckmateData {
    categories: CheckmateCategory[];
  }