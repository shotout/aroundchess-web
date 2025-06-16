import { useState, useEffect, useCallback, useRef } from "react";
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

export function useGameStatistics(): UseGameStatisticsResult {
  const { sessionId } = useProfileStore();
  const { username } = usePgnStore();
  const [statistics, setStatistics] =
    useState<GameStatistics>(DEFAULT_STATISTICS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isExecutingRef = useRef(false);
  const lastExecutedRef = useRef<string>("");

  const fetchStatistics = useCallback(async () => {
    const executionKey = `${sessionId}-${username}`;

    if (isExecutingRef.current || lastExecutedRef.current === executionKey) {
      return;
    }

    if (!sessionId || !username) {
      setIsLoading(false);
      return;
    }

    isExecutingRef.current = true;
    lastExecutedRef.current = executionKey;
    setIsLoading(true);
    setError(null);

    try {
      const response = await gameHistoryApi.getGameSummary(sessionId);

      if (response && response.success) {
        setStatistics(response.data);
      } else {
        console.warn("API returned success:false or missing data", response);
        setError(new Error("Invalid response format"));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch statistics";
      console.error("Error fetching statistics:", errorMessage);
      setError(new Error(errorMessage));
      toast.error("Failed to load statistics. Please try again later.");
    } finally {
      setIsLoading(false);
      isExecutingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const executionKey = `${sessionId}-${username}`;

    if (lastExecutedRef.current !== executionKey && !isExecutingRef.current) {
      fetchStatistics();
    }
  }, [sessionId, username, fetchStatistics]);

  const refreshStatistics = useCallback(async () => {
    lastExecutedRef.current = "";
    toast.info("Refreshing statistics...");
    await fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refreshStatistics,
  };
}
