"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useEndgametraining } from "../../store/EndgameTrainingStore";
import StageCard from "./StageCard";
import {
  Category,
  EndgameTrainingViewProps,
  Subcategory,
} from "../../types/EndgameTrainingTypes";
import { ChessPiece, getPieceConfig } from "../../utils/ChessPieceUtils";
import { useNavigationStore } from "../../store/NavigationStore";

export default function EndgameTrainingView({
  slug,
}: EndgameTrainingViewProps) {
  const {
    data: endgameData,
    isLoading,
    error,
    fetchData,
  } = useEndgametraining();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const fetchInProgress = useRef<boolean>(false);

  // This is important to access the navigation store and maintain state
  const { setPreviousRoute } = useNavigationStore();

  const endgameCategory = useMemo<Category | null>(() => {
    if (!endgameData?.categories) return null;
    return (
      endgameData.categories.find(
        (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === slug
      ) || null
    );
  }, [endgameData, slug]);

  const selectedSubcategoryData = useMemo<Subcategory | null>(() => {
    if (!endgameCategory || !selectedSubcategory) return null;
    return (
      endgameCategory.subcategories.find(
        (sub) =>
          sub.name.toLowerCase().replace(/\s+/g, "-") === selectedSubcategory
      ) || null
    );
  }, [endgameCategory, selectedSubcategory]);

  useEffect(() => {
    const loadData = async () => {
      if (!endgameData && !fetchInProgress.current) {
        fetchInProgress.current = true;
        try {
          await fetchData();
        } finally {
          fetchInProgress.current = false;
        }
      }
    };

    loadData();
  }, [endgameData, fetchData]);

  useEffect(() => {
    // Store current location for backtracking
    setPreviousRoute(`/playground/endgame-training/${slug}`);
  }, [slug, setPreviousRoute]);

  const selectSubcategory = (subcategorySlug: string) => {
    setSelectedSubcategory(
      subcategorySlug === selectedSubcategory ? null : subcategorySlug
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading training data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => {
            if (!fetchInProgress.current) {
              fetchInProgress.current = true;
              fetchData().finally(() => {
                fetchInProgress.current = false;
              });
            }
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!endgameCategory) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">Category not found: {slug}</p>
        <Link
          href="/playground/endgame-training"
          className="mt-4 text-blue-600 flex items-center gap-1"
        >
          <span className="text-sm">←</span>
          Back to training selection
        </Link>
      </div>
    );
  }

  return (
    <>
      <SubcategoriesGrid
        category={endgameCategory}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={selectSubcategory}
      />

      {selectedSubcategory && (
        <StagesSection
          slug={slug}
          selectedSubcategory={selectedSubcategory}
          selectedSubcategoryData={selectedSubcategoryData}
        />
      )}
    </>
  );
}

interface SubcategoriesGridProps {
  category: Category;
  selectedSubcategory: string | null;
  onSelectSubcategory: (slug: string) => void;
}

function SubcategoriesGrid({
  category,
  selectedSubcategory,
  onSelectSubcategory,
}: SubcategoriesGridProps) {
  if (category.subcategories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-3 text-center py-8">
          <p className="text-gray-500">No scenarios found for this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            className={`border ${
              isSelected ? "border-blue-400" : "border-gray-200"
            } ${
              isSelected ? "bg-blue-50" : "bg-white"
            } rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex justify-center items-center py-6 px-4">
              <div className="flex space-x-3 items-center">
                {config.pieces.map((piece, i) => (
                  <ChessPiece key={i} type={piece.type} color={piece.color} />
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

interface StagesSectionProps {
  slug: string;
  selectedSubcategory: string;
  selectedSubcategoryData: Subcategory | null;
}

function StagesSection({
  slug,
  selectedSubcategory,
  selectedSubcategoryData,
}: StagesSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-10 flex flex-col space-y-5 mt-6">
      <div className="flex justify-center items-center mb-6">
        <h4 className="text-center text-xl">Select a Stage . . . </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {[1, 2, 3, 4, 5].map((stageNum) => (
          <StageCard
            key={stageNum}
            stageNumber={stageNum}
            active={stageNum === 1}
            categorySlug={slug}
            subcategorySlug={selectedSubcategory}
            fen={
              selectedSubcategoryData?.games &&
              selectedSubcategoryData.games[stageNum - 1]?.fen
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[6, 7, 8, 9, 10].map((stageNum) => (
          <StageCard
            key={stageNum}
            stageNumber={stageNum}
            active={false}
            categorySlug={slug}
            subcategorySlug={selectedSubcategory}
            fen={
              selectedSubcategoryData?.games &&
              selectedSubcategoryData.games[stageNum - 1]?.fen
            }
          />
        ))}
      </div>
    </div>
  );
}
