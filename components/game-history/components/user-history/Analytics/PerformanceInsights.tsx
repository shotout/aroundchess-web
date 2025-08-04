import React from "react";
import { Card } from "@/components/ui/card";
import { MobileTooltip } from "../Analytics";
import { Info } from "lucide-react";

interface PerformanceInsightsProps {
  insights: {
    averageGameLength: number;
    accuracy: number;
    timeManagement: number;
    blunderRate: number;
  };
}

const PerformanceInsightsSection: React.FC<PerformanceInsightsProps> = ({
  insights,
}) => {
  return (
    <div className="md:p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-medium mb-3">Performance Insights</h1>

        <MobileTooltip
          content={[
            "**Accuracy =**The winRate value is calculated by dividing the number of wins by the total number of games (totalGames), then multiplying by 100 to convert it into a percentage.",
            "**Blunder rate =**The lossRate value is calculated by dividing the number of losses by the total number of games (totalGames), then multiplying by 100 to convert it into a percentage.", 
          ]}
          side="left"
          >
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </MobileTooltip>
          </div>
      <div className="grid grid-cols-1  sm:grid-cols-3 gap-3">
        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-sm font-semibold">Average Game Length</h1>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">
                {insights.averageGameLength} Moves
              </h1>
            </div>
          </div>
        </Card>

        {/* Accuracy Card */}
        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-sm font-semibold">Average Accuracy</h1>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">{insights.accuracy}%</h1>
            </div>
          </div>
        </Card>

        {/* Blunder Rate Card */}
        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-sm font-semibold">Blunder Rate</h1>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">{insights.blunderRate}%</h1>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceInsightsSection;
