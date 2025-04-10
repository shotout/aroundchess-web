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

  // Loading state
  if (loading) {
    return <DotSpinner />;
  }

  // Error state
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

  // No username state
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

  // Performance Insights section to reuse
  const performanceInsightsSection = (
    <PerformanceInsightsSection insights={data.performanceInsights} />
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-transparent">
      {/* Left Column Group - with border */}
      <div className="md:border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col gap-4">
          <RatingProgressChart
            ratingData={data.ratingData}
            isCacheValid={isCacheValid}
            handleForceRefresh={handleForceRefresh}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:bg-white">
            <ResultDistributionChart distributionData={data.distributionData} />
            <OpeningStatistics openingData={data.openingData} />
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

          <KeyStatisticsSection stats={data.keyStats} />
          <TimeControlPerformance performanceData={data.performanceData} />
          <RecentAchievements achievements={data.achievements} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
