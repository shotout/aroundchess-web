import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import type { UsePaginationResult } from "./hook/usePagination";

export const Pagination = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
}: UsePaginationResult) => {
  return (
    <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center mt-4 mb-4 lg:relative">
      <div className="flex items-center gap-2 text-[14px] --sm text-gray-500 mb-3 md:mb-3 lg:mb-0 lg:absolute lg:right-0">
        <span>Shows per Page</span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => setItemsPerPage(Number(value))}
          defaultValue="10"
        >
          <SelectTrigger className="w-16 h-8 border rounded-md bg-white">
            <SelectValue className="text-[14px] --sm" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="h-10 w-10 p-0 flex items-center justify-center text-blue-500"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className={`h-8 w-8 p-0 flex items-center justify-center mx-1 ${
                currentPage === pageNum
                  ? "bg-blue-50 border border-blue-base text-blue-base rounded-md"
                  : "text-gray-600 hover:bg-gray-100 border "
              }`}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-10 w-10 p-0 flex items-center justify-center text-blue-500"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
