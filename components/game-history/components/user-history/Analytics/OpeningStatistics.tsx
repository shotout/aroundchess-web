import { OpeningStatistic } from "@/components/game-history/types/GameHistoryTypes";
import React from "react";
import { MobileTooltip } from "../Analytics";
import { Info } from "lucide-react";

interface OpeningStatisticsProps {
  openingData: OpeningStatistic[];
}

const OpeningStatistics: React.FC<OpeningStatisticsProps> = ({
  openingData,
}) => {
  return (
    <div className="md:p-4 rounded-lg flex flex-col gap-y-4 ">
    <div className="flex items-center justify-between">
      <h1 className="text-base font-medium">Opening Statistics</h1>
        <MobileTooltip
         content={[
            "To analyze which chess openings are most frequently used and most effective. It generates statistics based on the name of the opening, including:",
            "• The number of games played using that opening.",
            "• The win rate (percentage of wins) for that opening.",
            "• The results are sorted by the most frequently used openings."
          ]}
          side="left"
          >
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </MobileTooltip>
          </div>
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
