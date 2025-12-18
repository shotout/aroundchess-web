import React from "react";
import { ChessPiece, getPieceConfig } from "../../utils/ChessPieceUtils";
import { SubcategoriesGridProps } from "./type";

export default function SubcategoriesGrid({
  category,
  selectedSubcategory,
  onSelectSubcategory,
}: SubcategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 xl:gap-5">
      {category?.subcategories?.map((subcategory, index) => {
        const subcategorySlug = subcategory.name
          .toLowerCase()
          .replace(/\s+/g, "-");
          
        const config = getPieceConfig(subcategory.name);
        const isSelected = selectedSubcategory === subcategorySlug;

        return (
          <div
            key={index}
            onClick={() => onSelectSubcategory(subcategorySlug)}
            className={`border  ${
              isSelected ? "border-blue-base" : "border-primary-gray"
            } ${
              isSelected ? "bg-blue-base/5" : "bg-white"
            } rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer`}
          >
            <div className=" flex justify-center items-center p-[8px] md:py-4 md:px-2">
              <div
                className="w-full flex items-center justify-center p-[8px] md:p-4 rounded-[8px] space-x-3 md:items-end border bg-gradient-to-b from-[#E7F1F6] to-[#FFFFFF]"
                style={{ display: "inline-flex", alignItems: "flex-end" }}
              >
                {config.pieces.map((piece, i) => (
                  <ChessPiece
                    key={i}
                    type={piece.type}
                    color={piece.color}
                    count={piece.count}
                  />
                ))}
              </div>
            </div>
            <div className="md:p-2 text-center">
              <h3 className="text-lg" dangerouslySetInnerHTML={{ __html: config.text }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
