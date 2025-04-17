// CategoryGrid.tsx
import React from "react";
import CategoryItem from "./CategoryItem";
import { EndgameData } from "../types/EndgameTrainingTypes";

interface CategoryGridProps {
  data: EndgameData | null;
  onCategorySelect: (categorySlug: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  data,
  onCategorySelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 mx-auto max-w-6xl">
      {data?.categories.map((category, index) => (
        <CategoryItem
          key={index}
          category={category}
          onCategorySelect={onCategorySelect}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;
