import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs"; // Import the real Clerk hook
import { usePgnStore } from "@/app/store/zustandStore";
import { gameHistoryApi } from "../services/api";
import { isCacheValid } from "../services/cache";
import { toast } from "sonner";
import { FilterState, Game } from "../types/GameHistoryTypes";

// Helper to transform API data to component format
export const transformApiDataToComponentFormat = (apiData: any[]): Game[] => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item) => ({
    id: item.id,
    date: formatDate(item.date),
    timeControl: formatTimeControl(item.time_control),
    result: item.result,
    opponent: item.opponent,
    rating: item.rating,
    eloChange: item.elo_change,
    moves: item.moves,
    opening: item.opening_name || "Unknown Opening",
    source: item.source,
    color: item.color,
    gameFormat: item.game_format,
    pgn: item.pgn,
    resultColor: item.result_color || getResultColor(item.result),
    gameType: item.game_type || "standard",
  }));
};

// Helper to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // If the dateString is already in ISO format (like "2020-07-26T00:00:00.000Z")
    // Extract just the date part (YYYY-MM-DD) and return it
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    // Otherwise, parse it as a date and format
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return dateString; // Return original if invalid date
    }

    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dateObj.getDate()).padStart(2, "0")}`;
  } catch (e) {
    return dateString;
  }
};

// Helper to format time control
const formatTimeControl = (timeControlStr: string) => {
  if (!timeControlStr) return "0+0";

  const seconds = parseInt(timeControlStr);
  if (isNaN(seconds)) return timeControlStr;

  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}+${remainingSeconds}`
      : `${minutes}+0`;
  }
  return `${seconds}+0`;
};

// Helper to get result color
const getResultColor = (result: string): string => {
  if (result === "WIN") return "text-green-500";
  if (result === "LOSS") return "text-red-500";
  return "text-gray-500";
};

// Filter games based on filter criteria
export const filterGames = (
  gamesData: Game[],
  filters: FilterState
): Game[] => {
  if (!Array.isArray(gamesData)) return [];

  let filtered = [...gamesData];

  if (filters.color !== "All Colors") {
    filtered = filtered.filter((game) => game.color === filters.color);
  }

  if (filters.gameFormat !== "All Formats") {
    filtered = filtered.filter(
      (game) => game.gameFormat === filters.gameFormat
    );
  }

  if (filters.results !== "All Results") {
    const resultMap: Record<string, string> = {
      Wins: "WIN",
      Losses: "LOSS",
      Draws: "DRAW",
    };
    filtered = filtered.filter(
      (game) =>
        game.result === resultMap[filters.results as keyof typeof resultMap]
    );
  }

  return filtered;
};

// Get result data for display
export const getResultData = (
  result: string | undefined | null
): { text: string; className: string } => {
  if (!result || typeof result !== "string") {
    return { text: "UNKNOWN", className: "text-gray-500 font-semibold" };
  }

  if (result === "WIN") {
    return { text: "WIN", className: "text-green-500 font-semibold" };
  } else if (result === "LOSS") {
    return { text: "LOSS", className: "text-red-500 font-semibold" };
  } else {
    return { text: "DRAW", className: "text-gray-500 font-semibold" };
  }
};

// Get ELO change data for display
export const getEloChangeData = (
  change: string | undefined | null
): { value: number; text: string; className: string } => {
  if (!change || typeof change !== "string") {
    return { value: 0, text: "0", className: "text-gray-500" };
  }

  const match = change.match(/\(([+-]\d+) ELO Rating\)/);
  const value = match ? parseInt(match[1]) : 0;

  if (value > 0) {
    return { value, text: `+${value}`, className: "text-green-500" };
  } else if (value < 0) {
    return { value, text: `${value}`, className: "text-red-500" };
  } else {
    return { value, text: "0", className: "text-gray-500" };
  }
};

// Count active filters
export const countActiveFilters = (
  filters: FilterState,
  defaultFilters: FilterState
): number => {
  let count = 0;
  if (filters.timeRange !== defaultFilters.timeRange) count++;
  if (filters.gameType !== defaultFilters.gameType) count++;
  if (filters.color !== defaultFilters.color) count++;
  if (filters.gameFormat !== defaultFilters.gameFormat) count++;
  if (filters.results !== defaultFilters.results) count++;

  return count;
};

// Hook for fetching user games
export function useGames(type: "chessdotcom" | "other" = "chessdotcom") {
  const {
    username,
    gamesData: cachedUserGames,
    otherGamesData: cachedOtherGames,
    gamesLastFetched,
    otherGamesLastFetched,
    setGamesData,
    setOtherGamesData,
    resetFetchState,
  } = usePgnStore();

  // FIXED: Use the actual Clerk useAuth hook directly
  const { sessionId, isLoaded: authIsLoaded } = useAuth();

  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchRef = useRef(false);

  // Determine which cache to use based on type
  const cachedGames =
    type === "chessdotcom" ? cachedUserGames : cachedOtherGames;
  const gamesLastFetchedTimestamp =
    type === "chessdotcom" ? gamesLastFetched : otherGamesLastFetched;
  const setGamesInStore =
    type === "chessdotcom" ? setGamesData : setOtherGamesData;

  // Check if cache is valid
  const cacheIsValid = isCacheValid(gamesLastFetchedTimestamp, cachedGames);

  const fetchGames = useCallback(async () => {
    console.log("fetchGames called", {
      username,
      fetchRefActive: fetchRef.current,
      cacheIsValid,
      sessionId,
      type,
    });

    if (!username || fetchRef.current) {
      if (authIsLoaded && !username) {
        console.log("No username available, stopping fetch");
        setIsLoading(false);
      }
      return;
    }

    if (cacheIsValid && cachedGames) {
      console.log("Using cached games data:", cachedGames);
      setGames(cachedGames);
      setIsLoading(false);
      return;
    }

    fetchRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching games from API for:", username, "Type:", type);
      console.log("Session ID available:", !!sessionId);

      const response = await gameHistoryApi.getUserGames(
        sessionId ?? null,
        type
      );
      console.log("API Response:", response);

      if (response && response.data) {
        const transformedGames = transformApiDataToComponentFormat(
          response.data
        );
        console.log("Transformed games:", transformedGames);
        setGames(transformedGames);
        setGamesInStore(transformedGames);
      } else {
        console.warn("Empty or invalid response data");
        setGames([]);
        setGamesInStore([]);
      }
    } catch (err) {
      console.error("Error details:", err);
      const error =
        err instanceof Error ? err : new Error("Failed to fetch games");
      setError(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        fetchRef.current = false;
      }, 3000);
    }
  }, [
    username,
    sessionId,
    type,
    cacheIsValid,
    cachedGames,
    setGamesInStore,
    authIsLoaded,
  ]);

  // Fetch games on mount or when dependencies change
  useEffect(() => {
    console.log("useGames useEffect triggered");
    fetchGames();
  }, [fetchGames]);

  // Handle retry and refresh
  const handleRetryFetch = useCallback(() => {
    fetchRef.current = false;
    resetFetchState();
    fetchGames();
  }, [resetFetchState, fetchGames]);

  const handleForceRefresh = useCallback(() => {
    fetchRef.current = false;
    if (type === "chessdotcom") {
      usePgnStore.getState().clearGamesData();
    } else {
      usePgnStore.getState().clearOtherGamesData();
    }
    resetFetchState();
    toast.info("Refreshing games data...");
    fetchGames();
  }, [type, resetFetchState, fetchGames]);

  return {
    games,
    isLoading,
    error,
    cacheIsValid,
    handleRetryFetch,
    handleForceRefresh,
  };
}
