import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DifficultyFilter } from "./ChessLessonTypes";

interface ChessLessonFilterProps {
  localSearchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  difficultyFilter: DifficultyFilter;
  handleDifficultyChange: (difficulty: DifficultyFilter) => void;
  isFiltering: boolean;
  searchPlaceholder?: string;
}

const ChessLessonFilter: React.FC<ChessLessonFilterProps> = ({
  localSearchTerm,
  handleSearchChange,
  difficultyFilter,
  handleDifficultyChange,
  isFiltering,
  searchPlaceholder = "Search topics...",
}) => {
  const difficulties: DifficultyFilter[] = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-4 xl:mb-0">
      <div className="relative w-full md:w-[60%]">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <Input
          placeholder={searchPlaceholder}
          className="pl-10 py-2 w-full"
          value={localSearchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="w-full md:w-[40%] flex justify-between gap-x-1 xl:gap-x-2">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className={`flex-1 border rounded-md md:flex-initial md:px-6 xl:px-12 h-10 flex items-center justify-center text-xs lg:text-sm whitespace-nowrap overflow-hidden ${
              difficultyFilter === difficulty ? "bg-blue-base text-white" : ""
            }`}
            onClick={() => handleDifficultyChange(difficulty)}
            disabled={isFiltering}
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChessLessonFilter;
