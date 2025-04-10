import React from "react";
import { Card } from "@/components/ui/card";
import { Target, BarChart2, Trophy, Swords } from "lucide-react";
import Image from "next/image";
import { useGameStatistics } from "@/components/game-history/hooks/useGameStatistics";
import DotSpinner from "../Spinner";

interface StatisticsSectionProps {
  username: string | null;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ username }) => {
  const { statistics, isLoading } = useGameStatistics();

  // Function to format numbers with commas
  const formatNumber = (num: any) => {
    if (num === undefined || num === null) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (isLoading) {
    return (
      <div className="xl:block xl:p-3 xl:border xl:border-primary-gray xl:rounded-md bg-transparent xl:bg-white xl:shadow-card">
        <div className="font-semibold text-sm py-2 lg:text-xl mb-4">
          Overall Statistics
        </div>
        <div className="flex items-center justify-center h-[120px]">
          <DotSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="xl:block xl:p-3 xl:border xl:border-primary-gray xl:rounded-md bg-transparent xl:bg-white xl:shadow-card">
      <div className="font-semibold text-sm py-2 lg:text-xl">
        Overall Statistics
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Best Win Card */}
        <Card className="p-3 h-[120px] lg:h-[147px] bg-gradient-to-br from-[#A855F7] to-[#CF9DFF] text-white rounded-lg overflow-hidden relative flex flex-col justify-between">
          <div className="flex items-center ">
            <Swords className="h-4 w-4 mr-1" fill="white" />
            <h1 className="text-sm lg:text-lg">Best Win (rating)</h1>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold lg:text-[28px]">
                {formatNumber(statistics?.bestWin?.rating)}
              </h1>
              <Swords fill="white" className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
              vs {statistics?.bestWin?.opponent || "Unknown"}
            </span>
          </div>

          <Image
            width={200}
            height={200}
            alt=""
            src={"/my-game-history/background.png"}
            className="top-5 right-0 absolute"
          />
          <Image
            width={30}
            height={30}
            alt=""
            src={"/my-game-history/star.png"}
            className="top-10 right-[150px] absolute"
          />
        </Card>

        {/* Win Rate Card */}
        <Card className="p-3 h-[120px] lg:h-[147px] bg-[#F6FFFA] border-[1px] border-[#029A46] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-green-500" />
            <h1 className="text-sm font-light lg:text-lg">Win Rate</h1>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold lg:text-[28px] bg-gradient-to-b from-[#029A46] to-[#42F993] inline-block text-transparent bg-clip-text">
                {statistics?.winRate?.percentage || 0}%
              </h1>
            </div>
            <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
              {(statistics?.winRate?.monthlyChange || 0) > 0 ? "+" : ""}
              {statistics?.winRate?.monthlyChange || 0}% this month
            </span>
          </div>
          <Image
            width={200}
            height={200}
            alt=""
            src={"/my-game-history/background-g.png"}
            className="-top-3 left-0 absolute text-black"
          />
          <Image
            width={20}
            height={20}
            alt=""
            src={"/my-game-history/rectangle-g.png"}
            className="top-10 left-[80px] absolute"
          />
        </Card>

        {/* Average ELO Rating Card */}
        <Card className="p-3 h-[120px] lg:h-[147px] border-[1px] bg-[#F6F9FF] border-[#3871EC] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-500" />
            <h1 className="text-sm font-light lg:text-lg">
              Average ELO Rating
            </h1>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold lg:text-[28px] bg-gradient-to-b from-[#3871EC] to-[#80A8FF] inline-block text-transparent bg-clip-text">
                {formatNumber(statistics?.averageEloRating?.rating)}
              </h1>
            </div>
            <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
              {(statistics?.averageEloRating?.monthlyChange || 0) > 0
                ? "+"
                : ""}
              {statistics?.averageEloRating?.monthlyChange || 0} points this
              month
            </span>
          </div>

          <Image
            width={200}
            height={200}
            alt=""
            src={"/my-game-history/background-b.png"}
            className="top-5 right-0 absolute text-black"
          />
          <Image
            width={20}
            height={20}
            alt=""
            src={"/my-game-history/rectangle-b.png"}
            className="top-10 right-[150px] absolute"
          />
        </Card>

        {/* Total Games Card */}
        <Card className="p-3 h-[120px] lg:h-[147px] border-[1px] border-[#DEDEDE] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" fill="#eab308" />
            <h1 className="text-sm font-light">Total Games</h1>
          </div>

          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold lg:text-[28px]">
                {formatNumber(statistics?.totalGames?.count)}
              </h1>
            </div>
            <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
              {(statistics?.totalGames?.monthlyChange || 0) > 0 ? "+" : ""}
              {statistics?.totalGames?.monthlyChange || 0} this month
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsSection;
