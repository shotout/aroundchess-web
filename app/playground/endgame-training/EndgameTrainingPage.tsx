"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { useEndgametraining } from "./store/EndgameTrainingStore";
import { useCheckmateTraining } from "./store/CheckmateStore";
import DotSpinner from "@/components/game-history/Spinner";
import TabSelector from "./components/TabSelector";
import CategoryView from "./components/views/CategoryView";
import SubcategoryView from "./components/views/SubCategoryView";
import DetailView from "./components/views/DetailView";
import ErrorDisplay from "./components/ErrorDisplay";

import {
  handleCategorySelect,
  handlePositionSelect,
  handleCheckmateSelect,
  handleCheckmatePositionSelect,
  handleBackToCategories,
  handleBackToSubcategories,
  handleNextPosition,
  handlePreviousPosition,
  handleTabChange,
} from "./utils/EndgameTrainingHandlers";
import PageHeader from "./components/PageHeader";
import { useEndgameNavigation } from "./store/NavigationStore";

export default function EndgameTrainingPage() {
  const { activeTab, setActiveTab, viewState, setViewState, hydrated } =
    useEndgameNavigation();

  const endgame = useEndgametraining();
  const checkmate = useCheckmateTraining();

  // Debug logging
  useEffect(() => {
    console.log("Navigation state:", { activeTab, viewState, hydrated });
  }, [activeTab, viewState, hydrated]);

  // We'll use this flag to conditionally render content
  // but we won't return early, as that breaks React's hook rules

  const currentTabData = useMemo(
    () => (activeTab === "board" ? endgame : checkmate),
    [activeTab, endgame, checkmate]
  );

  useEffect(() => {
    const { data, fetchData, isLoading } = currentTabData;
    if (!data && !isLoading) {
      fetchData();
    }
  }, [currentTabData]);

  const memoizedHandlers = useMemo(
    () => ({
      onCategorySelect: (categorySlug: string) =>
        handleCategorySelect(setViewState, categorySlug),

      onCheckmateSelect: (movesToCheckmate: number) =>
        handleCheckmateSelect(setViewState, movesToCheckmate),

      onPositionSelect: (
        categorySlug: string,
        positionSlug: string,
        positionIndex: number | undefined
      ) =>
        handlePositionSelect(
          setViewState,
          categorySlug,
          positionSlug,
          positionIndex
        ),

      onCheckmatePositionSelect: (
        movesToCheckmate: number,
        positionIndex: number
      ) =>
        handleCheckmatePositionSelect(
          setViewState,
          movesToCheckmate,
          positionIndex
        ),

      onBackToCategories: () => handleBackToCategories(setViewState),

      onBackToSubcategories: () =>
        handleBackToSubcategories(setViewState, viewState),

      onNextPosition: () =>
        handleNextPosition(
          activeTab,
          viewState,
          currentTabData.data as any,
          setViewState
        ),

      onPreviousPosition: () =>
        handlePreviousPosition(activeTab, viewState, setViewState),

      onTabChange: (tab: string) =>
        handleTabChange(tab, setActiveTab, setViewState),
    }),
    [activeTab, currentTabData.data, setActiveTab, setViewState, viewState]
  );

  // Move content rendering logic to a regular function instead of a useCallback
  // This avoids potential hook-related issues
  const renderContent = () => {
    const { data, isLoading, error, fetchData } = currentTabData;

    if (isLoading) return <DotSpinner />;
    if (error) return <ErrorDisplay error={error} onRetry={fetchData} />;
    if (!data) return <h2 className="text-center mt-8">No data available</h2>;

    switch (viewState.view) {
      case "categories":
        return (
          <CategoryView
            activeTab={activeTab}
            data={data}
            onCategorySelect={memoizedHandlers.onCategorySelect}
            onCheckmateSelect={memoizedHandlers.onCheckmateSelect}
          />
        );
      case "subcategories":
        return (
          <SubcategoryView
            activeTab={activeTab}
            data={data}
            viewState={viewState}
            onPositionSelect={memoizedHandlers.onPositionSelect}
            onCheckmatePositionSelect={
              memoizedHandlers.onCheckmatePositionSelect
            }
            onBackClick={memoizedHandlers.onBackToCategories}
          />
        );
      case "detail":
        return (
          <DetailView
            activeTab={activeTab}
            data={data}
            viewState={viewState}
            onBackClick={memoizedHandlers.onBackToSubcategories}
            onNextPosition={memoizedHandlers.onNextPosition}
            onPreviousPosition={memoizedHandlers.onPreviousPosition}
          />
        );
      default:
        return <h2 className="text-center mt-8">Invalid view state</h2>;
    }
  };

  return (
    <main className="w-full h-full p-6 flex flex-col space-y-4">
      {!hydrated ? (
        <div className="w-full h-full flex justify-center items-center">
          <DotSpinner />
        </div>
      ) : (
        <>
          <TabSelector
            activeTab={activeTab}
            onTabChange={memoizedHandlers.onTabChange}
          />
          <PageHeader activeTab={activeTab} viewState={viewState} />
          {renderContent()}
        </>
      )}
    </main>
  );
}
