import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { gameHistoryApi } from "../services/api";
import { FilterState, Game } from "../types/GameHistoryTypes";
import { useProfileStore } from "@/app/store/profile";
import { useTutorial } from "@/components/TutorialProvider";

export const CACHE_EXPIRATION = 60 * 60 * 1000;

/**
 * If an item already looks like our UI‐shaped Game, pass it through;
 * otherwise transform from raw API shape.
 */
export const transformApiDataToComponentFormat = (apiData: any[]): Game[] => {
  if (!Array.isArray(apiData)) return [];

  return apiData
    .map((item) => {
      // 1) UI‐shaped Game? let it pass
      if (
        (typeof item.id === "string" || typeof item.id === "number") &&
        typeof item.date === "string" &&
        typeof item.pgn === "string" &&
        typeof item.timeControl === "string"
      ) {
        return item as Game;
      }

      // 2) Raw API shape → Game
      if (!item.id || !item.date || !item.time_control) {
        return null;
      }
      const transformedOpening = formatOpening(item.opening_name);
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
        hasViewedAnalysis: item.has_viewed_analysis || false,
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
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return dateString;
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return dateString;
  }
};

const formatOpening = (openingName: string): string => {
  if (
    !openingName ||
    openingName.toLowerCase() === "unknown" ||
    openingName.toLowerCase() === "unknown opening" ||
    openingName.trim() === ""
  ) {
    return "Unknown Opening";
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
      (g) =>
        g.color?.toLowerCase() === filters.color.toLowerCase() ||
        g.playerColor?.toLowerCase() === filters.color.toLowerCase()
    );
  }
  if (filters.results !== "All Results") {
    const resultMap: Record<string, string> = {
      Wins: "WIN",
      Losses: "LOSS",
      Draws: "DRAW",
    };
    filtered = filtered.filter(
      (g) => g.result === resultMap[filters.results as keyof typeof resultMap]
    );
  }
  return filtered;
};

export const getResultData = (
  result: string | undefined | null
): { text: string; className: string } => {
  if (!result) {
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
  if (!timestamp || timestamp <= 0) return false;
  if (!data || !Array.isArray(data)) return false;
  const age = Date.now() - timestamp;
  return age < expiration;
};

export interface GameFilters {
  sources?: string[];
  result?: string;
  color?: string;
  analyzedOnly?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  opponent?: string;
}

export function useGames(filters?: GameFilters) {
  const {
    gamesData: cachedUserGames,
    gamesLastFetched,
    setGamesData,
    resetFetchState,
  } = usePgnStore();
  const { sessionId } = useProfileStore();
  const { isTutorialPlay } = useTutorial();

  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRef = useRef(false);
  const lastExecutedRef = useRef<string>("");

  // Create a stable filter key for caching
  const filterKey = useMemo(() => {
    return JSON.stringify(filters || {});
  }, [filters]);

  const updateState = useCallback(
    (processed: Game[]) => setGames(processed),
    []
  );

  const fetchGames = useCallback(async () => {
    const key = `${sessionId}-${filterKey}`;
    console.log("🔍 [useGameData] fetchGames called, key:", key);
    console.log("🔍 [useGameData] fetchRef.current:", fetchRef.current);
    console.log("🔍 [useGameData] lastExecutedRef.current:", lastExecutedRef.current);

    if (fetchRef.current || lastExecutedRef.current === key) {
      console.log("⏭️ [useGameData] Skipping fetch (already in progress or same key)");
      return;
    }

    fetchRef.current = true;
    lastExecutedRef.current = key;
    setIsLoading(true);
    setError(null);

    console.log("🚀 [useGameData] Starting API call to getUserGames");

    try {
      const res = await gameHistoryApi.getUserGames(sessionId ?? null, filters);
      if (res?.data) {
        setGamesData(res.data);
        updateState(transformApiDataToComponentFormat(res.data));
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Fetch unknown error");
      console.error(`[GAME_HISTORY] fetch error:`, e);
      setError(e);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        fetchRef.current = false;
      }, 1000);
    }
  }, [sessionId, filterKey, filters, setGamesData, updateState]);

  useEffect(() => {
    console.log("🔄 [useGameData] useEffect triggered");
    console.log("🔄 [useGameData] Dependencies:", { sessionId: !!sessionId, filterKey, isTutorialPlay });

    // Skip fetching games when tutorial is active - we'll use dummy data instead
    if (isTutorialPlay) {
      console.log("🎓 [useGameData] Tutorial mode - skipping fetch");
      setIsLoading(false);
      setError(null);
      setGames([]);
      return;
    }

    if (!sessionId) {
      console.log("⏸️ [useGameData] No sessionId - skipping fetch");
      return;
    }

    const key = `${sessionId}-${filterKey}`;
    console.log("🔑 [useGameData] Checking if should fetch - key:", key);
    console.log("🔑 [useGameData] lastExecutedRef:", lastExecutedRef.current);
    console.log("🔑 [useGameData] fetchRef:", fetchRef.current);

    if (lastExecutedRef.current !== key && !fetchRef.current) {
      console.log("✅ [useGameData] Conditions met - calling fetchGames");
      fetchGames();
    } else {
      console.log("❌ [useGameData] Skipping fetch - conditions not met");
    }
  }, [sessionId, filterKey, fetchGames, isTutorialPlay]);

  const handleRetryFetch = useCallback(() => {
    fetchRef.current = false;
    lastExecutedRef.current = "";
    resetFetchState();
    fetchGames();
  }, [resetFetchState, fetchGames]);

  const handleForceRefresh = useCallback(() => {
    console.log("⚡ [useGameData] handleForceRefresh called - canceling previous fetch");
    console.log("🗑️ [useGameData] Before reset - fetchRef:", fetchRef.current, "lastExecutedRef:", lastExecutedRef.current);
    
    fetchRef.current = false;
    lastExecutedRef.current = "";
    usePgnStore.getState().clearGamesData();
    resetFetchState();
    
    console.log("✅ [useGameData] Reset complete - triggering new fetch");
    fetchGames();
  }, [resetFetchState, fetchGames]);

  return {
    games,
    isLoading,
    error,
    handleRetryFetch,
    handleForceRefresh,
  };
}
