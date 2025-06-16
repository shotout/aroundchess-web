import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { gameHistoryApi } from "../services/api";
import { toast } from "sonner";
import { FilterState, Game } from "../types/GameHistoryTypes";
import { useProfileStore } from "@/app/store/profile";
import { time } from "console";

export const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

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
        opponent: item.opponent || "Unknown Player",
        rating: item.rating,
        eloChange: item.elo_change,
        moves: item.moves || 0,
        opening: transformedOpening,
        source: item.source,
        color: item.color,
        playerColor: item.color,
        gameFormat: item.game_format,
        pgn: item.pgn,
        resultColor: item.result_color || getResultColor(item.result),
        gameType: item.game_type || "standard",
        username: item.username,
        timeClass: item.time_class || "Unknown",
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
    return null; // Return null for invalid openings
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

// useGameData.tsx - Fixed useGames function
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

  // Stabilize setGamesInStore reference
  const setGamesInStore = useMemo(
    () => (type === "chessdotcom" ? setGamesData : setOtherGamesData),
    [type, setGamesData, setOtherGamesData]
  );

  const isCacheValid = useMemo(() => {
    if (!gamesLastFetchedTimestamp || !cachedGames) return false;

    const now = Date.now();
    const cacheAge = now - gamesLastFetchedTimestamp;
    return (
      cacheAge < CACHE_EXPIRATION &&
      Array.isArray(cachedGames) &&
      cachedGames.length > 0
    );
  }, [gamesLastFetchedTimestamp, cachedGames]);

  const updateStateWithProcessedData = useCallback((processedGames: Game[]) => {
    setGames(processedGames);
  }, []);

  const fetchGames = useCallback(async () => {
    // Create unique execution key
    const executionKey = `${sessionId}-${username}-${type}`;

    // Prevent duplicate executions
    if (fetchRef.current || lastExecutedRef.current === executionKey) {
      return;
    }

    if (!username) {
      setIsLoading(false);
      return;
    }

    // Use cache if valid
    if (isCacheValid && cachedGames) {
      try {
        const transformedGames = transformApiDataToComponentFormat(cachedGames);
        updateStateWithProcessedData(transformedGames);
      } catch (err) {
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
      console.error("Error fetching games:", error);
      setError(error);
    } finally {
      setIsLoading(false);
      // Reset fetch ref after a delay
      setTimeout(() => {
        fetchRef.current = false;
      }, 1000); // Reduced from 3000ms
    }
  }, []); // Remove all dependencies to prevent recreation

  // Manual dependency checking in useEffect
  useEffect(() => {
    if (!sessionId) return;

    const executionKey = `${sessionId}-${username}-${type}`;

    // Only fetch if we haven't executed for this combination
    if (lastExecutedRef.current !== executionKey && !fetchRef.current) {
      fetchGames();
    }
  }, [sessionId, username, type, fetchGames]);

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
    toast.info("Refreshing games data...");
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
