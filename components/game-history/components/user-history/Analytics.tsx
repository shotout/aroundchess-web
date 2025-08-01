import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAnalyticsData } from "../../hooks/useAnalyticsData";
import PerformanceInsightsSection from "./Analytics/PerformanceInsights";
import RatingProgressChart from "./Analytics/RatingProgressChart";
import ResultDistributionChart from "./Analytics/ResultDistributionChart";
import OpeningStatistics from "./Analytics/OpeningStatistics";
import KeyStatisticsSection from "./Analytics/KeyStatistics";
import TimeControlPerformance from "./Analytics/TimeControlPerformance";
import RecentAchievements from "./Analytics/RecentAchievement";

const MobileTooltip = ({
  children,
  content,
  side = "left",
  mobileSide ="left"
}: {
  children: React.ReactNode;
  content: string | string[];
  side?: "left" | "right" | "top" | "bottom";
  mobileSide? : "left" | "right" | "top" | "bottom";
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

useEffect(() => {
    if (isMobile && isVisible) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest("[data-mobile-tooltip]")) {
          setIsVisible(false);
        }
      };

      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isMobile, isVisible]);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsVisible(!isVisible);
    }
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const contentArray = Array.isArray(content) 
    ? content.slice(0, 20) 
    : [content];

  if (isMobile) {
    return (
      <div className="relative inline-block" data-mobile-tooltip>
        <button
          onClick={handleClick}
          className="p-1 -m-1 touch-manipulation"
          type="button"
        >
          {children}
        </button>
        {isVisible && (
          <div
            className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-b-sm rounded-tl-sm  w-72 max-w-[90vw] ${
              mobileSide === "left"
                ? "right-2 top-5"
                : mobileSide === "right"
                ? "left-0 top-8"
                : mobileSide === "top"
                ? "bottom-8 left-1/2 transform -translate-x-1/2"
                : "top-8 left-1/2 transform -translate-x-1/2"
            }`}
          >
            <div className="r leading-relaxed">
              {contentArray.map((item, index) => (
                <div 
                  key={index} 
                  className={index > 0 ? "mt-2" : ""}
                >
                  {parseBoldText(item)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Tooltip >
      <TooltipTrigger asChild>
        <button className="p-1 -m-1 touch-manipulation" type="button">
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-md text-xs xl:text-sm">
        {contentArray.map((item, index) => (
          <p key={index} className={index > 0 ? "mt-1 " : ""}>
            {parseBoldText(item)}
          </p>
        ))}
      </TooltipContent>
    </Tooltip>
  );
};

const ChartSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const CardSkeleton: React.FC = () => (
  <div className="animate-pulse p-4 border rounded-lg">
    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const { loading, error, data, isCacheValid, handleForceRefresh } =
    useAnalyticsData();

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

  return (
    <TooltipProvider>
      <div className="grid md:grid-cols-[60%_39%] gap-4 bg-transparent">
        <div className="md:border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col gap-4">
            {loading ? (
              <ChartSkeleton />
            ) : data ? (
              <RatingProgressChart
                ratingData={data.ratingData}
                isCacheValid={isCacheValid}
                handleForceRefresh={handleForceRefresh}
              />
            ) : (
              <div className="text-center p-8">
                <div className="text-xl font-semibold mb-4">
                  No Chess.com Username Set
                </div>
                <p className="mb-4 text-gray-600">
                  Please connect your Chess.com account to view your analytics.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loading ? (
                <ChartSkeleton />
              ) : data ? (
                <ResultDistributionChart
                  distributionData={data.distributionData}
                />
              ) : (
                <CardSkeleton />
              )}

              {loading ? (
                <CardSkeleton />
              ) : data ? (
                <OpeningStatistics openingData={data.openingData} />
              ) : (
                <CardSkeleton />
              )}
            </div>

            <div className="lg:block md:hidden">
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : data ? (
                <PerformanceInsightsSection insights={data.performanceInsights} />
              ) : (
                <CardSkeleton />
              )}
            </div>
          </div>
        </div>

        <div className="md:border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col gap-4">
            <div className="hidden md:block lg:hidden">
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : data ? (
                <PerformanceInsightsSection insights={data.performanceInsights} />
              ) : (
                <CardSkeleton />
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : data ? (
              <KeyStatisticsSection stats={data.keyStats} />
            ) : (
              <CardSkeleton />
            )}

            {loading ? (
              <CardSkeleton />
            ) : data ? (
              <TimeControlPerformance performanceData={data.performanceData} />
            ) : (
              <CardSkeleton />
            )}

            {loading ? (
              <div className="space-y-3">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : data ? (
              <RecentAchievements achievements={data.achievements} />
            ) : (
              <CardSkeleton />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export { MobileTooltip };
export default Analytics;