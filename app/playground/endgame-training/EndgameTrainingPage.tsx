"use client";

import React, { useEffect, useState } from "react";
import { useEndgametraining } from "./store/EndgameTrainingStore";
import { useCheckmateTraining } from "./store/CheckmateStore";
import { TabType } from "./types/EndgameTrainingTypes";
import { ChevronLeft, Grid, Zap } from "lucide-react";

import DotSpinner from "@/components/game-history/Spinner";
import CategoryGrid from "./components/CategoryGrid";
import TabSelector from "./components/TabSelector";
import CheckmateCategoryGrid from "./components/CheckmateCategoryGrid";
import EndgameTrainingView from "./components/EndgameTrainingView";
import CheckmateTrainingView from "./components/CheckmateTrainingView";
import EndgameDetailView from "./components/EndgameDetailView";
import CheckmateDetailView from "./components/CheckmateDetailView";

// New ViewState type to track navigation state
type ViewState = {
  view: "categories" | "subcategories" | "detail";
  category?: string;
  position?: string;
  movesToCheckmate?: number;
  positionIndex?: number;
};

export default function EndgameTrainingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("board");
  // New state to track current view
  const [viewState, setViewState] = useState<ViewState>({ view: "categories" });

  const endgame = useEndgametraining();
  const checkmate = useCheckmateTraining();

  const currentTabData = activeTab === "board" ? endgame : checkmate;

  useEffect(() => {
    const { data, fetchData } = currentTabData;
    if (!data && !currentTabData.isLoading) {
      fetchData();
    }
  }, [activeTab, currentTabData]);

  // Reset view state when tab changes
  useEffect(() => {
    setViewState({ view: "categories" });
  }, [activeTab]);

  // Handler for category selection
  const handleCategorySelect = (categorySlug: string) => {
    setViewState({
      view: "subcategories",
      category: categorySlug,
    });
  };

  // Handler for subcategory/position selection
  const handlePositionSelect = (
    categorySlug: string,
    positionSlug: string,
    positionIndex?: number
  ) => {
    setViewState({
      view: "detail",
      category: categorySlug,
      position: positionSlug,
      positionIndex,
    });
  };

  // Handler for checkmate category selection
  const handleCheckmateSelect = (movesToCheckmate: number) => {
    setViewState({
      view: "subcategories",
      movesToCheckmate,
    });
  };

  // Handler for checkmate position selection
  const handleCheckmatePositionSelect = (
    movesToCheckmate: number,
    positionIndex: number
  ) => {
    setViewState({
      view: "detail",
      movesToCheckmate,
      positionIndex,
    });
  };

  // Handler to go back to categories
  const handleBackToCategories = () => {
    setViewState({ view: "categories" });
  };

  // Handler to go back to subcategories
  const handleBackToSubcategories = () => {
    setViewState({
      view: "subcategories",
      category: viewState.category,
      movesToCheckmate: viewState.movesToCheckmate,
    });
  };

  const renderContent = () => {
    const { data, isLoading, error, fetchData } = currentTabData;

    if (isLoading) return <DotSpinner />;

    if (error) {
      return (
        <div className="flex justify-center items-center h-64 flex-col">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={fetchData}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!data) {
      return <h1>no data</h1>;
    }

    // Categories view - initial screen
    if (viewState.view === "categories") {
      return activeTab === "board" ? (
        <CategoryGrid data={data} onCategorySelect={handleCategorySelect} />
      ) : (
        <CheckmateCategoryGrid
          data={data}
          onCategorySelect={handleCheckmateSelect}
        />
      );
    }

    // Subcategories view - after selecting a category
    if (viewState.view === "subcategories") {
      if (activeTab === "board" && viewState.category) {
        return (
          <>
            <div className="flex items-center mb-8 border-b pb-4">
              <button
                onClick={handleBackToCategories}
                className="text-gray-600 mr-4"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">
                  {data.categories.find(
                    (cat) =>
                      cat.name.toLowerCase().replace(/\s+/g, "-") ===
                      viewState.category
                  )?.name || viewState.category}
                </h1>
              </div>
            </div>
            <EndgameTrainingView
              slug={viewState.category}
              data={data}
              onPositionSelect={(positionSlug) =>
                handlePositionSelect(viewState.category!, positionSlug)
              }
              onBackClick={handleBackToCategories}
            />
          </>
        );
      } else if (activeTab === "move" && viewState.movesToCheckmate) {
        return (
          <>
            <div className="mb-6">
              <button
                onClick={handleBackToCategories}
                className="text-blue-600 flex items-center gap-1 mb-4"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to training selection
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {`${viewState.movesToCheckmate} ${
                  viewState.movesToCheckmate === 1 ? "Move" : "Moves"
                } to Checkmate`}
              </h1>
              <p className="text-gray-600">
                {`Select a position to practice your ${
                  viewState.movesToCheckmate
                } ${
                  viewState.movesToCheckmate === 1 ? "move" : "moves"
                } checkmate skills`}
              </p>
            </div>
            <CheckmateTrainingView
              slug={`checkmate-${viewState.movesToCheckmate}`}
              data={data}
              onPositionSelect={(index) =>
                handleCheckmatePositionSelect(
                  viewState.movesToCheckmate!,
                  index
                )
              }
              onBackClick={handleBackToCategories}
            />
          </>
        );
      }
      return null;
    }

    // Detail view - after selecting a specific position
    if (viewState.view === "detail") {
      if (activeTab === "board" && viewState.category && viewState.position) {
        const endgameCategory = data.categories.find(
          (cat) =>
            cat.name.toLowerCase().replace(/\s+/g, "-") === viewState.category
        );

        const endgameSubcategory = endgameCategory?.subcategories.find(
          (sub) =>
            sub.name.toLowerCase().replace(/\s+/g, "-") === viewState.position
        );

        return (
          <>
            <div className="mb-6">
              <button
                onClick={handleBackToSubcategories}
                className="text-blue-600 flex items-center gap-1 mb-4"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to {endgameCategory?.name || viewState.category}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {endgameSubcategory?.name || viewState.position}
              </h1>
              <p className="text-gray-600">Practice with these positions</p>
            </div>
            <EndgameDetailView endgameSubcategory={endgameSubcategory} />
          </>
        );
      } else if (
        activeTab === "move" &&
        viewState.movesToCheckmate !== undefined &&
        viewState.positionIndex !== undefined
      ) {
        const fen =
          viewState.positionIndex >= 0 &&
          Array.isArray(data) &&
          viewState.movesToCheckmate > 0 &&
          viewState.movesToCheckmate <= data.length &&
          viewState.positionIndex < data[viewState.movesToCheckmate - 1].length
            ? data[viewState.movesToCheckmate - 1][viewState.positionIndex]
            : null;

        return (
          <>
            <div className="mb-6">
              <button
                onClick={handleBackToSubcategories}
                className="text-blue-600 flex items-center gap-1 mb-4"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to {viewState.movesToCheckmate} move positions
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                Position {viewState.positionIndex + 1}
              </h1>
              <p className="text-gray-600">
                {`Find the ${viewState.movesToCheckmate} ${
                  viewState.movesToCheckmate === 1 ? "move" : "moves"
                } to checkmate`}
              </p>
            </div>
            <CheckmateDetailView
              fen={fen}
              positionIndex={viewState.positionIndex}
              movesToCheckmate={viewState.movesToCheckmate}
              checkmateData={data}
              params={{
                slug: `checkmate-${viewState.movesToCheckmate}`,
                position: `position-${viewState.positionIndex + 1}`,
              }}
              onNextPosition={() => {
                if (
                  Array.isArray(data) &&
                  viewState.movesToCheckmate > 0 &&
                  viewState.movesToCheckmate <= data.length &&
                  viewState.positionIndex <
                    data[viewState.movesToCheckmate - 1].length - 1
                ) {
                  handleCheckmatePositionSelect(
                    viewState.movesToCheckmate,
                    viewState.positionIndex + 1
                  );
                }
              }}
              onPreviousPosition={() => {
                if (viewState.positionIndex > 0) {
                  handleCheckmatePositionSelect(
                    viewState.movesToCheckmate,
                    viewState.positionIndex - 1
                  );
                }
              }}
            />
          </>
        );
      }
      return null;
    }

    return null;
  };

  return (
    <main className="w-full h-full p-6 flex flex-col space-y-4">
      <TabSelector
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setViewState({ view: "categories" });
        }}
      />
      <div className="w-auto">
        <h1 className="text-2xl font-bold text-gray-800">
          {activeTab === "board" ? (
            <Grid className="inline mr-2" size={24} />
          ) : (
            <Zap className="inline mr-2" size={24} />
          )}
          {viewState.view === "categories"
            ? activeTab === "board"
              ? "Choose your board presentation :"
              : "Checkmate in ..."
            : activeTab === "board"
            ? viewState.view === "subcategories"
              ? "Choose a position type"
              : "Practice position"
            : viewState.view === "subcategories"
            ? `Checkmate in ${viewState.movesToCheckmate} moves`
            : `Checkmate practice`}
        </h1>
        {activeTab === "move" && viewState.view === "categories" && (
          <div className="text-gray-600 border p-1 rounded-md text-xs w-auto">
            Challenge yourself and achieve Checkmate in a specific amount of
            moves. Everytime you start a Game in this section, the Board
            Presentation will be different!
          </div>
        )}
      </div>

      {renderContent()}
    </main>
  );
}
