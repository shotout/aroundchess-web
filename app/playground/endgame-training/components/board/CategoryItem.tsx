import Image from "next/image";
import { EndgameCategory } from "../../types/EndgameTrainingTypes";

interface CategoryItemProps {
  category: EndgameCategory;
  onCategorySelect: (categorySlug: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onCategorySelect,
}) => {
  const slug = category.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="rounded-md overflow-hidden p-5 border border-gray-200 bg-[#F9FAFC] flex max-w-[424px] max-h-[226px] shadow-sm hover:bg-blue-base/10 transition-all h-52">
      <div className="flex w-full border p-5 gap-x-5 rounded-md bg-white">
        <div className="w-1/3 flex items-center bg-white rounded-md justify-center">
          <Image
            src={`/endgame-training/${category.icons}`}
            alt={`${category.name} icon`}
            width={120}
            height={120}
          />
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <div className="flex flex-col">
            <h3 className="font-bold text-2xl text-black">{category.name}</h3>
          </div>
          <div>
            <p className="text-xs text-gray-600">
              {category.name === "Basic"
                ? "Simple Endgame Scenarios with only the King as Enemy"
                : `Multiple Endgame Scenarios involving the ${category.name}.`}
            </p>
          </div>
          <div>
            <button
              onClick={() => onCategorySelect(slug)}
              className="btn-primary max-w-[133px] text-white py-2 px-3 rounded-full text-sm font-medium flex items-center justify-center"
            >
              <span className="mr-1">Play this set</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
