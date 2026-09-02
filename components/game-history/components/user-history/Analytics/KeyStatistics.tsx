import React from "react";
import { Card } from "@/components/ui/card";
import {
  LucideTrophy,
  TargetIcon,
  BrainIcon,
  TrendingUp,
  Info,
} from "lucide-react";
import { MobileTooltip } from "../Analytics";
import { usePgnStore } from "@/app/store/zustandStore";

interface KeyStatisticsProps {
  stats: {
    totalGames: number;
    winRate: number;
    averageRating: number;
    longestStreak: number;
  };
}

const KeyStatisticsSection: React.FC<KeyStatisticsProps> = ({ stats }) => {
  const { analyticsData: data } = usePgnStore();

  return (
    <div className="md:p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-medium mb-3">Key Statistics</h1>

        <MobileTooltip
          content={[
            `**Total games ${'(' + stats.totalGames.toLocaleString() + ')'} =** Total number of games you have played since ${data?.sinceDate}`,
            `**Win rate ${'(' + stats.winRate.toLocaleString() + '%)'} =** Percentage of games you won out of all games played since ${data?.sinceDate}`,
            `**Average rating ${'(' + stats.averageRating.toLocaleString() + ')'} =** Your average rating across all games played since ${data?.sinceDate}`,
            `**Longest streak ${'(' + stats.longestStreak.toLocaleString() + ')'} =** The highest number of consecutive wins achieved without any losses or draws in between`,
          ]}
          side="left"
        >
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </MobileTooltip>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Total Games Card */}
        <Card className="p-3 rounded-lg md:border bg-white h-auto md:h-20 lg:h-24 flex">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <LucideTrophy
                className="h-5 w-5 md:h-6 md:w-6 text-yellow-500"
                fill="#eab308"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] --xs text-gray-500">Total Games</p>
              <h2 className="text-base font-semibold">
                {stats.totalGames.toLocaleString()}
              </h2>
              {/* <p className="text-[14px] --10px text-green-500">+45 this month</p> */}
            </div>
          </div>
        </Card>

        {/* Win Rate Card */}
        <Card className="p-3 rounded-lg md:border bg-white h-auto md:h-20 lg:h-24 flex">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <TargetIcon className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] --xs text-gray-500">Win Rate</p>
              <h2 className="text-base font-semibold">{stats.winRate}%</h2>
              {/* <p className="text-[14px] --10px text-green-500">+5%</p> */}
            </div>
          </div>
        </Card>

        {/* Average Rating Card */}
        <Card className="p-3 rounded-lg md:border bg-white h-auto md:h-20 lg:h-24 flex">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <BrainIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] --xs text-gray-500">Average Rating</p>
              <h2 className="text-base font-semibold">{stats.averageRating}</h2>
              {/* <p className="text-[14px] --10px text-green-500">+25 point this month</p> */}
            </div>
          </div>
        </Card>

        {/* Longest Streak Card */}
        <Card className="p-3 rounded-lg md:border bg-white h-auto md:h-20 lg:h-24 flex">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] --xs text-gray-500">Longest Streak</p>
              <h2 className="text-base font-semibold">
                {stats.longestStreak} wins
              </h2>
              {/* <p className="text-[14px] --10px text-purple-300">Current streak</p> */}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KeyStatisticsSection;
