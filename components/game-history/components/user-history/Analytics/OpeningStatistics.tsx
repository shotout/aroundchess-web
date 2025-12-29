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
            "**Opening Statistics**",
            "Shows your most frequently played chess openings ranked by usage, with win rate percentage and total games for each opening.",
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
                <p className="text-[14px] --sm text-gray-600">{data.games} games</p>
              </div>
              <h1 className="text-green-500">{data.winrate} win rate</h1>
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
