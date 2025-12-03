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
    <div className="rounded-xl p-2 xl:p-4 border border-gray-200 bg-white flex items-center hover:shadow-md transition-all max-h-40 2xl:min-w-[343px]">
      <div className="flex w-full h-full border border-[#DEDEDE] shadow-md rounded-md p-3 bg-[url(/endgame-training/bg-check.png)] bg-cover">
        <div className="w-3/5 flex flex-col justify-center">
          <h3 className="font-semibold text-lg mb-3">
            Checkmate in {movesToCheckmate}
          </h3>
          <button
            onClick={() => onCategorySelect(movesToCheckmate)}
            className="btn-primary text-white px-3 py-1.5 rounded-full text-[14px] --sm flex items-center space-x-1  whitespace-nowrap w-fit"
          >
            <div className="flex space-x-2">
              <h1>Play</h1>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
        <div className="w-2/5 flex justify-center items-center">
          <h1 className="text-[96px] bg-gradient-to-b from-[#094CA7] via-[#99C5FF] from-[5%] to-[#2780F8] inline-block text-transparent bg-clip-text">
            {movesToCheckmate}
          </h1>
        </div>
      </div>
    </div>
  );
};
