"use client";

import React, { useEffect, useState } from "react";
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
import { TabType, ViewState } from "./types/EndgameTrainingTypes";

export default function EndgameTrainingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("board");
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

  const renderContent = () => {
    const { data, isLoading, error, fetchData } = currentTabData;

    if (isLoading) return <DotSpinner />;

    if (error) {
      return <ErrorDisplay error={error} onRetry={fetchData} />;
    }

    if (!data) return <h1>no data</h1>;

    switch (viewState.view) {
      case "categories":
        return (
          <CategoryView
            activeTab={activeTab}
            data={data as any}
            onCategorySelect={(categorySlug) =>
              handleCategorySelect(setViewState, categorySlug)
            }
            onCheckmateSelect={(movesToCheckmate) =>
              handleCheckmateSelect(setViewState, movesToCheckmate)
            }
          />
        );
      case "subcategories":
        return (
          <SubcategoryView
            activeTab={activeTab}
            data={data as any}
            viewState={viewState}
            onPositionSelect={(
              categorySlug: string,
              positionSlug: string,
              positionIndex: number | undefined
            ) =>
              handlePositionSelect(
                setViewState,
                categorySlug,
                positionSlug,
                positionIndex
              )
            }
            onCheckmatePositionSelect={(movesToCheckmate, positionIndex) =>
              handleCheckmatePositionSelect(
                setViewState,
                movesToCheckmate,
                positionIndex
              )
            }
            onBackClick={() => handleBackToCategories(setViewState)}
          />
        );
      case "detail":
        return (
          <DetailView
            activeTab={activeTab}
            data={data as any}
            viewState={viewState}
            onBackClick={() =>
              handleBackToSubcategories(setViewState, viewState)
            }
            onNextPosition={() =>
              handleNextPosition(
                activeTab,
                viewState,
                data as any,
                setViewState
              )
            }
            onPreviousPosition={() =>
              handlePreviousPosition(activeTab, viewState, setViewState)
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="w-full h-full p-6 flex flex-col space-y-4">
      <TabSelector
        activeTab={activeTab}
        onTabChange={(tab) => handleTabChange(tab, setActiveTab, setViewState)}
      />
      <PageHeader activeTab={activeTab} viewState={viewState} />
      {renderContent()}
    </main>
  );
}
