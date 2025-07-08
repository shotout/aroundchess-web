import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { GameStatistics } from "../types/GameHistoryTypes";
import { gameHistoryApi } from "../services/api";
import { toast } from "sonner";
import { usePgnStore } from "@/app/store/zustandStore";
import { useProfileStore } from "@/app/store/profile";

interface UseGameStatisticsResult {
  statistics: GameStatistics;
  isLoading: boolean;
  error: Error | null;
  refreshStatistics: () => Promise<void>;
  isCacheValid: boolean;
}

const DEFAULT_STATISTICS: GameStatistics = {
  bestWin: {
    opponent: "NONE",
    rating: 0,
    date: "",
  },
  winRate: {
    percentage: 0,
    monthlyChange: 0,
  },
  averageEloRating: {
    rating: 0,
    monthlyChange: 0,
  },
  totalGames: {
    count: 0,
    monthlyChange: 0,
  },
};

export const CACHE_EXPIRATION = 60 * 60 * 1000;

export function useGameStatistics(): UseGameStatisticsResult {
  const { sessionId } = useProfileStore();
  const {
    username,
    statisticsData: cachedStatistics,
    statisticsLastFetched,
    setStatisticsData,
    hydrated,
  } = usePgnStore();

  const [statistics, setStatistics] =
    useState<GameStatistics>(DEFAULT_STATISTICS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInProgress = useRef(false);

  const isCacheValid = useMemo(() => {
    if (!hydrated) {
      return false;
    }

    if (!statisticsLastFetched || !cachedStatistics) {
      return false;
    }

    const now = Date.now();
    const cacheAge = now - statisticsLastFetched;
    const isValid = cacheAge < CACHE_EXPIRATION;

    return isValid;
  }, [hydrated, statisticsLastFetched, cachedStatistics]);

  const fetchStatistics = useCallback(async () => {
    if (fetchInProgress.current) {
      return;
    }

    if (!sessionId || !username) {
      setIsLoading(false);
      return;
    }

    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await gameHistoryApi.getGameSummary(sessionId);

      if (response && response.success) {
        setStatisticsData(response.data);
        setStatistics(response.data);
      } else {
        setError(new Error("Invalid response format"));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch statistics";
      setError(new Error(errorMessage));
      toast.error("Failed to load statistics. Please try again later.");
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [sessionId, username, setStatisticsData]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!sessionId || !username) {
      setIsLoading(false);
      return;
    }
    if (isCacheValid && cachedStatistics) {
      setStatistics(cachedStatistics);
      setIsLoading(false);
      return;
    }

    if (!fetchInProgress.current) {
      fetchStatistics();
    }
  }, [
    hydrated,
    sessionId,
    username,
    isCacheValid,
    cachedStatistics,
    fetchStatistics,
  ]);

  const refreshStatistics = useCallback(async () => {
    fetchInProgress.current = false;
    toast.info("Refreshing statistics...");
    await fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refreshStatistics,
    isCacheValid,
  };
}
