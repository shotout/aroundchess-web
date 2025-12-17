import { ArrowRight } from "lucide-react";

interface CheckmateCategoryItemProps {
  movesToCheckmate: number;
  positionsCount: number;
  onCategorySelect: (movesToCheckmate: number) => void;
}

export const CheckmateCategoryItem: React.FC<CheckmateCategoryItemProps> = ({
  movesToCheckmate,
  positionsCount,
  onCategorySelect,
}) => {
  return (
    <div className="rounded-xl p-[6px] xl:p-4 border border-gray-200 bg-white flex items-center hover:shadow-md transition-all max-h-[64px] md:max-h-40 2xl:min-w-[343px]">
      <div className="flex justify-between w-full h-full border border-[#DEDEDE] shadow-md rounded-md p-3 bg-[url(/endgame-training/bg-check.png)] bg-cover">
        <div className="w-[80%] md:w-3/5 flex flex-col justify-center">
          <h3 className="font-semibold text-[13px] md:text-lg md:mb-3">
            Checkmate in {movesToCheckmate}
          </h3>

          <button
            onClick={() => onCategorySelect(movesToCheckmate)}
            className="hidden btn-primary text-white px-3 py-1.5 rounded-full text-[14px] --sm md:flex items-center space-x-1  whitespace-nowrap w-fit"
          >
            <div className="flex space-x-2">
              <h1>Play</h1>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        <div className="w-[15%] md:w-2/5 flex justify-center items-center">
          <h4 className="text-[46px] md:text-[96px] bg-gradient-to-b from-[#094CA7] via-[#99C5FF] from-[5%] to-[#2780F8] inline-block text-transparent bg-clip-text">
            {movesToCheckmate}
          </h4>
        </div>
      </div>
    </div>
  );
};
