import React from "react";
import {
  TabType,
  EndgameData,
  CheckmateData,
} from "../../types/EndgameTrainingTypes";
import { CategoryGrid } from "../board/CategoryGrid";
import { CheckmateCategoryGrid } from "../moves/CheckmateCategoryGrid";

interface CategoryViewProps {
  activeTab: TabType;
  data: EndgameData | CheckmateData;
  onCategorySelect: (categorySlug: string) => void;
  onCheckmateSelect: (movesToCheckmate: number) => void;
}

export default function CategoryView({
  activeTab,
  data,
  onCategorySelect,
  onCheckmateSelect,
}: CategoryViewProps) {
  if (activeTab === "board") {
    return (
      <CategoryGrid
        data={data as EndgameData}
        onCategorySelect={onCategorySelect}
      />
    );
  }

  return (
    <CheckmateCategoryGrid
      data={data as CheckmateData}
      onCategorySelect={onCheckmateSelect}
    />
  );
}
