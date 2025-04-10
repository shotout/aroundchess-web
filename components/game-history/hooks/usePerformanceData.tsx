import { useState, useEffect, useCallback, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { useAuth } from "@clerk/nextjs";

import { toast } from "sonner";
import {
  PerformanceData,
  BarDataItem,
  RadarDataItem,
} from "../types/GameHistoryTypes";
import { gameHistoryApi } from "../services/api";

const CACHE_EXPIRATION = 5 * 60 * 1000;

export const processPerformanceData = (
  apiData: any
): PerformanceData | null => {
  if (!apiData) return null;

  const accuracy = apiData.performanceInsights?.accuracy || 0;
  const blunderRate = parseFloat(apiData.blunderRate) || 0;
  const timeManagement = apiData.timeManagement?.efficiency || 0;
  const averageRating = apiData.keyStatistics?.averageRating || 0;

  const normalizedRating = Math.min(100, averageRating / 20 + 50);
  const middlegameScore = Math.max(50, 100 - blunderRate * 5);

  const openingStats = apiData.openingStatistics || [];
  const openingWinRates = openingStats.map(
    (opening: { winRate: any }) => opening.winRate
  );
  const averageOpeningWinRate =
    openingWinRates.length > 0
      ? openingWinRates.reduce((sum: any, rate: any) => sum + rate, 0) /
        openingWinRates.length
      : 75;

  const calculationScore = 100 - blunderRate * 4;
  const positionalScore = normalizedRating;
  const tacticalScore = accuracy;
  const endgameScore = Math.max(50, accuracy - 15);
  const timeManagementScore = timeManagement;
  const openingKnowledgeScore = Math.min(100, averageOpeningWinRate + 10);

  const radarData: RadarDataItem[] = [
    {
      subject: "Calculation",
      A: Math.round(calculationScore),
      fullMark: 100,
    },
    { subject: "Positional", A: Math.round(positionalScore), fullMark: 100 },
    { subject: "Tactical", A: Math.round(tacticalScore), fullMark: 100 },
    { subject: "Endgame", A: Math.round(endgameScore), fullMark: 100 },
    {
      subject: "Time Management",
      A: Math.round(timeManagementScore),
      fullMark: 100,
    },
    {
      subject: "Opening Knowledge",
      A: Math.round(openingKnowledgeScore),
      fullMark: 100,
    },
  ];

  const sortedSkills = [...radarData].sort((a, b) => b.A - a.A);
  const topStrengths = sortedSkills.slice(0, 3);
  const bottomWeaknesses = [...sortedSkills].reverse().slice(0, 3);

  const strengthsData = topStrengths.map((item) => ({
    name: item.subject,
    value: item.A,
    iconType: getSkillIconType(item.subject),
  }));

  const weaknessesData = bottomWeaknesses.map((item) => ({
    name: item.subject,
    value: item.A,
  }));

  const recommendationMap = {
    Endgame: "Practice endgame positions with rook and pawn",
    Positional: "Study positional pawn sacrifices",
    "Time Management": "Practice playing with incremental time controls",
    Calculation: "Work on calculation exercises and visualization",
    Tactical: "Solve tactical puzzles daily",
    "Opening Knowledge": "Study main lines of your opening repertoire",
  };

  type RecommendationKey = keyof typeof recommendationMap;

  const defaultGoals = [
    "Work on defensive techniques",
    "Analyze your losses for patterns",
    "Practice endgames against an engine",
  ];

  let shortTermGoals: string[] = bottomWeaknesses
    .map((w) => recommendationMap[w.subject as RecommendationKey])
    .filter(Boolean) as string[];

  for (let i = 0; shortTermGoals.length < 3 && i < defaultGoals.length; i++) {
    if (!shortTermGoals.includes(defaultGoals[i])) {
      shortTermGoals.push(defaultGoals[i]);
    }
  }

  shortTermGoals = shortTermGoals.slice(0, 3);

  const totalWeaknessScore = bottomWeaknesses.reduce(
    (sum, item) => sum + (100 - item.A),
    0
  );

  const trainingFocus = bottomWeaknesses.map((item) => {
    const percentage = Math.round(((100 - item.A) / totalWeaknessScore) * 100);
    return `${item.subject} training (${percentage}%)`;
  });

  const barData: BarDataItem[] = [
    {
      name: "Opening",
      performance: Math.round(averageOpeningWinRate),
      average: 75,
    },
    {
      name: "Middlegame",
      performance: Math.round(middlegameScore),
      average: 75,
    },
    { name: "Endgame", performance: Math.round(accuracy - 5), average: 75 },
    { name: "Tactics", performance: Math.round(accuracy), average: 75 },
    {
      name: "Strategy",
      performance: Math.round(normalizedRating),
      average: 75,
    },
  ];

  return {
    barData,
    radarData,
    strengthsData,
    weaknessesData,
    shortTermGoals,
    trainingFocus,
  };
};

const getSkillIconType = (skillName: string): string => {
  switch (skillName) {
    case "Tactical":
    case "Calculation":
      return "Calculation";
    case "Opening Knowledge":
      return "Opening Knowledge";
    case "Time Management":
      return "Time Management";
    default:
      return "Other";
  }
};

export function usePerformanceData() {
  const {
    username,
    performanceData: cachedPerformance,
    performanceLastFetched,
    setPerformanceData,
  } = usePgnStore();

  const { sessionId, isLoaded: authIsLoaded } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [processedData, setProcessedData] = useState<PerformanceData | null>(
    null
  );

  const fetchRef = useRef(false);

  const isCacheValid = useMemo(() => {
    if (!performanceLastFetched || !cachedPerformance) return false;
    const now = Date.now();
    const cacheAge = now - performanceLastFetched;
    return (
      cacheAge < CACHE_EXPIRATION && Object.keys(cachedPerformance).length > 0
    );
  }, [performanceLastFetched, cachedPerformance]);

  const fetchPerformanceData = useCallback(async () => {
    if (!username || fetchRef.current) {
      if (authIsLoaded && !username) {
        setLoading(false);
      }
      return;
    }

    if (isCacheValid && cachedPerformance) {
      setProcessedData(processPerformanceData(cachedPerformance));
      setLoading(false);
      return;
    }

    fetchRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await gameHistoryApi.getPerformanceData(
        sessionId ?? null
      );

      if (response?.success) {
        setPerformanceData(response.data);
        setProcessedData(processPerformanceData(response.data));
      } else {
        setError(new Error("Invalid data format received from server"));
      }
    } catch (err) {
      console.error("Error fetching performance data:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch performance data")
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        fetchRef.current = false;
      }, 3000);
    }
  }, [
    username,
    authIsLoaded,
    sessionId,
    setPerformanceData,
    isCacheValid,
    cachedPerformance,
  ]);

  const handleForceRefresh = useCallback(() => {
    fetchRef.current = false;
    toast.info("Refreshing performance data...");
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  useEffect(() => {
    if (authIsLoaded) {
      fetchPerformanceData();
    }
  }, [authIsLoaded, fetchPerformanceData]);

  return {
    loading,
    error,
    data: processedData,
    isCacheValid,
    handleForceRefresh,
  };
}

function useRef<T>(initialValue: T): { current: T } {
  const [ref] = useState<{ current: T }>({ current: initialValue });
  return ref;
}
