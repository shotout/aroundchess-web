import React from "react";
import { Card } from "@/components/ui/card";

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
      <h1 className="text-base font-medium mb-3">Performance Insights</h1>
      <div className="grid grid-cols-1  sm:grid-cols-3 gap-3">
        {/* Average Game Length Card */}
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

        {/* Time Management Card */}
        {/* <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-sm font-semibold">Time Management</h1>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">
                {insights.timeManagement.toFixed(1)}%
              </h1>
            </div>
          </div>
        </Card> */}

        {/* Accuracy Card */}
        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-sm font-semibold">Accuracy</h1>
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
