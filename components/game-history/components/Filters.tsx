import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterState } from "../types/GameHistoryTypes";

interface FiltersProps {
  filters: FilterState;
  setFilters: {
    setTimeRange: (value: string) => void;
    setGameType: (value: string) => void;
    setColor: (value: string) => void;
    setGameFormat: (value: string) => void;
    setResults: (value: string) => void;
  };
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  filtersApplied: boolean;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  handleForceRefresh: () => void;
  sourceOptions?: { value: string; label: string }[];
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  filtersApplied,
  handleApplyFilters,
  handleClearFilters,
  sourceOptions = [
    { value: "All Formats", label: "All Sources" },
    { value: "Chess.com", label: "Chess.com" },
    { value: "Lichess", label: "Lichess" },
    { value: "PGN Upload", label: "PGN Upload" },
    { value: "Online Games", label: "Online Games" },
    { value: "Tournaments", label: "Tournaments" },
  ],
}) => {
  return (
    <div className="p-0 md:p-4 xl:p-0">
      <div className="hidden md:flex items-center justify-between gap-2 xl:gap-6 xl:mb-4 rounded-lg p-3 xl:p-4 xl:h-[80px] border shadow-card">
        <div className="flex items-center space-x-1 2xl:space-x-4 w-[70%] 2xl:w-[75%]">
          <Select
            value={filters.color}
            onValueChange={(value) => setFilters.setColor(value)}
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
            onValueChange={(value) => setFilters.setGameFormat(value)}
            defaultValue="All Formats"
          >
            <SelectTrigger className="bg-gray-placeholder border border-gray-200 rounded-lg min-w-[150px] h-12 text-gray-placeholder-text">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent className="bg-gray-placeholder">
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.results}
            onValueChange={(value) => setFilters.setResults(value)}
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

        <div className="flex items-center space-x-2 xl:space-x-4 w-[40%] xl:w-[30%] 2xl:w-[25%]">
          <Button
            onClick={handleApplyFilters}
            className="btn-primary text-white flex-1 rounded-full h-12 text-nowrap flex items-center justify-center gap-2 text-[11px] 2xl:text-base"
          >
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>

          <Button
            onClick={handleClearFilters}
            className="bg-blue-50 text-blue-600 flex-1 border border-blue-100 btn-tertiary rounded-full h-12 flex items-center justify-center text-[11px] 2xl:text-base"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="md:hidden relative w-full">
        <div className="flex w-full items-center justify-between gap-2 mb-4 p-4 border">
          <Button
            variant="outline"
            className={`flex-1 flex items-center justify-center gap-2 py-3 ${
              filtersApplied ? "text-blue-base border-blue-base" : ""
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {filtersApplied ? (
              <>
                Filters Applied
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 ml-1 bg-blue-base text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </>
            ) : (
              "Add Filters"
            )}
          </Button>
        </div>

        {showFilters && (
          <Card className="md:hidden p-4 border rounded-lg mb-4 absolute top-full left-0 right-0 z-20 bg-white shadow-lg">
            <div className="flex flex-wrap gap-2 mb-4">
              <Select
                value={filters.color}
                onValueChange={(value) => setFilters.setColor(value)}
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="Both Colors" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Colors">Both Colors</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.gameFormat}
                onValueChange={(value) => setFilters.setGameFormat(value)}
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {sourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.results}
                onValueChange={(value) => setFilters.setResults(value)}
              >
                <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-xs" placeholder="All Results" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Results">All Results</SelectItem>
                  <SelectItem value="Wins">Wins</SelectItem>
                  <SelectItem value="Losses">Losses</SelectItem>
                  <SelectItem value="Draws">Draws</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApplyFilters}
                className="btn-secondary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <Filter className="h-4 w-4" />
                <span className="text-xs sm:text-[10px]">Apply Filters</span>
              </button>
              <button
                onClick={handleClearFilters}
                className="btn-tertiary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
              >
                <span className="text-xs sm:text-[10px]">Clear Filters</span>
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Filters;
