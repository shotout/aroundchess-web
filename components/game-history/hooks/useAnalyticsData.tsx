import { useState, useEffect, useCallback, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  AnalyticsData,
  OpeningStatistic,
  ProcessedAnalyticsData,
  RatingProgressItem,
  ResultDistributionItem,
} from "../types/GameHistoryTypes";
import { gameHistoryApi } from "../services/api";

// Constants
export const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
export const MONTHS: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const RESULT_COLORS = {
  WIN: "#00B427",
  DRAW: "#fbbf24",
  LOSS: "#FD0000",
};

// Process API data into component-friendly format
export const processApiData = (
  apiData: AnalyticsData
): ProcessedAnalyticsData => {
  // Process rating progress data
  const processedRatingData = apiData.ratingProgress
    .slice(0, MONTHS.length)
    .map((rating, index) => ({
      month: MONTHS[index],
      rating: rating,
    }));

  // Process result distribution data
  const resultData = [
    {
      name: "Win",
      value: apiData.resultDistribution.win || 70,
      color: RESULT_COLORS.WIN,
    },
    {
      name: "Draw",
      value: apiData.resultDistribution.draw || 25,
      color: RESULT_COLORS.DRAW,
    },
    {
      name: "Loss",
      value: apiData.resultDistribution.lose || 5,
      color: RESULT_COLORS.LOSS,
    },
  ];

  // Process opening statistics
  const openingStats = apiData.openingStatistics.map((opening) => ({
    name: opening.name,
    games: opening.games,
    winrate: `${opening.winRate}%`,
  }));

  // Process time control performance
  const timeControlData = apiData.timeControlPerformance.map((item) => ({
    category: item.type,
    games: item.games,
    winRate: item.winRate,
  }));

  // Process performance insights
  const insights = {
    averageGameLength: apiData.performanceInsights.averageGameLength,
    accuracy: apiData.performanceInsights.accuracy,
    timeManagement: apiData.timeManagement.efficiency,
    blunderRate: apiData.blunderRate,
  };

  // Process key statistics
  const stats = {
    totalGames: apiData.keyStatistics.totalGames,
    winRate: 65, // Example default value
    averageRating: apiData.keyStatistics.averageRating,
    longestStreak: 8, // Example default value
  };

  // Process achievements
  const achievementsData = apiData.recentAchievements || [];

  return {
    ratingData: processedRatingData,
    distributionData: resultData,
    openingData: openingStats,
    performanceData: timeControlData,
    performanceInsights: insights,
    keyStats: stats,
    achievements: achievementsData,
  };
};

// Get achievement details for display
export const getAchievementDetails = (achievement: string) => {
  if (achievement.includes("Classical Win")) {
    return {
      icon: "trophy",
      title: "First Classical Win",
      description: "Won against 2,000+ rated player",
    };
  } else if (achievement.includes("consecutive wins")) {
    return {
      icon: "swords",
      title: "Winning Streak",
      description: achievement,
    };
  } else {
    return {
      icon: "timer",
      title: "Achievement",
      description: achievement,
    };
  }
};

// Custom hook for analytics data
export function useAnalyticsData() {
  const {
    username,
    analyticsData: cachedAnalytics,
    analyticsLastFetched,
    setAnalyticsData,
  } = usePgnStore();

  const sessionId = localStorage.getItem("token");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [ratingData, setRatingData] = useState<RatingProgressItem[]>([]);
  const [distributionData, setDistributionData] = useState<
    ResultDistributionItem[]
  >([]);
  const [openingData, setOpeningData] = useState<OpeningStatistic[]>([]);
  const [processedData, setProcessedData] =
    useState<ProcessedAnalyticsData | null>(null);

  const fetchRef = useRef(false);

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    if (!analyticsLastFetched || !cachedAnalytics) return false;

    const now = Date.now();
    const cacheAge = now - analyticsLastFetched;
    return (
      cacheAge < CACHE_EXPIRATION && Object.keys(cachedAnalytics).length > 0
    );
  }, [analyticsLastFetched, cachedAnalytics]);

  // Initialize state with processed data
  const updateStateWithProcessedData = useCallback(
    (data: ProcessedAnalyticsData) => {
      setRatingData(data.ratingData);
      setDistributionData(data.distributionData);
      setOpeningData(data.openingData);
      setProcessedData(data);
    },
    []
  );

  // Fetch analytics data
  const fetchData = useCallback(async () => {
    if (!username || fetchRef.current) {
      if (!username) {
        setLoading(false);
      }
      return;
    }

    // If cache is valid, use cached data
    if (isCacheValid && cachedAnalytics) {
      try {
        const processed = processApiData(cachedAnalytics);
        updateStateWithProcessedData(processed);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to process cached data")
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // Otherwise fetch fresh data
    fetchRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await gameHistoryApi.getAnalyticsData(sessionId ?? null);

      if (response && response.success) {
        const apiData = response.data as AnalyticsData;
        setAnalyticsData(apiData);

        const processed = processApiData(apiData);
        updateStateWithProcessedData(processed);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      console.error("Error fetching analytics:", error);
      setError(error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        fetchRef.current = false;
      }, 3000);
    }
  }, [
    username,
    sessionId,
    isCacheValid,
    cachedAnalytics,
    setAnalyticsData,
    updateStateWithProcessedData,
  ]);

  // Fetch data on mount
  useEffect(() => {
    if (!sessionId) return;
    fetchData();
  }, [fetchData, sessionId]);

  // Handle force refresh
  const handleForceRefresh = useCallback(() => {
    fetchRef.current = false;
    toast.info("Refreshing analytics data...");
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    data: processedData,
    ratingData,
    distributionData,
    openingData,
    isCacheValid,
    handleForceRefresh,
  };
}

// Workaround for the useRef error
function useRef<T>(initialValue: T): { current: T } {
  const [ref] = useState<{ current: T }>({ current: initialValue });
  return ref;
}
