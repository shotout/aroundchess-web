import React from "react";
import { EndgameData } from "../../types/EndgameTrainingTypes";
import { CategoryItem } from "./CategoryItem";

interface CategoryGridProps {
  data: EndgameData | null;
  onCategorySelect: (categorySlug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  data,
  onCategorySelect,
}) => {
  if (!data || !data.categories) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 xl:gap-8 xl:p-4 mx-auto max-w-6xl">
      {data.categories.map((category, index) => (
        <CategoryItem
          key={index}
          category={category}
          onCategorySelect={onCategorySelect}
        />
      ))}
    </div>
  );
};
