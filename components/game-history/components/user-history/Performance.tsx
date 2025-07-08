import React from "react";
import { Button } from "@/components/ui/button";

import GamePhaseChart from "./GamePhaseChart";
import SkillAnalysisRadar from "./SkillAnalysisRadar";
import ImprovementRecommendations from "./ImprovementRecommendations";
import { usePerformanceData } from "../../hooks/usePerformanceData";
import StrengthsWeaknessesSection from "./StrengthAndWeakness";
import {
  BarDataItem,
  RadarDataItem,
  StrengthItem,
  WeaknessItem,
} from "../../types/GameHistoryTypes";

// Skeleton components for partial loading
const ChartSkeleton: React.FC = () => (
  <div className="lg:p-4 rounded-lg w-full">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="h-72 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const RadarSkeleton: React.FC = () => (
  <div className="lg:p-4 rounded-lg">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="h-80 bg-gray-200 rounded-full mx-auto w-80"></div>
    </div>
  </div>
);

const StrengthsWeaknessesSkeleton: React.FC = () => (
  <div className="lg:p-4 rounded-lg">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="space-y-4">
        <div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RecommendationsSkeleton: React.FC = () => (
  <div className="lg:p-4 rounded-lg w-full">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
        <div className="p-3 rounded-lg border">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Performance: React.FC = () => {
  const { loading, error, data, isCacheValid, handleForceRefresh } =
    usePerformanceData();

  const defaultBarData: BarDataItem[] = [];
  const defaultRadarData: RadarDataItem[] = [];
  const defaultStrengthsData: StrengthItem[] = [];
  const defaultWeaknessesData: WeaknessItem[] = [];
  const defaultShortTermGoals: string[] = [];
  const defaultTrainingFocus: string[] = [];

  const {
    barData = defaultBarData,
    radarData = defaultRadarData,
    strengthsData = defaultStrengthsData,
    weaknessesData = defaultWeaknessesData,
    shortTermGoals = defaultShortTermGoals,
    trainingFocus = defaultTrainingFocus,
  } = data || {};

  // Show error state
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

  // Show layout immediately, with loading skeletons where needed
  return (
    <div className="flex flex-col lg:border lg:rounded-md p-4">
      {/* Game Phase Chart */}
      {loading ? (
        <ChartSkeleton />
      ) : data ? (
        <GamePhaseChart
          barData={barData}
          isCacheValid={isCacheValid}
          onRefresh={handleForceRefresh}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-xl font-semibold mb-4">No Data Available</div>
          <p className="mb-4 text-gray-600">
            Please connect your Chess.com account to view your performance data.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Skill Analysis Radar */}
        {loading ? (
          <RadarSkeleton />
        ) : data ? (
          <SkillAnalysisRadar radarData={radarData} />
        ) : (
          <RadarSkeleton />
        )}

        {/* Strengths and Weaknesses */}
        {loading ? (
          <StrengthsWeaknessesSkeleton />
        ) : data ? (
          <StrengthsWeaknessesSection
            strengthsData={strengthsData}
            weaknessesData={weaknessesData}
          />
        ) : (
          <StrengthsWeaknessesSkeleton />
        )}
      </div>

      {/* Improvement Recommendations */}
      {loading ? (
        <RecommendationsSkeleton />
      ) : data ? (
        <ImprovementRecommendations
          shortTermGoals={shortTermGoals}
          trainingFocus={trainingFocus}
        />
      ) : (
        <RecommendationsSkeleton />
      )}
    </div>
  );
};

export default Performance;
