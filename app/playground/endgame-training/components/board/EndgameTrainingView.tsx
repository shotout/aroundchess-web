"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  const subCategoriesSectionRef = useRef<HTMLDivElement>(null);
  const stagesSectionRef = useRef<HTMLDivElement>(null);

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
    const isClosing = subcategorySlug === selectedSubcategory;
    setSelectedSubcategory(
      isClosing ? null : subcategorySlug
    );

    if (!isClosing) {
      setTimeout(() => {
        stagesSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    }
  };

  return (
    <>
      <div className="xl:border rounded-md flex flex-col space-y-4">
        <div className="border  rounded-md border-primary-gray xl:border-none">
          <div className="flex items-center space-x-1 xl:border-b p-[4px] xl:p-4 xl:bg-gradient-to-b from-[#FFFFFF] to-[#F3F8FB] px-[8px]">
            <button onClick={onBackClick} className="w-[20px]">
              <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_676_283792)">
                  <path d="M22.1788 9H1.36719" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.03385 16.636L1.36719 8.99965L9.03385 1.36328" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_676_283792">
                    <rect width="23" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>

            <div className="w-full flex items-center justify-center space-x-2">
              <Image
                src={`/endgame-training/${categoryData?.icons}`}
                alt={`${categoryData?.name} icon`}
                width={50}
                height={50}
                className="w-[28px] h-[28px] md:w-[50px] md:h-[50px] object-contain"
              />
              <span className="font-bold text-lg">
                {categoryData?.name || "Loading..."}
              </span>
            </div>
          </div>
        </div>

        <div ref={subCategoriesSectionRef} className="xl:p-4">
          <SubcategoriesGrid
            category={categoryData}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={selectSubcategory}
          />
        </div>
      </div>

      {selectedSubcategory && (
        <div ref={stagesSectionRef}>
          <StagesSection
            slug={slug}
            selectedSubcategory={selectedSubcategory}
            selectedSubcategoryData={selectedSubcategoryData}
            onPositionSelect={onPositionSelect}
            onSelectSubcategory={selectSubcategory}
          />
        </div>
      )}
    </>
  );
}
