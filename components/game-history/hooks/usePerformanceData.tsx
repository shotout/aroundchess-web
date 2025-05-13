import { useState, useEffect, useCallback, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";

import { toast } from "sonner";
import {
  PerformanceData,
  BarDataItem,
  RadarDataItem,
} from "../types/GameHistoryTypes";
import { gameHistoryApi } from "../services/api";
import { useProfileStore } from "@/app/store/profile";

const CACHE_EXPIRATION = 5 * 60 * 1000;

export const processPerformanceData = (
  apiData: any
): PerformanceData | null => {
  if (!apiData) return null;

  // Process bar data using the new performanceByGamePhase structure
  const barData: BarDataItem[] = [
    {
      name: "Opening",
      performance: apiData.performanceByGamePhase?.opening || 0,
      average: 75,
    },
    {
      name: "Middlegame",
      performance: apiData.performanceByGamePhase?.middlegame || 0,
      average: 75,
    },
    {
      name: "Endgame",
      performance: apiData.performanceByGamePhase?.endgame || 0,
      average: 75,
    },
    {
      name: "Tactics",
      performance: apiData.performanceByGamePhase?.tactics || 0,
      average: 75,
    },
    {
      name: "Strategy",
      performance: apiData.performanceByGamePhase?.strategy || 0,
      average: 75,
    },
  ];

  // Process radar data using the new skillAnalysis structure
  const radarData: RadarDataItem[] = [
    {
      subject: "Calculation",
      A: apiData.skillAnalysis?.calculation || 0,
      fullMark: 100,
    },
    {
      subject: "Positional",
      A: apiData.skillAnalysis?.positional || 0,
      fullMark: 100,
    },
    {
      subject: "Tactical",
      A: apiData.skillAnalysis?.tactical || 0,
      fullMark: 100,
    },
    {
      subject: "Endgame",
      A: apiData.skillAnalysis?.endgame || 0,
      fullMark: 100,
    },
    {
      subject: "Time Management",
      A: apiData.skillAnalysis?.timeManagement || 0,
      fullMark: 100,
    },
    {
      subject: "Opening Knowledge",
      A: apiData.skillAnalysis?.openingKnowledge || 0,
      fullMark: 100,
    },
  ];

  // Process strengths data using the new strengthsAndWeaknesses.strengths structure
  const strengthsData =
    apiData.strengthsAndWeaknesses?.strengths.map((item: any) => ({
      name: item.name,
      value: item.score,
      iconType: getSkillIconType(item.name),
    })) || [];

  // Process weaknesses data using the new strengthsAndWeaknesses.areasForImprovement structure
  const weaknessesData =
    apiData.strengthsAndWeaknesses?.areasForImprovement.map((item: any) => ({
      name: item.name,
      value: item.score,
    })) || [];

  // Get short-term goals directly from the new improvementRecommendations structure
  const shortTermGoals = apiData.improvementRecommendations?.shortTermGoals || [
    "Work on defensive techniques",
    "Analyze your losses for patterns",
    "Practice endgames against an engine",
  ];

  // Process training focus from the new improvementRecommendations.trainingFocus structure
  const trainingFocus = Object.entries(
    apiData.improvementRecommendations?.trainingFocus || {}
  ).map(([key, value]) => `${formatTrainingKey(key)} (${value}%)`);

  return {
    barData,
    radarData,
    strengthsData,
    weaknessesData,
    shortTermGoals,
    trainingFocus,
  };
};

// Helper function to format training keys from camelCase to readable text
const formatTrainingKey = (key: string): string => {
  // Convert camelCase to space-separated words and capitalize first letter
  const formatted = key.replace(/([A-Z])/g, " $1").trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const getSkillIconType = (skillName: string): string => {
  // Map skill names to icon types
  if (skillName.includes("Calculation") || skillName.includes("Tactical")) {
    return "Calculation";
  } else if (skillName.includes("Opening")) {
    return "Opening Knowledge";
  } else if (skillName.includes("Time")) {
    return "Time Management";
  } else {
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

  const { sessionId } = useProfileStore();

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
      if (!username) {
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
    fetchPerformanceData();
  }, [fetchPerformanceData]);

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
