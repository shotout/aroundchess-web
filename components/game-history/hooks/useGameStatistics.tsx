import { useState, useEffect, useCallback } from "react";
import { GameStatistics } from "../types/GameHistoryTypes";
import { gameHistoryApi } from "../services/api";
import { toast } from "sonner";
import { usePgnStore } from "@/app/store/zustandStore";
import { useAuth } from "@clerk/nextjs";

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
  const { sessionId } = useAuth();
  const { username } = usePgnStore();
  const [statistics, setStatistics] =
    useState<GameStatistics>(DEFAULT_STATISTICS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!sessionId || !username) {
      setIsLoading(false);
      return;
    }

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
    }
  }, [sessionId, username]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const refreshStatistics = useCallback(async () => {
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
