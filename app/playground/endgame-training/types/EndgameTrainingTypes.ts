export interface Game {
    fen: string;
    target: string;
  }
  
  export interface Subcategory {
    name: string;
    games: Game[];
  }
  
  export interface EndgameCategory {
    icons: string[];
    name: string;
    subcategories: Subcategory[];
  }
  
  export interface EndgameData {
    categories: EndgameCategory[];
  }

  export type TabType = "board" | "move";