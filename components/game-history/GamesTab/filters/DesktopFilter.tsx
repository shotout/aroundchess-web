import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface DesktopFilterProps {
  filters: {
    color: string;
    gameFormat: string;
    results: string;
  };
  setFilters: {
    setColor: (value: string) => void;
    setGameFormat: (value: string) => void;
    setResults: (value: string) => void;
  };
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  handleForceRefresh: () => void;
  cacheIsValid: boolean;
}

const DesktopFilter = ({
  filters,
  setFilters,
  handleApplyFilters,
  handleClearFilters,
}: DesktopFilterProps) => {
  return (
    <div className="hidden md:flex items-center justify-evenly mb-4 rounded-lg p-4 xl:h-[80px] border shadow-card">
      {/* Dropdowns container - 70% width */}
      <div className="flex items-center space-x-2 w-[70%] 2xl:w-[75%]">
        <Select
          value={filters.color}
          onValueChange={setFilters.setColor}
          defaultValue="All Colors"
        >
          <SelectTrigger className="bg-gray-placeholder border border-gray-200 rounded-lg min-w-[150px] h-12 text-gray-placeholder-text">
            <SelectValue placeholder="Both Colors" />
          </SelectTrigger>
          <SelectContent className="bg-gray-placeholder">
            <SelectItem value="All Colors">Both Colors</SelectItem>
            <SelectItem value="White">White</SelectItem>
            <SelectItem value="Black">Black</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.gameFormat}
          onValueChange={setFilters.setGameFormat}
          defaultValue="All Formats"
        >
          <SelectTrigger className="bg-gray-placeholder border border-gray-200 rounded-lg min-w-[150px] h-12 text-gray-placeholder-text">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent className="bg-gray-placeholder">
            <SelectItem value="All Formats">All Sources</SelectItem>
            <SelectItem value="Chess.com">Chess.com</SelectItem>
            <SelectItem value="PGN Upload">PGN Upload</SelectItem>
            <SelectItem value="Online Games">Online Games</SelectItem>
            <SelectItem value="Tournaments">Tournaments</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.results}
          onValueChange={setFilters.setResults}
          defaultValue="All Results"
        >
          <SelectTrigger className="bg-gray-placeholder border border-gray-200 rounded-lg min-w-[150px] h-12 text-gray-placeholder-text">
            <SelectValue placeholder="All Results" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="All Results">All Results</SelectItem>
            <SelectItem value="Wins">Wins</SelectItem>
            <SelectItem value="Losses">Losses</SelectItem>
            <SelectItem value="Draws">Draws</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons container - 30% width */}
      <div className="flex items-center space-x-1 w-[30%] justify-evenly 2xl:w-[25%]">
        <Button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white w-[156px] rounded-full h-12 px-1 flex items-center gap-2 hover:bg-blue-700"
        >
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>

        <Button
          onClick={handleClearFilters}
          className="bg-blue-50 text-blue-600 w-[156px] border border-blue-100 rounded-full h-12 px-1 hover:bg-blue-100"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default DesktopFilter;
