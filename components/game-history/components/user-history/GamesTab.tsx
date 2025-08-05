import { useGames } from "../../hooks/useGameData";
import { useFilters } from "../../hooks/useFilters";
import { usePagination } from "../../hooks/usePagination";
import Filters from "../Filters";
import GamesList from "../GameList";

const GamesTab: React.FC = () => {

  const { games, isLoading, error, handleRetryFetch, handleForceRefresh } =
    useGames("chessdotcom");

  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    activeFiltersCount,
    filtersApplied,
    filteredGames,
    handleApplyFilters,
    handleClearFilters,
  } = useFilters(games);

  const paginationProps = usePagination(filteredGames);

  const sourceOptions = [
    { value: "All Formats", label: "All Sources" },
    { value: "Chess.com", label: "Chess.com" },
    { value: "PGN Upload", label: "PGN Upload" },
    { value: "Online Games", label: "Online Games" },
    { value: "Tournaments", label: "Tournaments" },
  ];

  return (
    <div className="mx-auto relative flex flex-col">
      <Filters
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        activeFiltersCount={activeFiltersCount}
        filtersApplied={filtersApplied}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
        handleForceRefresh={handleForceRefresh}
        sourceOptions={sourceOptions}
      />

      <GamesList
        games={filteredGames}
        currentGames={paginationProps.currentGames}
        isLoading={isLoading}
        error={error}
        handleRetryFetch={handleRetryFetch}
        paginationProps={paginationProps}
      />
    </div>
  );
};

export default GamesTab;
