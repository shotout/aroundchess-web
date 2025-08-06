import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { gameHistoryApi } from "../services/api";
import { FilterState, Game } from "../types/GameHistoryTypes";
import { useProfileStore } from "@/app/store/profile";

export const CACHE_EXPIRATION = 60 * 60 * 1000;

export const transformApiDataToComponentFormat = (apiData: any[]): Game[] => {
  if (!Array.isArray(apiData)) return [];

  return apiData
    .map((item) => {
      if (!item.id || !item.date) return null;

      const transformedOpening = formatOpening(item.opening_name);

      if (!transformedOpening || !item.time_control) return null;

      return {
        id: item.id,
        date: formatDate(item.date),
        timeControl: item.time_control,
        result: item.result,
        opponent: item.opponent,
        rating: item.rating,
        eloChange: item.elo_change,
        moves: item.moves,
        opening: transformedOpening,
        source: item.source,
        color: item.color,
        playerColor: item.color,
        gameFormat: item.game_format,
        pgn: item.pgn,
        resultColor: item.result_color || getResultColor(item.result),
        gameType: item.game_type,
        username: item.username,
        timeClass: item.time_class,
        isAnalysis: item.is_analysis,
      };
    })
    .filter(Boolean) as Game[];
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

const formatOpening = (openingName: string): string | null => {
  if (
    !openingName ||
    openingName.toLowerCase() === "unknown" ||
    openingName.toLowerCase() === "unknown opening" ||
    openingName.trim() === ""
  ) {
    return null;
  }
  return openingName.trim();
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

const isValidCache = (
  timestamp: number | null,
  data: any[] | null,
  expiration: number = CACHE_EXPIRATION
): boolean => {
  if (!timestamp || timestamp <= 0) {
    return false;
  }

  if (!data || !Array.isArray(data)) {
    return false;
  }

  const now = Date.now();
  const cacheAge = now - timestamp;

  if (cacheAge >= expiration) {
    return false;
  }

  return true;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRef = useRef(false);
  const lastExecutedRef = useRef<string>("");

  const cachedGames =
    type === "chessdotcom" ? cachedUserGames : cachedOtherGames;
  const gamesLastFetchedTimestamp =
    type === "chessdotcom" ? gamesLastFetched : otherGamesLastFetched;
  const setGamesInStore =
    type === "chessdotcom" ? setGamesData : setOtherGamesData;

  const isCacheValid = useMemo(() => {

    const isValid = isValidCache(
      gamesLastFetchedTimestamp,
      cachedGames,
      CACHE_EXPIRATION
    );

    return isValid;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamesLastFetchedTimestamp, cachedGames, type]);

  const updateStateWithProcessedData = useCallback(
    (processedGames: Game[]) => {
      setGames(processedGames);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type]
  );

  const fetchGames = useCallback(async () => {
    const executionKey = `${sessionId}-${username}-${type}`;

    // Prevent duplicate executions
    if (fetchRef.current || lastExecutedRef.current === executionKey) {
      return;
    }

    if (!username && type === "chessdotcom") {
      setIsLoading(false);
      return;
    }

    if (isCacheValid && cachedGames) {
      try {
        const transformedGames = transformApiDataToComponentFormat(cachedGames);
        updateStateWithProcessedData(transformedGames);
      } catch (err) {
        console.error(
          `[${type.toUpperCase()}] Error processing cached data:`,
          err
        );
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to process cached data")
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    fetchRef.current = true;
    lastExecutedRef.current = executionKey;
    setIsLoading(true);
    setError(null);

    try {
      const response = await gameHistoryApi.getUserGames(
        sessionId ?? null,
        type
      );

      if (response && response.data) {
        const apiData = response.data;
       
        setGamesInStore(apiData);

        const transformedGames = transformApiDataToComponentFormat(apiData);
        updateStateWithProcessedData(transformedGames);

      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      console.error(`[${type.toUpperCase()}] Error fetching games:`, error);
      setError(error);
    } finally {
      setIsLoading(false);
      // Reset fetch ref after a delay
      setTimeout(() => {
        fetchRef.current = false;
      }, 1000);
    }
  }, [
    sessionId,
    username,
    type,
    isCacheValid,
    cachedGames,
    setGamesInStore,
    updateStateWithProcessedData,
  ]);

  useEffect(() => {
    if (!sessionId) return;

    const executionKey = `${sessionId}-${username}-${type}`;

    if (lastExecutedRef.current !== executionKey && !fetchRef.current) {
     
      fetchGames();
    } else if (isCacheValid && cachedGames) {
      
      const transformedGames = transformApiDataToComponentFormat(cachedGames);
      updateStateWithProcessedData(transformedGames);
      setIsLoading(false);
    }
  }, [
    sessionId,
    username,
    type,
    fetchGames,
    isCacheValid,
    cachedGames,
    updateStateWithProcessedData,
  ]);

  const handleRetryFetch = useCallback(() => {
    fetchRef.current = false;
    lastExecutedRef.current = "";
    resetFetchState();
    fetchGames();
  }, [resetFetchState, fetchGames]);

  const handleForceRefresh = useCallback(() => {
    fetchRef.current = false;
    lastExecutedRef.current = "";

    if (type === "chessdotcom") {
      usePgnStore.getState().clearGamesData();
    } else {
      usePgnStore.getState().clearOtherGamesData();
    }

    resetFetchState();
    fetchGames();
  }, [type, resetFetchState, fetchGames]);

  return {
    games,
    isLoading,
    error,
    isCacheValid,
    handleRetryFetch,
    handleForceRefresh,
  };
}
