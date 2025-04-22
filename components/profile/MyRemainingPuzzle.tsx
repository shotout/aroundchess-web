import { FC, useState } from "react";
import CurrentInfo from "./CurrentInfo";
import Image from "next/image";

const MyRemainingPuzzle = () => {
  const [limits, setLimits] = useState<number>(14);
  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">My Remaining Puzzle</span>
      </div>
      <CurrentInfo
        title="Remaining Puzzles in this month:"
        textButton="Go Unlimited"
        image="/images/puzzle/asset-puzzle.png"
      >
        <div className="flex flex-row items-center justify-center">
          <Image
            alt="puzzle"
            src="/icons/sidebar-puzzle-icon-active.png"
            width={42}
            height={40}
          />
          <div className="block gap-1 max-w-fill">
            <span className="font-semibold text-[40px] text-[#221AE9]">
              {limits}
            </span>
            <span className="font-medium text-[20px]">/20</span>
          </div>
        </div>
      </CurrentInfo>
    </div>
  );
};

export default MyRemainingPuzzle;
