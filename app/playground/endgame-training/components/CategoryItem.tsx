// CategoryItem.tsx
import React from "react";
import { EndgameCategory } from "../types/EndgameTrainingTypes";
import { Settings } from "lucide-react";

interface CategoryItemProps {
  category: EndgameCategory;
  onCategorySelect: (categorySlug: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onCategorySelect,
}) => {
  const slug = category.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="rounded-3xl space-x-4 overflow-hidden p-8 border border-gray-200 bg-white flex w-full shadow-sm hover:shadow-md transition-all h-52">
      {/* Left half - Icon only */}
      <div className="w-1/3 flex items-center border rounded-md p-4 justify-center">
        <Settings className="h-20 w-20 text-blue-400" />
      </div>

      {/* Right half - Content */}
      <div className="w-1/2 flex flex-col justify-between space-y-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-2xl text-black">{category.name}</h3>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            {category.name === "Basic"
              ? "Simple Endgame Scenarios with only the King as Enemy"
              : `Multiple Endgame Scenarios involving the ${category.name}.`}
          </p>
        </div>

        <div>
          <button
            onClick={() => onCategorySelect(slug)}
            className="bg-blue-600 max-w-[133px] text-white py-2 rounded-full text-sm font-medium flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <span className="mr-1">Play this set</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryItem;
