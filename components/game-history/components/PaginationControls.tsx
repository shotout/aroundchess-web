import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  variant?: "default" | "v2";
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  variant = "default",
}) => {
  const isV2 = variant === "v2";
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-col lg:flex-row justify-center items-center mt-4 mb-4 lg:relative">
      <div className="flex items-center gap-2 text-[14px] --sm text-gray-500 mb-3 md:mb-3 lg:mb-0 lg:absolute lg:right-0">
        <span>Games per Page</span>
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
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="h-10 w-10 p-0 flex items-center justify-center text-blue-500"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(pageNum)}
            className={`h-8 w-8 p-0 flex items-center justify-center mx-1 ${
              isV2 ? "rounded-lg" : ""
            } ${
              currentPage === pageNum
                ? isV2
                  ? "bg-[#EEF1FE] border border-[#221AE9] text-[#221AE9] rounded-lg"
                  : "bg-blue-50 border border-blue-base text-blue-base rounded-md"
                : "text-gray-600 hover:bg-gray-100 border"
            }`}
            aria-label={`Page ${pageNum}`}
            aria-current={currentPage === pageNum ? "page" : undefined}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-10 w-10 p-0 flex items-center justify-center text-blue-500"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
