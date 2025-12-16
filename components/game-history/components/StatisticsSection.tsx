import React from "react";
import { Card } from "@/components/ui/card";
import { Target, BarChart2, Trophy, Swords } from "lucide-react";
import Image from "next/image";
import { useGameStatistics } from "@/components/game-history/hooks/useGameStatistics";
import { useTutorial } from "@/components/TutorialProvider";

interface StatisticsSectionProps {
  username: string | null;
}

const StatCardSkeleton = () => (
  <div className="flex flex-col">
    <div className="">
      <div className="flex gap-1 items-center mb-2">
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  bgGradient: string;
  bgImage: string;
  rectangleImage?: string;
  starImage?: string;
  isLoading: boolean;
}> = ({
  title,
  value,
  subtitle,
  icon,
  bgGradient,
  bgImage,
  rectangleImage,
  starImage,
  isLoading,
}) => (
  <Card
    className={`p-3 h-[120px] lg:h-[147px] ${bgGradient} rounded-lg overflow-hidden relative flex flex-col gap-[8px]`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <h1 className="text-[14px] --sm font-light lg:text-lg">{title}</h1>
    </div>

    <div className="flex flex-col">
      {isLoading ? (
        <StatCardSkeleton />
      ) : (
        <>
          <div className="flex gap-1 items-center">
            <h1
              className={`text-lg font-bold lg:text-[28px] ${
                title === "Win Rate"
                  ? "bg-gradient-to-b from-[#029A46] to-[#42F993] inline-block text-transparent bg-clip-text"
                  : title === "Average ELO Rating"
                  ? "bg-gradient-to-b from-[#3871EC] to-[#80A8FF] inline-block text-transparent bg-clip-text"
                  : ""
              }`}
            >
              {value}
            </h1>
            {title === "Best Win (rating)" && (
              <Swords fill="white" className="h-4 w-4" />
            )}
          </div>
          <span className="text-[14px] --xs mt-1 lg:mt-4 font-light lg:text-[14px] --sm">
            {subtitle}
          </span>
        </>
      )}
    </div>

    <Image
      width={200}
      height={200}
      alt=""
      src={bgImage}
      className={`absolute ${
        title === "Win Rate" ? "-top-3 left-0" : "top-5 right-0"
      } ${title === "Total Games" ? "top-0 left-0" : ""}`}
      loading="lazy"
    />

    {rectangleImage && (
      <Image
        width={20}
        height={20}
        alt=""
        src={rectangleImage}
        className={`absolute ${
          title === "Win Rate" ? "top-10 left-[80px]" : "top-10 right-[150px]"
        } ${title === "Total Games" ? "top-10 left-[80px]" : ""}`}
        loading="lazy"
      />
    )}

    {starImage && (
      <Image
        width={30}
        height={30}
        alt=""
        src={starImage}
        className="top-10 right-[150px] absolute"
        loading="lazy"
      />
    )}
  </Card>
);

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ username }) => {
  const { statistics, isLoading } = useGameStatistics();
  const { isTutorialPlay, dataTutorial } = useTutorial();
  const formatNumber = (num: any) => {
    if (num === undefined || num === null) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const cardConfigs = [
    {
      title: "Best Win (rating)",
      value: isTutorialPlay
        ? dataTutorial.bestWinRating
        : formatNumber(statistics?.bestWin?.rating),
      subtitle: `vs ${
        isTutorialPlay
          ? dataTutorial.bestWinEnemy
          : statistics?.bestWin?.opponent || "Unknown"
      }`,
      icon: <Swords className="h-4 w-4 mr-1" fill="white" />,
      bgGradient: "bg-gradient-to-br from-[#A855F7] to-[#CF9DFF] text-white",
      bgImage: "/my-game-history/background.png",
      starImage: "/my-game-history/star.png",
    },
    {
      title: "Win Rate",
      value: `${
        isTutorialPlay
          ? dataTutorial.winRate
          : statistics?.winRate?.percentage || 0
      }%`,
      subtitle: `${
        isTutorialPlay
          ? "+"
          : (statistics?.winRate?.monthlyChange || 0) > 0
          ? "+"
          : ""
      }${
        isTutorialPlay
          ? dataTutorial.winRateThisMonth
          : statistics?.winRate?.monthlyChange || 0
      }% this month`,
      icon: <Target className="h-4 w-4 text-green-500" />,
      bgGradient: "bg-[#F6FFFA] border-[1px] border-[#029A46] text-black",
      bgImage: "/my-game-history/background-g.png",
      rectangleImage: "/my-game-history/rectangle-g.png",
    },
    {
      title: "Average ELO Rating",
      value: isTutorialPlay
        ? dataTutorial.averageEloRating
        : formatNumber(statistics?.averageEloRating?.rating),
      subtitle: `${
        isTutorialPlay
          ? "+"
          : (statistics?.averageEloRating?.monthlyChange || 0) > 0
          ? "+"
          : ""
      }${
        isTutorialPlay
          ? dataTutorial.averagePoint
          : statistics?.averageEloRating?.monthlyChange || 0
      } points compared to last month`,
      icon: <BarChart2 className="h-4 w-4 text-blue-500" />,
      bgGradient: "border-[1px] bg-[#F6F9FF] border-[#3871EC] text-black",
      bgImage: "/my-game-history/background-b.png",
      rectangleImage: "/my-game-history/rectangle-b.png",
    },
    {
      title: "Total Games",
      value:isTutorialPlay
          ? dataTutorial.totalGames
          :  formatNumber(statistics?.totalGames?.count),
      subtitle: `${
         isTutorialPlay
          ? "+"
          :isTutorialPlay
          ? dataTutorial.totalGamesThisMonth
          : (statistics?.totalGames?.monthlyChange || 0) > 0 ? "+" : ""
      }${statistics?.totalGames?.monthlyChange || 0} this month`,
      icon: <Trophy className="h-4 w-4 text-yellow-500" fill="#eab308" />,
      bgGradient: "border-[1px] border-[#DEDEDE] text-black",
      bgImage: "/my-game-history/tg-a.png",
      rectangleImage: "/my-game-history/tg-r.png",
    },
  ];

  return (
    <div className={`${isTutorialPlay ? `hidden xl:block `:`xl:block `} xl:p-3 xl:border xl:border-primary-gray xl:rounded-md bg-transparent xl:bg-white xl:shadow-card`}>
      <div className="font-semibold text-[14px] --sm py-2 lg:text-xl">
        Overall Statistics
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {cardConfigs.map((config, index) => (
          <StatCard
            key={index}
            title={config.title}
            value={config.value}
            subtitle={config.subtitle}
            icon={config.icon}
            bgGradient={config.bgGradient}
            bgImage={config.bgImage}
            rectangleImage={config.rectangleImage}
            starImage={config.starImage}
            isLoading={!isTutorialPlay && isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default StatisticsSection;
