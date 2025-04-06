import React, { useEffect, useState, useMemo, useCallback } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import {
  API_BASE_URL,
  CACHE_EXPIRATION,
  processPerformanceData,
  ProcessedPerformanceData,
} from "./util/PerformanceHelper";

import GamePhaseChart from "./GamePhaseChart";
import SkillAnalysisRadar from "./SkillAnalysisRadar";
import StrengthsWeaknessesSection from "./StrengthAndWeakness";
import ImprovementRecommendations from "./ImprovementRecommendation";
import DotSpinner from "../Spinner";
import { Button } from "@/components/ui/button";

const Performance = () => {
  const {
    username,
    performanceData: cachedPerformance,
    performanceLastFetched,
    setPerformanceData,
  } = usePgnStore();

  const { sessionId, isLoaded: authIsLoaded } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRef = React.useRef(false);

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

    fetchRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${API_BASE_URL}/analytic-games/my-game-performance-history`;

      const config = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      };

      const response = await axios.get(apiUrl, config);

      if (response.data?.success) {
        setPerformanceData(response.data.data);
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
  }, [username, authIsLoaded, sessionId, setPerformanceData]);

  const handleForceRefresh = useCallback(() => {
    fetchRef.current = false;
    toast.info("Refreshing performance data...");
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  useEffect(() => {
    if (isCacheValid && cachedPerformance) {
      setLoading(false);
      return;
    }

    if (authIsLoaded) {
      fetchPerformanceData();
    }
  }, [authIsLoaded, isCacheValid, cachedPerformance, fetchPerformanceData]);

  const processedDataResult = useMemo<ProcessedPerformanceData | null>(() => {
    return processPerformanceData(cachedPerformance);
  }, [cachedPerformance]);

  const {
    barData = [],
    radarData = [],
    strengthsData = [],
    weaknessesData = [],
    shortTermGoals = [],
    trainingFocus = [],
  } = processedDataResult || {};

  if (loading) {
    return <DotSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading performance data: {error.message}</p>
        <Button
          onClick={handleForceRefresh}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-xl font-semibold mb-4">
          No Chess.com Username Set
        </div>
        <p className="mb-4 text-gray-600">
          Please connect your Chess.com account to view your performance data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:border lg:rounded-md">
      <GamePhaseChart
        barData={barData}
        isCacheValid={isCacheValid}
        onRefresh={handleForceRefresh}
      />

      <div className="grid grid-cols-1 md:grid-cols-2">
        <SkillAnalysisRadar radarData={radarData} />
        <StrengthsWeaknessesSection
          strengthsData={strengthsData}
          weaknessesData={weaknessesData}
        />
      </div>

      <ImprovementRecommendations
        shortTermGoals={shortTermGoals}
        trainingFocus={trainingFocus}
      />
    </div>
  );
};

export default Performance;
