import Image from "next/image";
import { EndgameCategory } from "../../types/EndgameTrainingTypes";
import { ArrowRight } from "lucide-react";

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
    <div className="rounded-md overflow-hidden p-4 xl:p-5 border border-gray-200 bg-[#F9FAFC] flex max-w-[424px] hover:bg-blue-base/10 transition-all md:max-h-[226px] md:h-52">
      <div className="w-full xl:border xl:p-5 rounded-md xl:bg-white flex flex-col md:flex-row md:gap-x-5">
        <div className="w-full md:w-1/3 flex items-center xl:bg-white rounded-md xl:justify-center mb-4 md:mb-0">
          <Image
            src={`/endgame-training/${category.icons}`}
            alt={`${category.name} icon`}
            width={120}
            height={120}
            className="hidden xl:flex"
          />
          <Image
            src={`/endgame-training/${category.icons}`}
            alt={`${category.name} icon`}
            width={60}
            height={60}
            className="xl:hidden flex"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-2 md:space-y-0">
          <div className="flex flex-col">
            <h3 className="font-semibold xl:font-bold text-base xl:text-2xl text-black">
              {category.name}
            </h3>
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
              className="btn-primary w-full xl:max-w-[100px] text-white py-1 xl:py-2 px-3 rounded-full text-sm font-medium flex items-center justify-center"
            >
              <span className="mr-1">Select</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
