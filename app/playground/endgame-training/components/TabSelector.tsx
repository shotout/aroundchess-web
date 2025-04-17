import React from "react";
import { FileText, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TabType } from "../types/EndgameTrainingTypes";

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Card className="flex gap-3 bg-[#F9FAFC] border border-gray-100 p-2 max-w-96">
      <button
        className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-xs ${
          activeTab === "board"
            ? "bg-white border shadow-sm border-gray-300"
            : ""
        }`}
        onClick={() => onTabChange("board")}
      >
        <FileText className="h-4 w-4" />
        <span>Board Presentation</span>
      </button>
      <button
        className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-xs ${
          activeTab === "move"
            ? "bg-white border shadow-sm border-gray-300"
            : ""
        }`}
        onClick={() => onTabChange("move")}
      >
        <Upload className="h-4 w-4" />
        Moves Until Checkmate
      </button>
    </Card>
  );
};

export default TabSelector;
