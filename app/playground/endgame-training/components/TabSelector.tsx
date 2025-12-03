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
    <Card className="flex gap-3 bg-[#F9FAFC] border border-gray-100 p-1 md:p-2 w-full md:max-w-96 ">
      <button
        className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-sm text-[14px] --xs ${
          activeTab === "board"
            ? "bg-white border shadow-sm font-semibold border-gray-300 text-blue-base"
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
        />
        <h1>Board Presentation</h1>
      </button>
      <button
        className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-sm text-[14px] --xs ${
          activeTab === "move"
            ? "bg-white border shadow-sm font-semibold border-gray-300 text-blue-base"
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
        />
        <h1>Moves Until Checkmate</h1>
      </button>
    </Card>
  );
};

export default TabSelector;
