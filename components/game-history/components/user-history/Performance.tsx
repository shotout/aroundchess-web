import React from "react";
import { Button } from "@/components/ui/button";

import GamePhaseChart from "./GamePhaseChart";
import SkillAnalysisRadar from "./SkillAnalysisRadar";
import ImprovementRecommendations from "./ImprovementRecommendations";
import { usePerformanceData } from "../../hooks/usePerformanceData";
import DotSpinner from "../../Spinner";
import StrengthsWeaknessesSection from "./StrengthAndWeakness";

const Performance: React.FC = () => {
  // Use custom hook to get performance data
  const { loading, error, data, isCacheValid, handleForceRefresh } =
    usePerformanceData();

  // Default empty data for each component
  const defaultBarData: never[] = [];
  const defaultRadarData: never[] = [];
  const defaultStrengthsData: never[] = [];
  const defaultWeaknessesData: never[] = [];
  const defaultShortTermGoals: never[] = [];
  const defaultTrainingFocus: never[] = [];

  // Extract data from processed performance data
  const {
    barData = defaultBarData,
    radarData = defaultRadarData,
    strengthsData = defaultStrengthsData,
    weaknessesData = defaultWeaknessesData,
    shortTermGoals = defaultShortTermGoals,
    trainingFocus = defaultTrainingFocus,
  } = data || {};

  // Handle loading state
  if (loading) {
    return <DotSpinner />;
  }

  // Handle error state
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

  // Handle no username state (this should be handled at a higher level)
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-xl font-semibold mb-4">No Data Available</div>
        <p className="mb-4 text-gray-600">
          Please connect your Chess.com account to view your performance data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:border lg:rounded-md">
      {/* Game Phase Chart */}
      <GamePhaseChart
        barData={barData}
        isCacheValid={isCacheValid}
        onRefresh={handleForceRefresh}
      />

      {/* Skills Analysis and Strengths/Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <SkillAnalysisRadar radarData={radarData} />
        <StrengthsWeaknessesSection
          strengthsData={strengthsData}
          weaknessesData={weaknessesData}
        />
      </div>

      {/* Improvement Recommendations */}
      <ImprovementRecommendations
        shortTermGoals={shortTermGoals}
        trainingFocus={trainingFocus}
      />
    </div>
  );
};

export default Performance;
