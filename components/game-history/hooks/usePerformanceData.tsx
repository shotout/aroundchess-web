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

const CACHE_EXPIRATION = 60 * 60 * 1000;

export const processPerformanceData = (
  apiData: any
): PerformanceData | null => {
  if (!apiData) return null;

  const barData: BarDataItem[] = apiData.barData || [];

  const radarData: RadarDataItem[] = [
    {
      subject: "Calculation",
      A: apiData.skillAnalysis?.calculation || 0,
      fullMark: 100,
    },
    {
      subject: "Positional Play",
      A: apiData.skillAnalysis?.positional || 0,
      fullMark: 100,
    },
    {
      subject: "Tactical Vision",
      A: apiData.skillAnalysis?.tactical || 0,
      fullMark: 100,
    },
    {
      subject: "Endgame Technique",
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

  const strengthsData =
    apiData.strengthsAndWeaknesses?.strengths.map((item: any) => ({
      name: item.name,
      value: item.score,
      iconType: getSkillIconType(item.name),
    })) || [];

  const weaknessesData =
    apiData.strengthsAndWeaknesses?.areasForImprovement.map((item: any) => ({
      name: item.name,
      value: item.score,
    })) || [];

  const shortTermGoals = apiData.improvementRecommendations?.shortTermGoals || [
    "Work on defensive techniques",
    "Analyze your losses for patterns",
    "Practice endgames against an engine",
  ];

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

const formatTrainingKey = (key: string): string => {
  const formatted = key.replace(/([A-Z])/g, " $1").trim();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const getSkillIconType = (skillName: string): string => {
  if (skillName.includes("Calculation")) {
    return "Calculation";
  } else if (skillName.includes("Tactical")) {
    return "Tactical";
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
