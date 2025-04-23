import { Category, EndgameData, Subcategory } from "../../types/EndgameTrainingTypes";

export interface EndgameTrainingViewProps {
  slug: string;
  data: EndgameData;
  onPositionSelect: (positionSlug: string, positionIndex?: number) => void;
  onBackClick: () => void;
}

export interface SubcategoriesGridProps {
  category: Category;
  selectedSubcategory: string | null;
  onSelectSubcategory: (slug: string) => void;
}

export interface StagesSectionProps {
  slug: string;
  selectedSubcategory: string;
  selectedSubcategoryData: Subcategory | null;
  onSelectSubcategory: (slug: string) => void;
  onPositionSelect: (positionSlug: string, positionIndex?: number) => void;
}