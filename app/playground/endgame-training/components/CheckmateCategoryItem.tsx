// CheckmateCategoryItem.tsx
import React from "react";
import { ArrowRight, Settings } from "lucide-react";

interface CheckmateCategoryItemProps {
  movesToCheckmate: number;
  positionsCount: number;
  onCategorySelect: (movesToCheckmate: number) => void;
}

const CheckmateCategoryItem: React.FC<CheckmateCategoryItemProps> = React.memo(
  ({ movesToCheckmate, positionsCount, onCategorySelect }) => {
    return (
      <div className="rounded-xl p-4 border border-gray-200 bg-white flex items-center hover:shadow-md transition-all h-40 xl:min-w-[343px]">
        <div className="flex w-full h-full border rounded-md p-3">
          <div className="w-3/5 flex flex-col justify-center">
            <h3 className="font-semibold text-lg mb-3">
              Checkmate in {movesToCheckmate}
            </h3>
            <button
              onClick={() => onCategorySelect(movesToCheckmate)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 hover:bg-blue-700 transition-colors whitespace-nowrap w-fit"
            >
              <div className="flex">
                <h1>Play this set</h1>
                <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </button>
          </div>
          <div className="w-2/5 flex justify-center items-center">
            <Settings size={48} className="text-gray-600" />
          </div>
        </div>
      </div>
    );
  }
);

CheckmateCategoryItem.displayName = "CheckmateCategoryItem";

export default CheckmateCategoryItem;
