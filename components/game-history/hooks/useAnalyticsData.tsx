import { useState, useEffect, useCallback, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";
import {
  AnalyticsData,
  OpeningStatistic,
  ProcessedAnalyticsData,
  RatingProgressItem,
  ResultDistributionItem,
} from "../types/GameHistoryTypes";
import { gameHistoryApi } from "../services/api";
import { useProfileStore } from "@/app/store/profile";

export const CACHE_EXPIRATION = 60 * 60 * 1000;
export const MONTHS: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const RESULT_COLORS = {
  WIN: "#00B427",
  DRAW: "#fbbf24",
  LOSS: "#FD0000",
};

export const processApiData = (
  apiData: AnalyticsData
): ProcessedAnalyticsData => {
  const processedRatingData = apiData.ratingProgress
    .slice(0, MONTHS.length)
    .map((rating, index) => ({
      month: MONTHS[index],
      rating: rating,
    }));

  const resultData = [
    {
      name: "Win",
      value: apiData.resultDistribution.win || 0,
      color: RESULT_COLORS.WIN,
    },
    {
      name: "Draw",
      value: apiData.resultDistribution.draw || 0,
      color: RESULT_COLORS.DRAW,
    },
    {
      name: "Loss",
      value: apiData.resultDistribution.lose || 0,
      color: RESULT_COLORS.LOSS,
    },
  ];

  const openingStats = apiData.openingStatistics.map((opening) => ({
    name: opening.name,
    games: opening.games,
    winrate: `${opening.winRate}%`,
  }));

  const timeControlData = apiData.timeControlPerformance.map((item) => ({
    category: item.type,
    games: item.games,
    winRate: item.winRate,
  }));

  const insights = {
    averageGameLength: apiData.performanceInsights.averageGameLength,
    accuracy: apiData.performanceInsights.accuracy,
    timeManagement: apiData.timeManagement.efficiency,
    blunderRate: apiData.blunderRate,
  };

  interface KeyStatistics {
    totalGames: number;
    averageRating: number;
    winRate: any;
    longestStreak: any;
  }

  const stats: KeyStatistics = {
    totalGames: apiData.keyStatistics.totalGames,
    averageRating: apiData.keyStatistics.averageRating,
    winRate: apiData.keyStatistics.winRate,
    longestStreak: apiData.keyStatistics.longestStreak,
  };

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

export const getAchievementDetails = (achievement: string) => {
  if (
    achievement.includes("win streak") ||
    achievement.includes("consecutive wins")
  ) {
    return {
      icon: "swords",
      title: "Winning Streak",
      description: achievement,
    };
  } else if (
    achievement.includes("Rating improved") ||
    achievement.includes("points recently")
  ) {
    return {
      icon: "trophy",
      title: "Rating Progress",
      description: achievement,
    };
  } else if (
    achievement.includes("Reached") &&
    achievement.includes("rating")
  ) {
    return {
      icon: "trophy",
      title: "Rating Milestone",
      description: achievement,
    };
  } else if (
    achievement.includes("this week") ||
    achievement.includes("this month")
  ) {
    return {
      icon: "swords",
      title: "Recent Success",
      description: achievement,
    };
  } else if (
    achievement.includes("high accuracy") ||
    achievement.includes("accuracy games")
  ) {
    return {
      icon: "trophy",
      title: "Precision Play",
      description: achievement,
    };
  } else if (
    achievement.includes("Quick victory") ||
    achievement.includes("moves!")
  ) {
    return {
      icon: "swords",
      title: "Lightning Victory",
      description: achievement,
    };
  } else if (achievement.includes("bullet") || achievement.includes("Bullet")) {
    return {
      icon: "timer",
      title: "Speed Chess Master",
      description: achievement,
    };
  } else if (achievement.includes("blitz") || achievement.includes("Blitz")) {
    return {
      icon: "timer",
      title: "Blitz Warrior",
      description: achievement,
    };
  } else if (achievement.includes("win rate") || achievement.includes("%")) {
    return {
      icon: "trophy",
      title: "Consistent Performance",
      description: achievement,
    };
  } else if (achievement.includes("Played") && achievement.includes("games")) {
    return {
      icon: "swords",
      title: "Active Player",
      description: achievement,
    };
  } else if (achievement.includes("Current rating")) {
    return {
      icon: "trophy",
      title: "Chess Rating",
      description: achievement,
    };
  } else if (achievement.includes("Classical Win")) {
    return {
      icon: "trophy",
      title: "First Classical Win",
      description: "Won against 2,000+ rated player",
    };
  } else {
    return {
      icon: "timer",
      title: "Achievement",
      description: achievement,
    };
  }
};

export function useAnalyticsData() {
  const {
    username,
    analyticsData: cachedAnalytics,
    analyticsLastFetched,
    setAnalyticsData,
  } = usePgnStore();

  const { sessionId } = useProfileStore();

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

  const isCacheValid = useMemo(() => {
    if (!analyticsLastFetched || !cachedAnalytics) return false;

    const now = Date.now();
    const cacheAge = now - analyticsLastFetched;
    return (
      cacheAge < CACHE_EXPIRATION && Object.keys(cachedAnalytics).length > 0
    );
  }, [analyticsLastFetched, cachedAnalytics]);

  const updateStateWithProcessedData = useCallback(
    (data: ProcessedAnalyticsData) => {
      setRatingData(data.ratingData);
      setDistributionData(data.distributionData);
      setOpeningData(data.openingData);
      setProcessedData(data);
    },
    []
  );

  const fetchData = useCallback(async () => {
    if (!username || fetchRef.current) {
      if (!username) {
        setLoading(false);
      }
      return;
    }

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

  useEffect(() => {
    if (!sessionId) return;
    fetchData();
  }, [fetchData, sessionId]);

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

function useRef<T>(initialValue: T): { current: T } {
  const [ref] = useState<{ current: T }>({ current: initialValue });
  return ref;
}
