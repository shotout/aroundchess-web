import React from "react";
import {
  ViewState,
  EndgameData,
  CheckmateData,
  EndgameSubcategory,
} from "../../types/EndgameTrainingTypes";
import { ChevronLeft } from "lucide-react";
import EndgameDetailView from "../board/EndgameDetailView";
import CheckmateDetailView from "../moves/CheckmateDetailView";
import {
  getCategoryNameFromSlug,
  getSubcategoryFromSlug,
} from "../../utils/SlugUtils";

interface DetailViewProps {
  activeTab: string;
  data: EndgameData | CheckmateData | any;
  viewState: ViewState;
  onBackClick: () => void;
  onNextPosition: () => void;
  onPreviousPosition: () => void;
}

export default function DetailView({
  activeTab,
  data,
  viewState,
  onBackClick,
  onNextPosition,
  onPreviousPosition,
}: DetailViewProps) {
  if (viewState.view !== "detail") return null;

  if (activeTab === "board" && viewState.category && viewState.position) {
    const endgameData = data as EndgameData;
    const categoryName = getCategoryNameFromSlug(
      endgameData.categories,
      viewState.category
    );

    const subcategory = getSubcategoryFromSlug(
      endgameData.categories,
      viewState.category,
      viewState.position
    );

    return (
      <>
        <div className="mb-6">
          <button
            onClick={onBackClick}
            className="text-blue-600 flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {categoryName || viewState.category}
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {subcategory?.name || viewState.position}
          </h1>
          <p className="text-gray-600">Practice with these positions</p>
        </div>
        <EndgameDetailView
          endgameSubcategory={subcategory as EndgameSubcategory}
        />
      </>
    );
  }

  if (
    activeTab === "move" &&
    viewState.movesToCheckmate !== undefined &&
    viewState.positionIndex !== undefined
  ) {
    const checkmateData = data as CheckmateData;
    const fen = getFenPosition(
      checkmateData,
      viewState.movesToCheckmate,
      viewState.positionIndex
    );

    return (
      <>
        <div className="mb-6">
          <button
            onClick={onBackClick}
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
          checkmateData={checkmateData}
          params={{
            slug: `checkmate-${viewState.movesToCheckmate}`,
            position: `position-${viewState.positionIndex + 1}`,
          }}
          onNextPosition={onNextPosition}
          onPreviousPosition={onPreviousPosition}
        />
      </>
    );
  }

  return null;
}

function getFenPosition(
  data: CheckmateData,
  movesToCheckmate: number,
  positionIndex: number
): string | null {
  if (
    Array.isArray(data) &&
    movesToCheckmate > 0 &&
    movesToCheckmate <= data.length &&
    positionIndex < data[movesToCheckmate - 1].length
  ) {
    return data[movesToCheckmate - 1][positionIndex];
  }

  return null;
}
