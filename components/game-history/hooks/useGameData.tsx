import { useState, useEffect, useRef, useCallback } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { gameHistoryApi } from "../services/api";
import { isCacheValid } from "../services/cache";
import { toast } from "sonner";
import { FilterState, Game } from "../types/GameHistoryTypes";
import { useProfileStore } from "@/app/store/profile";

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
    playerColor: item.color,
    gameFormat: item.game_format,
    pgn: item.pgn,
    resultColor: item.result_color || getResultColor(item.result),
    gameType: item.game_type || "standard",
  }));
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return dateString;
    }

    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dateObj.getDate()).padStart(2, "0")}`;
  } catch (e) {
    return dateString;
  }
};

const formatTimeControl = (timeControlStr: string): string => {
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

const getResultColor = (result: string): string => {
  if (result === "WIN") return "text-green-500";
  if (result === "LOSS") return "text-red-500";
  return "text-gray-500";
};

export const filterGames = (
  gamesData: Game[],
  filters: FilterState
): Game[] => {
  if (!Array.isArray(gamesData)) return [];

  let filtered = [...gamesData];

  if (filters.color !== "All Colors") {
    filtered = filtered.filter(
      (game) =>
        game.color?.toLowerCase() === filters.color.toLowerCase() ||
        game.playerColor?.toLowerCase() === filters.color.toLowerCase()
    );
  }

  if (filters.gameFormat !== "All Formats") {
    filtered = filtered.filter(
      (game) =>
        game.source === filters.gameFormat ||
        game.gameFormat === filters.gameFormat ||
        (filters.gameFormat === "Online Games" &&
          ["Chess.com", "Lichess"].includes(game.source || "")) ||
        (filters.gameFormat === "Tournaments" && game.source === "Tournament")
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

export const getEloChangeData = (
  change: string | number | undefined | null,
  currentRating: number,
  previousRating: number | null
): { value: number; text: string; className: string } => {
  // Handle numeric input directly
  if (typeof change === "number") {
    const value = change;

    if (previousRating !== null) {
      if (currentRating > previousRating) {
        return { value, text: `+${value}`, className: "text-green-500" };
      } else if (currentRating < previousRating) {
        return {
          value,
          text: `-${Math.abs(value)}`,
          className: "text-red-500",
        };
      }
    }

    if (value > 0) {
      return { value, text: `+${value}`, className: "text-green-500" };
    } else if (value < 0) {
      return { value, text: `${value}`, className: "text-red-500" };
    }
    return { value, text: "0", className: "text-gray-500" };
  }

  // Handle string input (old format)
  if (!change || typeof change !== "string") {
    return { value: 0, text: "0", className: "text-gray-500" };
  }

  const match = change.match(/\(([+-]\d+) ELO Rating\)/);
  const value = match ? parseInt(match[1]) : 0;

  if (previousRating !== null) {
    if (currentRating > previousRating) {
      return { value, text: `+${value}`, className: "text-green-500" };
    } else if (currentRating < previousRating) {
      return { value, text: `-${Math.abs(value)}`, className: "text-red-500" };
    }
  }

  if (value > 0) {
    return { value, text: `+${value}`, className: "text-green-500" };
  } else if (value < 0) {
    return { value, text: `${value}`, className: "text-red-500" };
  }

  return { value, text: "0", className: "text-gray-500" };
};

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
  const { sessionId } = useProfileStore();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchRef = useRef(false);

  const cachedGames =
    type === "chessdotcom" ? cachedUserGames : cachedOtherGames;
  const gamesLastFetchedTimestamp =
    type === "chessdotcom" ? gamesLastFetched : otherGamesLastFetched;
  const setGamesInStore =
    type === "chessdotcom" ? setGamesData : setOtherGamesData;

  const cacheIsValid = isCacheValid(gamesLastFetchedTimestamp, cachedGames);

  const fetchGames = useCallback(async () => {
    if (!username || fetchRef.current) {
      if (!username) {
        setIsLoading(false);
      }
      return;
    }

    if (cacheIsValid && cachedGames) {
      setGames(transformApiDataToComponentFormat(cachedGames));
      setIsLoading(false);
      return;
    }

    fetchRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await gameHistoryApi.getUserGames(
        sessionId ?? null,
        type
      );

      if (response && response.data) {
        const transformedGames = transformApiDataToComponentFormat(
          response.data
        );
        setGames(transformedGames);
        setGamesInStore(transformedGames);
      } else {
        setGames([]);
        setGamesInStore([]);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch games");
      setError(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        fetchRef.current = false;
      }, 3000);
    }
  }, [username, sessionId, type, cacheIsValid, cachedGames, setGamesInStore]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

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
