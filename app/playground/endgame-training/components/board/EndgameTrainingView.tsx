"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Category } from "../../types/EndgameTrainingTypes";
import { EndgameTrainingViewProps } from "./type";
import SubcategoriesGrid from "./SubCategoriesGrid";
import StagesSection from "./StagesSection";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
export default function EndgameTrainingView({
  slug,
  data,
  onPositionSelect,
  onBackClick,
}: EndgameTrainingViewProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [categoryData, setCategoryData] = useState<Category | any>(null);

  const endgameCategory = useMemo<Category | null>(() => {
    if (!data?.categories) return null;
    return (
      data.categories.find(
        (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === slug
      ) || null
    );
  }, [data, slug]);

  useEffect(() => {
    if (endgameCategory) {
      setCategoryData(endgameCategory);
    }
  }, [endgameCategory]);

  const selectedSubcategoryData = useMemo(() => {
    if (!categoryData || !selectedSubcategory) return null;
    return (
      categoryData.subcategories.find(
        (sub: { name: string }) =>
          sub.name.toLowerCase().replace(/\s+/g, "-") === selectedSubcategory
      ) || null
    );
  }, [categoryData, selectedSubcategory]);

  const selectSubcategory = (subcategorySlug: string) => {
    setSelectedSubcategory(
      subcategorySlug === selectedSubcategory ? null : subcategorySlug
    );
  };

  return (
    <>
      <div className="xl:border rounded-md flex flex-col space-y-4">
        <div className="border rounded-md border-primary-gray xl:border-none">
          <div className="flex items-center space-x-1 xl:border-b p-2 xl:p-4 xl:bg-gradient-to-b from-[#FFFFFF] to-[#F3F8FB]">
            <button onClick={onBackClick}>
              <ChevronLeft className="h-10 w-10 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Image
                src={`/endgame-training/${categoryData?.icons}`}
                alt={`${categoryData?.name} icon`}
                width={50}
                height={50}
              />
              <span className="font-bold text-lg">
                {categoryData?.name || "Loading..."}
              </span>
            </div>
          </div>
        </div>
        <div className="xl:p-4">
          <SubcategoriesGrid
            category={categoryData}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={selectSubcategory}
          />
        </div>
      </div>

      {selectedSubcategory && (
        <StagesSection
          slug={slug}
          selectedSubcategory={selectedSubcategory}
          selectedSubcategoryData={selectedSubcategoryData}
          onPositionSelect={onPositionSelect}
          onSelectSubcategory={selectSubcategory}
        />
      )}
    </>
  );
}
