import React from "react";
import { TimeControlPerformance as TimeControlPerformanceType } from "@/components/game-history/types/GameHistoryTypes";

interface TimeControlPerformanceProps {
  performanceData: TimeControlPerformanceType[];
}

const TimeControlPerformance: React.FC<TimeControlPerformanceProps> = ({
  performanceData,
}) => {
  return (
    <div className="md:p-4 rounded-lg">
      <h1 className="text-base font-medium mb-3">Time Control Performance</h1>
      {performanceData.length > 0 ? (
        <div className="space-y-4">
          {performanceData.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {item.category}
                </span>
                <span className="text-gray-600 text-sm">
                  {item.games} games
                </span>
              </div>

              <div className="relative h-2 w-full">
                <div className="absolute h-2 w-full bg-gray-200 rounded-full"></div>
                <div
                  className="absolute h-2 bg-blue-base rounded-full"
                  style={{ width: `${item.winRate}%` }}
                ></div>
              </div>

              <div className="w-full flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Win Rate
                </span>
                <span
                  className={`ml-2 text-sm font-medium ${
                    item.winRate >= 60
                      ? "text-green-500"
                      : item.winRate >= 50
                      ? "text-blue-500"
                      : "text-red-500"
                  }`}
                >
                  {item.winRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          No time control data available
        </div>
      )}
    </div>
  );
};

export default TimeControlPerformance;
