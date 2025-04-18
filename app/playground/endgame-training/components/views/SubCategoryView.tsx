import React from "react";
import {
  ViewState,
  EndgameData,
  CheckmateData,
} from "../../types/EndgameTrainingTypes";
import EndgameTrainingView from "../board/EndgameTrainingView";
import CheckmateTrainingView from "../moves/CheckmateTrainingView";

interface SubcategoryViewProps {
  activeTab: string;
  data: EndgameData | CheckmateData | any;
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

  return (
    <div className="w-full flex flex-col space-y-5">
      {activeTab === "board" && viewState.category ? (
        <>
          <EndgameTrainingView
            slug={viewState.category}
            data={data as EndgameData}
            onPositionSelect={(positionSlug: string) =>
              onPositionSelect(viewState.category!, positionSlug)
            }
            onBackClick={onBackClick}
          />
        </>
      ) : activeTab === "move" && viewState.movesToCheckmate ? (
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
      ) : null}
    </div>
  );
}
