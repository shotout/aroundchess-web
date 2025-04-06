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
import { Filter, RefreshCw } from "lucide-react";

interface MobileFilterProps {
  filters: any; // Replace 'any' with your actual filters type
  setFilters: any; // Replace 'any' with your actual setFilters type
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  filtersApplied: boolean;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  handleForceRefresh: () => void;
  cacheIsValid: boolean;
}

const MobileFilter = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  filtersApplied,
  handleApplyFilters,
  handleClearFilters,
  handleForceRefresh,
  cacheIsValid,
}: MobileFilterProps) => {
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden flex w-full items-center justify-between gap-2 mb-4">
        <Button
          variant="outline"
          className={`flex-1 flex items-center justify-center gap-2 py-5 rounded-lg ${
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

      {/* Mobile Filter Panel */}
      {showFilters && (
        <Card className="md:hidden p-2 border rounded-lg mb-4 absolute top-full left-0 right-0 z-10 bg-white shadow-lg">
          <div className="flex flex-wrap gap-2 mb-4">
            <Select
              value={filters.color}
              onValueChange={setFilters.setColor}
              defaultValue="All Colors"
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
              onValueChange={setFilters.setGameFormat}
              defaultValue="All Formats"
            >
              <SelectTrigger className="w-[120px] h-8 border rounded-md bg-gray-50">
                <SelectValue className="text-xs" placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
              <h1 className="text-xs">Apply Filters</h1>
            </button>
            <button
              onClick={handleClearFilters}
              className="btn-tertiary flex items-center justify-center gap-2 h-10 rounded-3xl flex-1"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </Card>
      )}
    </>
  );
};

export default MobileFilter;
