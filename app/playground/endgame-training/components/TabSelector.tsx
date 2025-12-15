import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { TabType } from "../types/EndgameTrainingTypes";

interface TabSelectorProps {
  activeTab: string;
  onTabChange: (tab: TabType) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex md:gap-3 bg-[#E6F7FE] md:bg-[#F9FAFC] md:border md:border-gray-100 p-0 md:p-[6px] w-[calc(100%+24px)] md:w-1/2 rounded-0 md:rounded-lg mx-[-24px] md:mx-0">
      <button
        className={`flex-1 py-[8px] md:py-[6px] px-[6px] md:px-[10px] flex items-center justify-center gap-1 md:rounded-sm text-[13px] md:text-[14px] --xs ${
          activeTab === "board"
            ? "md:bg-white md:border md:shadow-sm font-semibold md:border-gray-300 text-blue-base border-b-[2px] border-blue-base"
            : ""
        }`}
        onClick={() => onTabChange("board")}
      >
        <Image
          src={
            activeTab === "board"
              ? "/endgame-training/board-selector-blue.png"
              : "/endgame-training/board-selector.png"
          }
          alt="Board icon"
          width={30}
          height={30}
          className="w-[16px] md:w-[24px] h-[16px] md:h-[24px]"
        />
        <h1>Board Presentation</h1>
      </button>
      <button
        className={`flex-1 py-[8px] md:py-[6px] px-[6px] md:px-[10px] flex items-center justify-center gap-1 md:rounded-sm text-[13px] md:text-[14px] --xs ${
          activeTab === "move"
            ? "md:bg-white md:border md:shadow-sm font-semibold md:border-gray-300 text-blue-base border-b-[2px] border-blue-base"
            : ""
        }`}
        onClick={() => onTabChange("move")}
      >
        <Image
          src={
            activeTab === "move"
              ? "/endgame-training/moves-selector-blue.png"
              : "/endgame-training/moves-selector.png"
          }
          alt="Moves icon"
          width={30}
          height={30}
          className="w-[16px] md:w-[24px] h-[16px] md:h-[24px]"
        />
        <h1>Moves Until Checkmate</h1>
      </button>
    </div>
  );
};

export default TabSelector;
