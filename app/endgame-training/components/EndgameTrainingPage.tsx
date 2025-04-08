import React, { useState } from "react";
import { FileText, Settings, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

const endgameOptions = [
  {
    id: "basic",
    title: "Basic",
    description: "Simple Endgame Scenarios with only the King as Enemy",
    icons: <Settings />,
    color: "bg-blue-100",
  },
  {
    id: "pawn",
    title: "Pawn",
    description: "Multiple Endgame Scenarios involving the Pawn",
    icons: <Settings />,
    color: "bg-blue-50",
  },
  {
    id: "knight",
    title: "Knight",
    description: "Multiple Endgame Scenarios involving the Knight",
    icons: <Settings />,
    color: "bg-blue-50",
  },
  {
    id: "bishop-knight",
    title: "Bishop & Knight",
    description: "Multiple Endgame Scenarios involving Bishop and Knight",
    icons: <Settings />,
    color: "bg-blue-50",
  },
  {
    id: "rook-pawn",
    title: "Rook & Pawn",
    description: "Multiple Endgame Scenarios involving Rook and Pawn",
    icons: <Settings />,
    color: "bg-blue-50",
  },
  {
    id: "queen",
    title: "Queen",
    description: "Multiple Endgame Scenarios involving the Queen",
    icons: <Settings />,
    color: "bg-blue-50",
  },
];

const EndgameTrainingPage = () => {
  const headerHeight = 74;

  const [activeTab, setActiveTab] = useState("board");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <main
      className="w-full p-0 xl:p-8 xl:mt-12"
      style={{ height: `calc(100vh - ${headerHeight}px)` }}
    >
      <Card className="flex gap-3 mt-5 bg-[#F9FAFC] border border-gray-100 p-2 max-w-96">
        <button
          className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded-md text-xs ${
            activeTab === "board"
              ? "bg-white border shadow-sm border-gray-300"
              : ""
          }`}
          onClick={() => handleTabChange("board")}
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
          onClick={() => handleTabChange("move")}
        >
          <Upload className="h-4 w-4" />
          Moves Until Checkmate
        </button>
      </Card>

      <div className="">
        <h1 className="text-2xl font-bold text-gray-800">
          Choose your board presentations
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 mx-auto max-w-6xl">
        {endgameOptions.map((option) => (
          <div
            key={option.id}
            className={`rounded-xl p-4 border border-gray-200 ${
              option.id === "basic" ? "bg-blue-100" : "bg-white"
            } flex items-center justify-between hover:shadow-md transition-all h-40 w-full`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0">{option.icons}</div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {option.description}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1 hover:bg-blue-700 transition-colors whitespace-nowrap">
                <span>Play this set</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default EndgameTrainingPage;
