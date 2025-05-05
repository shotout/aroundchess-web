import { ViewState } from "../types/EndgameTrainingTypes";

export const handleCategorySelect = (
  setViewState: (state: ViewState) => void,
  categorySlug: string
): void => {
  setViewState({
    view: "subcategories",
    category: categorySlug,
  });
};

export const handlePositionSelect = (
  setViewState: (state: ViewState) => void,
  categorySlug: string,
  positionSlug: string,
  positionIndex?: number
): void => {
  setViewState({
    view: "detail",
    category: categorySlug,
    position: positionSlug,
    positionIndex,
  });
};

export const handleCheckmateSelect = (
  setViewState: (state: ViewState) => void,
  movesToCheckmate: number
): void => {
  setViewState({
    view: "subcategories",
    movesToCheckmate,
  });
};

export const handleCheckmatePositionSelect = (
  setViewState: (state: ViewState) => void,
  movesToCheckmate: number,
  positionIndex: number
): void => {
  setViewState({
    view: "detail",
    movesToCheckmate,
    positionIndex,
  });
};

export const handleBackToCategories = (
  setViewState: (state: ViewState) => void
): void => {
  setViewState({ view: "categories" });
};

export const handleBackToSubcategories = (
  setViewState: (state: ViewState) => void,
  currentViewState: any
): void => {
  setViewState({
    view: "subcategories",
    category: currentViewState.category,
    movesToCheckmate: currentViewState.movesToCheckmate,
  });
};

export const handleNextPosition = (
  activeTab: string,
  viewState: any,
  data: any[],
  setViewState: (state: ViewState) => void
): void => {
  if (
    activeTab === "move" &&
    Array.isArray(data) &&
    viewState.movesToCheckmate !== undefined &&
    viewState.positionIndex !== undefined &&
    viewState.movesToCheckmate > 0 &&
    viewState.movesToCheckmate <= data.length &&
    viewState.positionIndex < data[viewState.movesToCheckmate - 1].length - 1
  ) {
    handleCheckmatePositionSelect(
      setViewState,
      viewState.movesToCheckmate,
      viewState.positionIndex + 1
    );
  }
};

export const handlePreviousPosition = (
  activeTab: string,
  viewState: any,
  setViewState: (state: ViewState) => void
): void => {
  if (
    activeTab === "move" &&
    viewState.positionIndex !== undefined &&
    viewState.positionIndex > 0 &&
    viewState.movesToCheckmate !== undefined
  ) {
    handleCheckmatePositionSelect(
      setViewState,
      viewState.movesToCheckmate,
      viewState.positionIndex - 1
    );
  }
};

export const handleTabChange = (
  tab: string,
  setActiveTab: (tab: string) => void,
  setViewState: (state: ViewState) => void
): void => {
  setActiveTab(tab);
  setViewState({ view: "categories" });
};
