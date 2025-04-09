import React, { useState, useEffect, useMemo } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  RatingProgressChart,
  ResultDistributionChart,
  OpeningStatistics,
  PerformanceInsightsSection,
  KeyStatisticsSection,
  TimeControlPerformance,
  RecentAchievements,
  NoUsername,
  LoadingError,
} from "./utils/Components";
import {
  RatingProgressItem,
  ResultDistributionItem,
  OpeningStatistic,
  TimeControlPerformance as TimeControlPerformanceType,
  PerformanceInsights,
  KeyStatistics,
  PgnStore,
  ProcessedData,
} from "./types/AnalyticsTypes";
import { isCacheValid, processApiData } from "./utils/AnalyticsHelper";
import { fetchAnalyticsData } from "./utils/API";
import DotSpinner from "../Spinner";

const Analytics: React.FC = () => {
  const {
    username,
    analyticsData: cachedAnalytics,
    analyticsLastFetched,
    setAnalyticsData,
  } = usePgnStore() as PgnStore;

  const { sessionId, isLoaded: authIsLoaded } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [ratingData, setRatingData] = useState<RatingProgressItem[]>([]);
  const [distributionData, setDistributionData] = useState<
    ResultDistributionItem[]
  >([]);
  const [openingData, setOpeningData] = useState<OpeningStatistic[]>([]);
  const [performanceData, setPerformanceData] = useState<
    TimeControlPerformanceType[]
  >([]);
  const [performanceInsights, setPerformanceInsights] =
    useState<PerformanceInsights>({
      averageGameLength: 0,
      accuracy: 0,
      timeManagement: 0,
      blunderRate: 0,
    });
  const [keyStats, setKeyStats] = useState<KeyStatistics>({
    totalGames: 0,
    winRate: 0,
    averageRating: 0,
    longestStreak: 0,
  });
  const [achievements, setAchievements] = useState<string[]>([]);

  const fetchRef = React.useRef<boolean>(false);

  const cacheIsValid = useMemo(
    () => isCacheValid(analyticsLastFetched, cachedAnalytics),
    [analyticsLastFetched, cachedAnalytics]
  );

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!username || fetchRef.current) {
        if (authIsLoaded && !username) {
          setLoading(false);
        }
        return;
      }

      // If cache is valid, use the cached data without making an API call
      if (cacheIsValid && cachedAnalytics) {
        try {
          // Process the cached data instead of fetching new data
          const processedData = processApiData(cachedAnalytics);
          updateStateWithProcessedData(processedData);
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

      // If cache is not valid, fetch new data
      fetchRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const processedData = await fetchAnalyticsData(
          username,
          sessionId || null,
          setAnalyticsData
        );
        updateStateWithProcessedData(processedData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
        setTimeout(() => {
          fetchRef.current = false;
        }, 3000);
      }
    };

    if (authIsLoaded) {
      fetchData();
    }
  }, [
    username,
    authIsLoaded,
    sessionId,
    cacheIsValid,
    cachedAnalytics,
    setAnalyticsData,
  ]);

  const updateStateWithProcessedData = (data: ProcessedData): void => {
    setRatingData(data.ratingData);
    setDistributionData(data.distributionData);
    setOpeningData(data.openingData);
    setPerformanceData(data.performanceData);
    setPerformanceInsights(data.performanceInsights);
    setKeyStats(data.keyStats);
    setAchievements(data.achievements);
  };

  const handleForceRefresh = (): void => {
    fetchRef.current = false;
    toast.info("Refreshing analytics data...");
  };

  if (loading) {
    return <DotSpinner />;
  }

  if (error) {
    return (
      <LoadingError error={error} handleForceRefresh={handleForceRefresh} />
    );
  }

  if (!username) {
    return <NoUsername />;
  }

  // Performance Insights section to reuse
  const performanceInsightsSection = (
    <PerformanceInsightsSection insights={performanceInsights} />
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-transparent">
      {/* Left Column Group - with border */}
      <div className="md:border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <RatingProgressChart
            ratingData={ratingData}
            isCacheValid={cacheIsValid}
            handleForceRefresh={handleForceRefresh}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:bg-white">
            <ResultDistributionChart distributionData={distributionData} />
            <OpeningStatistics openingData={openingData} />
          </div>

          {/* Show Performance Insights at the bottom left on desktop (lg and above) */}
          <div className="lg:block md:hidden">{performanceInsightsSection}</div>
        </div>
      </div>

      {/* Right Column Group - with border */}
      <div className="md:border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          {/* Show Performance Insights at the top right on tablet (md) */}
          <div className="hidden md:block lg:hidden">
            {performanceInsightsSection}
          </div>

          <KeyStatisticsSection stats={keyStats} />
          <TimeControlPerformance performanceData={performanceData} />
          <RecentAchievements achievements={achievements} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
