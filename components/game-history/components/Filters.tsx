import React, { useRef, useEffect } from "react";
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

const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  filtersApplied,
  handleApplyFilters,
  handleClearFilters,
  handleForceRefresh,
}) => {
  const mobileFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFilters &&
        mobileFilterRef.current &&
        !mobileFilterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters, setShowFilters]);

  return (
    <div className="p-0 md:p-4 xl:p-0">
      {/* Desktop Filters */}
      <div
        className="
          hidden md:flex
          items-center justify-between
          gap-2 xl:gap-6 xl:mb-4
          p-3 xl:p-4 xl:h-[80px]
          border shadow-card
        "
      >
        {/* selects = 60% of the row */}
        <div className="flex items-center space-x-2 w-[60%]">
          <div className="flex-1">
            <Select
              value={filters.color}
              onValueChange={setFilters.setColor}
              defaultValue="All Colors"
            >
              <SelectTrigger className="w-full h-12 bg-gray-placeholder border border-gray-200 rounded-lg text-gray-placeholder-text">
                <SelectValue placeholder="Both Colors" />
              </SelectTrigger>
              <SelectContent className="bg-gray-placeholder">
                <SelectItem value="All Colors">Both Colors</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              value={filters.results}
              onValueChange={setFilters.setResults}
              defaultValue="All Results"
            >
              <SelectTrigger className="w-full h-12 bg-gray-placeholder border border-gray-200 rounded-lg text-gray-placeholder-text">
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
        </div>

        {/* buttons = 40% of the row */}
        <div className="flex items-center space-x-2 xl:space-x-4 w-[40%]">
          <Button
            onClick={handleApplyFilters}
            className="
              btn-primary text-white
              flex-1 h-12 rounded-full
              text-[11px] lg:text-[14px] --sm
              flex items-center justify-center gap-2
            "
          >
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>

          <Button
            onClick={handleClearFilters}
            className="
              btn-tertiary bg-blue-50 text-blue-600
              border border-blue-100
              flex-1 h-12 rounded-full
              text-[11px] lg:text-[14px] --sm
              flex items-center justify-center
            "
          >
            Clear Filters
          </Button>

          <Button
            onClick={handleForceRefresh}
            className="
              btn-secondary text-white
              flex-1 h-12 rounded-full
              text-[11px] lg:text-[14px] --sm
              flex items-center justify-center gap-2
            "
          >
            Update Games
          </Button>
        </div>
      </div>

       {/* Mobile Filters */}
      <div className="md:hidden relative w-full" ref={mobileFilterRef}>
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
                  <span
                    className="
                      inline-flex items-center justify-center
                      w-5 h-5 ml-1 bg-blue-base text-white text-[14px] --xs rounded-full
                    "
                  >
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
                onValueChange={setFilters.setColor}
              >
                <SelectTrigger className="w-[140px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-[14px] --xs" placeholder="Both Colors" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Colors">Both Colors</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.results}
                onValueChange={setFilters.setResults}
              >
                <SelectTrigger className="w-[140px] h-8 border rounded-md bg-gray-50">
                  <SelectValue className="text-[14px] --xs" placeholder="All Results" />
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
              <Button
                onClick={handleApplyFilters}
                className="btn-secondary flex-1 h-10 rounded-3xl flex items-center justify-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="text-[14px] --xs sm:text-[14px] --10px">Apply Filters</span>
              </Button>
              <Button
                onClick={handleClearFilters}
                className="btn-tertiary flex-1 h-10 rounded-3xl flex items-center justify-center gap-2"
              >
                <span className="text-[14px] --xs sm:text-[14px] --10px">Clear Filters</span>
              </Button>
            </div>
          </Card>
        )}
        </div>
    </div>
  );
};

export default Filters;