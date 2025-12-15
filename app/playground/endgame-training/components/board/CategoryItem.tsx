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
    <div className={`relative rounded-md overflow-hidden p-[16px] pb-[48px] lg:pb-5 lg:p-5 border border-gray-200 bg-[#F9FAFC] flex max-w-auto lg:hover:bg-blue-base/10 transition-all md:max-h-[226px] md:h-52 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] md:shadow-none`}>
      <div onClick={() => onCategorySelect(slug)} className="relative z-10 w-full xl:border lg:p-[16px] rounded-md xl:bg-white flex flex-col md:flex-row md:gap-x-[16px] md:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.12)] cursor-pointer">
        <div className="w-full md:w-1/3 hidden md:flex items-center xl:bg-white rounded-md xl:justify-center mb-4 md:mb-0">
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

        <div className="w-full md:w-2/3 flex flex-col justify-between space-y-2 md:space-y-0">
          <div className="flex flex-col">
            <h3 className="font-normal md:font-bold text-[16px] md:mb-[8px] lg:text-[20px] text-black">
              {category.name.replace("-"," & ")}
            </h3>
          </div>
          <div>
            <p className="text-[14px] leading-[120%] mb-[8px] --xs text-gray-600">
              {category.name === "Basic"
                ? "Simple Endgame Scenarios with only the King as Enemy"
                : `Multiple Endgame Scenarios involving the ${category.name}.`}
            </p>
          </div>
          <div className="hidden md:flex">
            <button
              onClick={() => onCategorySelect(slug)}
              className="btn-primary w-full text-white py-1 lg:py-[6px] px-3 rounded-full text-[14px] --sm font-medium flex items-center justify-center"
            >
              <span className="mr-1">Select</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      <Image src={`/endgame-training/mobile/${category.name}.jpg`} alt="..." width={100} height={100} className="md:hidden absolute w-full h-full bottom-0 left-0 z-0" />
    </div>
  );
};
