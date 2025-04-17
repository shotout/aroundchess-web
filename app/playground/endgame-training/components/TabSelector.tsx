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
        className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-sm text-xs ${
          activeTab === "board"
            ? "bg-white border shadow-sm font-semibold border-gray-300 text-blue-base"
            : ""
        }`}
        onClick={() => onTabChange("board")}
      >
        <FileText className="h-4 w-4" />
        <h1>Board Presentation</h1>
      </button>
      <button
        className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-sm text-xs ${
          activeTab === "move"
            ? "bg-white border shadow-sm font-semibold border-gray-300 text-blue-base"
            : ""
        }`}
        onClick={() => onTabChange("move")}
      >
        <Upload className="h-4 w-4" />

        <h1>Moves Until Checkmate</h1>
      </button>
    </Card>
  );
};

export default TabSelector;
