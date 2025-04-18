import React from "react";
import { ChessPiece, getPieceConfig } from "../../utils/ChessPieceUtils";
import { SubcategoriesGridProps } from "./type";

export default function SubcategoriesGrid({
  category,
  selectedSubcategory,
  onSelectSubcategory,
}: SubcategoriesGridProps) {
  if (category.subcategories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-3 text-center py-8">
          <p className="text-gray-500">No scenarios found for this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {category.subcategories.map((subcategory, index) => {
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
            <div className=" flex justify-center items-center py-4 px-2">
              <div
                className="flex p-4 rounded-md space-x-3 items-end border bg-gradient-to-b from-[#E7F1F6] to-[#FFFFFF]"
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
            <div className="p-4 text-center">
              <h3 className="text-lg font-medium">{config.text}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
