import React from "react";
import {
  ViewState,
  TabType,
  EndgameData,
  CheckmateData,
} from "../../types/EndgameTrainingTypes";
import { ChevronLeft } from "lucide-react";
import EndgameTrainingView from "../board/EndgameTrainingView";
import CheckmateTrainingView from "../moves/CheckmateTrainingView";
import { getCategoryNameFromSlug } from "../../utils/SlugUtils";

interface SubcategoryViewProps {
  activeTab: TabType;
  data: EndgameData | CheckmateData;
  viewState: ViewState;
  onPositionSelect: (
    categorySlug: string,
    positionSlug: string,
    positionIndex?: number
  ) => void;
  onCheckmatePositionSelect: (
    movesToCheckmate: number,
    positionIndex: number
  ) => void;
  onBackClick: () => void;
}

export default function SubcategoryView({
  activeTab,
  data,
  viewState,
  onPositionSelect,
  onCheckmatePositionSelect,
  onBackClick,
}: SubcategoryViewProps) {
  if (viewState.view !== "subcategories") return null;

  if (activeTab === "board" && viewState.category) {
    const categoryName = getCategoryNameFromSlug(
      (data as EndgameData).categories,
      viewState.category
    );

    return (
      <EndgameTrainingView
        slug={viewState.category}
        data={data as EndgameData}
        onPositionSelect={(positionSlug: string) =>
          onPositionSelect(viewState.category!, positionSlug)
        }
        onBackClick={onBackClick}
      />
    );
  }

  if (activeTab === "move" && viewState.movesToCheckmate) {
    return (
      <>
        <div className="mb-6">
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
          data={data as CheckmateData}
          onPositionSelect={(index) =>
            onCheckmatePositionSelect(viewState.movesToCheckmate!, index)
          }
          onBackClick={onBackClick}
        />
      </>
    );
  }

  return null;
}
