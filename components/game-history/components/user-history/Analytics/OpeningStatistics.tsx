import { OpeningStatistic } from "@/components/game-history/types/GameHistoryTypes";
import React from "react";

interface OpeningStatisticsProps {
  openingData: OpeningStatistic[];
}

const OpeningStatistics: React.FC<OpeningStatisticsProps> = ({
  openingData,
}) => {
  return (
    <div className="md:p-4 rounded-lg ">
      <h1 className="text-base font-medium mb-3">Opening Statistics</h1>
      <div className="space-y-3">
        {openingData.length > 0 ? (
          openingData.map((data, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <h1 className="font-bold">{data.name}</h1>
                <p className="text-sm text-gray-600">{data.games} games</p>
              </div>
              <h1 className="text-green-500">{data.winrate} winrate</h1>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-2">
            No opening data available
          </div>
        )}
      </div>
    </div>
  );
};

export default OpeningStatistics;
