import Filters from "../Filters";
import { useGames } from "../../hooks/useGameData";
import { useFilters } from "../../hooks/useFilters";
import { usePagination } from "../../hooks/usePagination";
import GamesList from "../GameList";


const OtherGamesTab: React.FC = () => {
  const { games, isLoading, error, handleRetryFetch, handleForceRefresh } =
    useGames({ sources: ["vs_ai", "pgn_upload"] });

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
    { value: "Lichess", label: "Lichess" },
    { value: "File Upload", label: "File Upload" },
    { value: "Tournament", label: "Tournament" },
  ];

  return (
    <div className="mx-auto relative">
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

export default OtherGamesTab;
