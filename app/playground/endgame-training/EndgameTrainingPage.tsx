"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEndgametraining } from "./store/EndgameTrainingStore";
import { useCheckmateTraining } from "./store/CheckmateStore";
import DotSpinner from "@/components/game-history/Spinner";
import TabSelector from "./components/TabSelector";
import CategoryView from "./components/views/CategoryView";
import SubcategoryView from "./components/views/SubCategoryView";
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
  const router = useRouter();
  const { activeTab, setActiveTab, viewState, setViewState, hydrated } =
    useEndgameNavigation();

  const endgame = useEndgametraining();
  const checkmate = useCheckmateTraining();

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

      onCheckmateSelect: (movesToCheckmate: number) => {
        if (
          !checkmate.data ||
          !Array.isArray(checkmate.data) ||
          movesToCheckmate <= 0 ||
          movesToCheckmate > checkmate.data.length
        ) {
          return;
        }

        const positions = checkmate.data[movesToCheckmate - 1];
        if (!positions || positions.length === 0) {
          return;
        }

        const randomIndex = Math.floor(Math.random() * positions.length);

        setViewState({
          view: "detail",
          movesToCheckmate,
          positionIndex: randomIndex,
        });

        router.push(
          `/playground/endgame-training/checkmate-${movesToCheckmate}/position-${
            randomIndex + 1
          }/stage-${randomIndex + 1}`
        );
      },

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
    [
      activeTab,
      currentTabData.data,
      setActiveTab,
      setViewState,
      viewState,
      router,
      checkmate.data,
    ]
  );

  const renderContent = () => {
    const { data, isLoading, error, fetchData } = currentTabData;

    if (isLoading) return <DotSpinner />;
    if (error) return <ErrorDisplay error={error} onRetry={fetchData} />;

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
      default:
        return <DotSpinner />;
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
          <div className="flex justify-center items-center md:justify-start md:items-start">
            <TabSelector
              activeTab={activeTab}
              onTabChange={memoizedHandlers.onTabChange}
            />
          </div>
          <PageHeader activeTab={activeTab} viewState={viewState} />
          <div
            className={`flex  ${
              viewState.view === "subcategories"
                ? "justify-start items-start"
                : "justify-center items-center"
            } w-full`}
          >
            {renderContent()}
          </div>
        </>
      )}
    </main>
  );
}
