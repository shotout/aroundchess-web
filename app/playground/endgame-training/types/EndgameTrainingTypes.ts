export interface Game {
  fen: string;
  target?: string;
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

export interface Category {
  name: string;
  subcategories: Subcategory[];
}

export interface EndgameTrainingStore {
  data: EndgameData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export interface StageCardProps {
  stageNumber: number;
  active: boolean;
  categorySlug: string;
  subcategorySlug: string;
  fen?: string;
}

export interface EndgameTrainingViewProps {
  slug: string;
  data?: EndgameData;
  onPositionSelect?: (positionSlug: string) => void;
  onBackClick?: () => void;
}

export type ViewType = "categories" | "subcategories" | "detail";

export type ViewState = 
  | { view: "categories" }
  | { 
      view: "subcategories"; 
      category?: string; 
      movesToCheckmate?: number;
    }
  | { 
      view: "detail"; 
      category?: string; 
      position?: string; 
      positionIndex?: number;
      movesToCheckmate?: number;
    };

export interface EndgameSubcategory {
  name: string;
  games: Game[];
  description?: string;
}

export type CheckmateData = string[][];

export interface TabData<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export interface EndgameTabData extends TabData<EndgameData> {}
export interface CheckmateTabData extends TabData<CheckmateData> {}

export interface SubcategoryViewProps {
  activeTab: TabType;
  data: EndgameData | CheckmateData;
  viewState: ViewState;
  onPositionSelect: (categorySlug: string, positionSlug: string, positionIndex?: number) => void;
  onCheckmatePositionSelect: (movesToCheckmate: number, positionIndex: number) => void;
  onBackClick: () => void;
}

export interface DetailViewProps {
  activeTab: TabType;
  data: EndgameData | CheckmateData;
  viewState: ViewState;
  onBackClick: () => void;
  onNextPosition: () => void;
  onPreviousPosition: () => void;
}

export interface CategoryViewProps {
  activeTab: TabType;
  data: EndgameData | CheckmateData;
  onCategorySelect: (categorySlug: string) => void;
  onCheckmateSelect: (movesToCheckmate: number) => void;
}

export interface CheckmateTrainingViewProps {
  slug: string;
  data: string[][];
  onPositionSelect: (positionIndex: number) => void;
  onBackClick: () => void;
}

export interface CheckmateDetailViewProps {
  fen: string | null;
  positionIndex: number;
  movesToCheckmate: number;
  checkmateData: string[][] | null;
  params: { slug: string; position: string };
  onNextPosition?: () => void;
  onPreviousPosition?: () => void;
}

export interface EndgameDetailViewProps {
  endgameSubcategory: EndgameSubcategory;
}