import React from "react";
import { Button } from "@/components/ui/button";
import { useAnalyticsData } from "../../hooks/useAnalyticsData";
import DotSpinner from "../../Spinner";
import PerformanceInsightsSection from "./Analytics/PerformanceInsights";
import RatingProgressChart from "./Analytics/RatingProgressChart";
import ResultDistributionChart from "./Analytics/ResultDistributionChart";
import OpeningStatistics from "./Analytics/OpeningStatistics";
import KeyStatisticsSection from "./Analytics/KeyStatistics";
import TimeControlPerformance from "./Analytics/TimeControlPerformance";
import RecentAchievements from "./Analytics/RecentAchievement";

const Analytics: React.FC = () => {
  const { loading, error, data, isCacheValid, handleForceRefresh } =
    useAnalyticsData();

  if (loading) {
    return <DotSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading analytics: {error.message}</p>
        <Button
          onClick={handleForceRefresh}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-xl font-semibold mb-4">
          No Chess.com Username Set
        </div>
        <p className="mb-4 text-gray-600">
          Please connect your Chess.com account to view your analytics.
        </p>
      </div>
    );
  }

  const performanceInsightsSection = (
    <PerformanceInsightsSection insights={data.performanceInsights} />
  );

  return (
    <div className="grid md:grid-cols-[60%_40%] gap-6 bg-transparent">
      <div className="md:border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <RatingProgressChart
            ratingData={data.ratingData}
            isCacheValid={isCacheValid}
            handleForceRefresh={handleForceRefresh}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ResultDistributionChart distributionData={data.distributionData} />
            <OpeningStatistics openingData={data.openingData} />
          </div>

          <div className="lg:block md:hidden">{performanceInsightsSection}</div>
        </div>
      </div>

      <div className="md:border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <div className="hidden md:block lg:hidden">
            {performanceInsightsSection}
          </div>

          <KeyStatisticsSection stats={data.keyStats} />
          <TimeControlPerformance performanceData={data.performanceData} />
          <RecentAchievements achievements={data.achievements} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
