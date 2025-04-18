"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Category } from "../../types/EndgameTrainingTypes";
import { EndgameTrainingViewProps } from "./type";
import SubcategoriesGrid from "./SubCategoriesGrid";
import StagesSection from "./StagesSection";
import { ArrowLeft } from "lucide-react";
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
  const [categoryData, setCategoryData] = useState<Category | null>(null);

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
        (sub) =>
          sub.name.toLowerCase().replace(/\s+/g, "-") === selectedSubcategory
      ) || null
    );
  }, [categoryData, selectedSubcategory]);

  const selectSubcategory = (subcategorySlug: string) => {
    setSelectedSubcategory(
      subcategorySlug === selectedSubcategory ? null : subcategorySlug
    );
  };

  if (!data || !categoryData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">Category not found: {slug}</p>
        <button
          onClick={onBackClick}
          className="mt-4 text-blue-600 flex items-center gap-1"
        >
          <span className="text-sm">←</span>
          Back to categories
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md ">
        <div>
          <div className="flex items-center space-x-4 border-b p-4 bg-gradient-to-b from-[#FFFFFF] to-[#F3F8FB]">
            <button onClick={onBackClick} className="p-2">
              <ArrowLeft className="h-6 w-h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Image
                src={`/endgame-training/${categoryData.icons}`}
                alt={`${categoryData.name} icon`}
                width={45}
                height={45}
              />
              <span className="font-bold text-lg">
                {categoryData.name || "Loading..."}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
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
        />
      )}
    </>
  );
}
