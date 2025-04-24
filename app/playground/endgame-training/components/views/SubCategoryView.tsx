import React from "react";
import {
  ViewState,
  EndgameData,
  CheckmateData,
} from "../../types/EndgameTrainingTypes";
import EndgameTrainingView from "../board/EndgameTrainingView";

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
      ) : null}
    </div>
  );
}
