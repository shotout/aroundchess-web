"use client";

import React, { useState } from "react";
import { ChevronLeft, Crown, Castle, Swords } from "lucide-react";
import Link from "next/link";
import { useEndgametraining } from "../store/EndgameTrainingStore";
import StageCard from "./StageCard";

export default function EndgameTrainingView({ slug }: { slug: string }) {
  const {
    data: endgameData,
    isLoading,
    error,
    fetchData,
  } = useEndgametraining();

  // Track which subcategory is selected to show stages
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  // Track if fetch is in progress to prevent multiple fetches
  const fetchInProgress = React.useRef(false);

  // Get the appropriate endgame category based on the slug
  const endgameCategory = React.useMemo(() => {
    if (!endgameData || !endgameData.categories) return null;

    return endgameData.categories.find(
      (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === slug
    );
  }, [endgameData, slug]);

  // Get selected subcategory data
  const selectedSubcategoryData = React.useMemo(() => {
    if (!endgameCategory || !selectedSubcategory) return null;

    return endgameCategory.subcategories.find(
      (sub) =>
        sub.name.toLowerCase().replace(/\s+/g, "-") === selectedSubcategory
    );
  }, [endgameCategory, selectedSubcategory]);

  // Fetch data if needed
  React.useEffect(() => {
    const fetchEndgameData = async () => {
      if (!endgameData && !fetchInProgress.current) {
        fetchInProgress.current = true;
        try {
          await fetchData();
        } finally {
          fetchInProgress.current = false;
        }
      }
    };

    fetchEndgameData();
  }, [endgameData, fetchData]);

  // Select a subcategory to show stages
  const selectSubcategory = (subcategorySlug: string) => {
    setSelectedSubcategory(
      subcategorySlug === selectedSubcategory ? null : subcategorySlug
    );
  };

  // Check if category exists
  const isNotFound = !endgameCategory;

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

  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">Category not found: {slug}</p>
        <Link
          href="/playground/endgame-training"
          className="mt-4 text-blue-600 flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to training selection
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-8 border-b pb-4">
        <Link
          href="/playground/endgame-training"
          className="text-gray-600 mr-4"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <div className="text-blue-500">
              <Swords className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">{endgameCategory?.name}</h1>
        </div>
      </div>

      {/* Subcategories section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {endgameCategory.subcategories.length > 0 ? (
          endgameCategory.subcategories.map((subcategory, index) => {
            const subcategorySlug = subcategory.name
              .toLowerCase()
              .replace(/\s+/g, "-");

            // Example scenarios based on subcategory name
            const scenarios = {
              "Queen and King": {
                text: "Queen, King VS King",
                icons: [
                  { Icon: Crown, color: "text-blue-500" },
                  { Icon: Crown, color: "text-blue-500" },
                  { Icon: Swords, color: "text-blue-500" },
                  { Icon: Crown, color: "text-indigo-700" },
                ],
              },
              "Rook and King": {
                text: "Rook, King VS King",
                icons: [
                  { Icon: Castle, color: "text-blue-500" },
                  { Icon: Crown, color: "text-blue-500" },
                  { Icon: Swords, color: "text-blue-500" },
                  { Icon: Crown, color: "text-indigo-700" },
                ],
              },
              "Two Rooks and King": {
                text: "Rook, Rook, King VS King",
                icons: [
                  { Icon: Castle, color: "text-blue-500" },
                  { Icon: Castle, color: "text-blue-500" },
                  { Icon: Crown, color: "text-blue-500" },
                  { Icon: Swords, color: "text-blue-500" },
                  { Icon: Crown, color: "text-indigo-700" },
                ],
              },
              // Default case
              default: {
                text: subcategory.name,
                icons: [
                  { Icon: Crown, color: "text-blue-500" },
                  { Icon: Swords, color: "text-blue-500" },
                  { Icon: Crown, color: "text-indigo-700" },
                ],
              },
            };

            // Get scenario data or use default
            const scenarioData =
              scenarios[subcategory.name] || scenarios.default;

            const isSelected = selectedSubcategory === subcategorySlug;

            return (
              <div
                key={index}
                onClick={() => selectSubcategory(subcategorySlug)}
                className={`border ${
                  isSelected ? "border-blue-400" : "border-gray-200"
                } ${
                  isSelected ? "bg-blue-50" : "bg-white"
                } rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer`}
              >
                <div className="flex justify-center items-center py-6 px-4">
                  <div className="flex space-x-3 items-center">
                    {scenarioData.icons.map((icon, i) => (
                      <React.Fragment key={i}>
                        {icon.Icon === Swords ? (
                          <Swords className={`h-5 w-5 ${icon.color}`} />
                        ) : (
                          <icon.Icon className={`h-10 w-10 ${icon.color}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-medium">{scenarioData.text}</h3>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">
              No scenarios found for this category.
            </p>
          </div>
        )}
      </div>

      {/* Stages section - only shown when a subcategory is selected */}
      {selectedSubcategory && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <h4 className="text-center text-lg font-medium">
              Select a Stage...
            </h4>
            <div className="flex-1 flex justify-end">
              <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M2.5,12a9.5,9.5 0 1,0 19,0a9.5,9.5 0 1,0 -19,0"
                  strokeWidth="2"
                  stroke="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Stages grid - first row */}
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

          {/* Stages grid - second row */}
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
      )}
    </>
  );
}
