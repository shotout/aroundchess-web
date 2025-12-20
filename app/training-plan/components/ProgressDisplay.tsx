import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Bar,
  BarChart,
  Cell,
} from "recharts";
import {
  Clock,
  LucideTrophy,
  Star,
  Target,
  TargetIcon,
  TriangleAlert,
  TriangleAlertIcon,
  Trophy,
  Info,
} from "lucide-react";
import { useProgressStore } from "../store";
import Image from "next/image";
import { useProfileStore } from "@/app/store/profile";

const MobileTooltip = ({
  children,
  content,
  side = "left",
}: {
  children: React.ReactNode;
  content: string;
  side?: "left" | "right" | "top" | "bottom";
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && isVisible) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest("[data-mobile-tooltip]")) {
          setIsVisible(false);
        }
      };

      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isMobile, isVisible]);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsVisible(!isVisible);
    }
  };

  if (isMobile) {
    return (
      <div className="relative inline-block" data-mobile-tooltip>
        <button
          onClick={handleClick}
          className="p-1 -m-1 touch-manipulation"
          type="button"
        >
          {children}
        </button>
        {isVisible && (
          <div
            className={`absolute z-50 px-3 py-2 text-[14px] --sm text-black bg-white rounded-lg shadow-lg w-72 max-w-[90vw] ${
              side === "left"
                ? "right-0 top-8"
                : side === "right"
                ? "left-0 top-8"
                : side === "top"
                ? "bottom-8 left-1/2 transform -translate-x-1/2"
                : "top-8 left-1/2 transform -translate-x-1/2"
            }`}
          >
            <div className="text-center leading-relaxed">{content}</div>
            <div
              className={`absolute border-4 border-transparent ${
                side === "left"
                  ? "bottom-full right-4 border-b-gray-800"
                  : side === "right"
                  ? "bottom-full left-4 border-b-gray-800"
                  : side === "top"
                  ? "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800"
                  : "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800"
              }`}
            ></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="p-1 -m-1 touch-manipulation" type="button">
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const OverallImprovementSkeleton = () => (
  <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <CardContent className="p-4 flex flex-col gap-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-200 rounded-lg h-[150px] p-6 relative">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-8 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg h-[150px] p-6 relative">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-28"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ChartSkeleton = ({ title }: { title: string }) => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
      {title === "Your Progress" && (
        <div className="w-40 h-8 bg-gray-200 rounded"></div>
      )}
    </div>
    <div className="h-[400px] bg-gray-200 rounded"></div>
  </div>
);

const RecentGamesSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="h-[200px] bg-gray-200 rounded mb-3"></div>
    <div className="flex items-center justify-between gap-x-2 text-[14px] --sm">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const PerformanceTrendsSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-center gap-x-2 mb-2">
      <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-4 h-32">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const CustomTooltipContent = ({
  active,
  payload,
}: {
  active: boolean;
  payload: any[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded-md shadow-md">
        <p className="font-semibold text-[14px] --sm">{data.week}</p>
        <p className="text-[14px] --sm">Rating: {data.rating}</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltipContent = ({
  active,
  payload,
}: {
  active: boolean;
  payload: any[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 border rounded-md shadow-md bg-white">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 border"
            style={{ backgroundColor: data.fill }}
          />
          <div className="flex flex-col">
            <p className="text-[14px] --sm text-black">{data.category}:</p>
            <p className="text-[14px] --sm " style={{ color: data.fill }}>
              {data.minutes} Minutes
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomCursor = (props: {
  payload: any;
  x: any;
  y: any;
  width: any;
  height: any;
}) => {
  const { payload, x, y, width, height } = props;
  const fillColor =
    payload && payload.length > 0
      ? payload[0].payload.fill + "29"
      : "#2780F829";

  return <rect x={x} y={y} width={width} height={height} fill={fillColor} />;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ProgressDisplay = () => {
  const { sessionId } = useProfileStore();
  const currentDate = new Date();

  const getCurrentYearMonth = (monthName: string) => {
    const monthIndex = MONTHS.indexOf(monthName);
    const year = currentDate.getFullYear();
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  };

  const getDisplayMonthFromYearMonth = (yearMonth: string) => {
    const parts = yearMonth.split("-");
    if (parts.length === 2) {
      const monthIndex = parseInt(parts[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return MONTHS[monthIndex];
      }
    }
    return MONTHS[currentDate.getMonth()];
  };

  const {
    progressData: apiData,
    isLoadingProgress,
    progressError,
    currentMonth,
    setCurrentMonth,
    fetchProgressData,
  } = useProgressStore();

  const [displayMonth, setDisplayMonth] = useState(
    getDisplayMonthFromYearMonth(currentMonth)
  );

  useEffect(() => {
    if (sessionId) {
      fetchProgressData(sessionId, currentMonth);
    }
  }, [sessionId, currentMonth, fetchProgressData]);

  const handleMonthChange = (month: string) => {
    setDisplayMonth(month);
    const yearMonth = getCurrentYearMonth(month);
    setCurrentMonth(yearMonth);

    if (sessionId) {
      fetchProgressData(sessionId, yearMonth);
    }
  };

  const trainingData = apiData
    ? [
        {
          category: "Openings",
          minutes: apiData.trainingDistribution.openings,
          fill: "#90b1ff",
        },
        {
          category: "Middlegame",
          minutes: apiData.trainingDistribution.middlegame,
          fill: "#f3d48c",
        },
        {
          category: "Endgame",
          minutes: apiData.trainingDistribution.endgame,
          fill: "#8eeda6",
        },
        {
          category: "Tactics",
          minutes: apiData.trainingDistribution.tactics,
          fill: "#ff9a9a",
        },
      ]
    : [];

  const stats = apiData
    ? [
        {
          title: "Games Won",
          value: apiData.performanceTrends.gamesWon.count?.toString() || "0",
          change: apiData.performanceTrends.gamesWon.change,
          icon: "trophy",
        },
        {
          title: "ELO Rating",
          value: apiData.performanceTrends.eloRating.rating?.toString() || "0",
          change: apiData.performanceTrends.eloRating.change,
          icon: "target",
        },
        {
          title: "Mistakes",
          value: apiData.performanceTrends.mistakes.count?.toString() || "0",
          change: apiData.performanceTrends.mistakes.change,
          icon: "alert-yellow",
        },
        {
          title: "Blunders",
          value: apiData.performanceTrends.blunders.count?.toString() || "0",
          change: apiData.performanceTrends.blunders.change,
          icon: "alert-red",
        },
      ]
    : [];

  const getFormattedRatingData = () => {
    if (apiData?.ratingProgress?.data) {
      return apiData.ratingProgress.data.map((item) => ({
        week: `Week ${item.week}`,
        rating: item.rating,
      }));
    }
    return [];
  };

const chartRange = React.useMemo(() => {
  const formattedData = getFormattedRatingData();
  
  if (formattedData.length === 0) {
    const defaultValues = [800, 1000];
    const rawMin = Math.min(...defaultValues);
    const rawMax = Math.max(...defaultValues);
    const adjustedMin = Math.floor(rawMin - 200);
    const adjustedMax = Math.ceil(rawMax + 200);
    
    return {
      min: adjustedMin,
      max: adjustedMax
    };
  }

  const data = formattedData.map(item => item.rating).filter(r => r > 0);
  
  if (data.length === 0) {
    const defaultValues = [800, 1000];
    const rawMin = Math.min(...defaultValues);
    const rawMax = Math.max(...defaultValues);
    const adjustedMin = Math.floor(rawMin - 200);
    const adjustedMax = Math.ceil(rawMax + 200);
    
    return {
      min: adjustedMin,
      max: adjustedMax
    };
  }

  const rawMin = Math.min(...data);
  const rawMax = Math.max(...data);
  const adjustedMin = Math.floor(rawMin - 200);
  const adjustedMax = Math.ceil(rawMax + 200);
  
  return {
    min: adjustedMin,
    max: adjustedMax
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [apiData?.ratingProgress?.data]);

  const formattedRecentGames = apiData?.recentGames
    ? apiData.recentGames.map((game) => ({
        date: game.date,
        opponent: game.opponent,
        rating: game.rating,
        result: game.result,
        opening: game.opening,
        accuracy: game.analysis.accuracy,
        brilliant: game.analysis.score,
        mistakes: "N/A",
      }))
    : [];

  return (
    <TooltipProvider>
      <div className="space-y-4 p-4 xl:p-0">
        {/* Overall Improvement Section */}
        {isLoadingProgress ? (
          <OverallImprovementSkeleton />
        ) : (
          <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <CardContent className="p-4 flex flex-col gap-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Overall Improvement</h2>
                <MobileTooltip
                  content="Track your chess improvement over time. This section shows your current skill level, rating, and accuracy improvements to help you understand your progress."
                  side="left"
                >
                  <Info
                    className="w-5 h-5 text-blue-base hover:text-blue-600 cursor-pointer transition-colors"
                    strokeWidth={1.5}
                  />
                </MobileTooltip>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-[#CF9DFF] to-[#CF9DFF]/80 flex items-start gap-y-2 justify-center flex-col rounded-lg max-h-[150px] text-white p-3 lg:p-6 relative overflow-hidden">
                  <h1 className="text-lg font-medium">my current level</h1>
                  <div className="bg-white/20 border-r-2 border-l-2 rounded-md p-2">
                    <h1 className="text-base lg:text-xl font-semibold">
                      {apiData?.currentLevel?.level || "Loading..."}
                    </h1>
                    <div className="flex items-center gap-x-2">
                      <h1 className="text-xl lg:text-4xl font-bold">
                        {apiData?.currentLevel?.rating?.toLocaleString() || "0"}
                      </h1>
                      <div className="flex items-center gap-x-2">
                        <h1 className="text-[14px] --sm lg:text-base">elo rating</h1>
                        <Star className="w-4 h-4 text-white" fill="#ffffff" />
                      </div>
                    </div>
                  </div>
                  <Image
                    alt=""
                    className="absolute top-2 right-2 w-[200px] md:top-0 md:right-0 md:w-[300px]"
                    width={300}
                    height={300}
                    src="/my-game-history/rook-a.png"
                  />
                </div>

                <div className="bg-[#FAC933]/5 border border-[#FAC933] flex items-start gap-y-1 lg:gap-y-2 justify-center flex-col rounded-lg p-3 lg:p-6 max-h-[150px] text-black relative overflow-hidden">
                  <div className="flex items-center gap-x-1 lg:gap-x-2">
                    <TargetIcon className="w-5 h-5 text-[#FAC933]" />
                    <h1 className="text-[14px] --sm lg:text-lg font-medium text-black">
                      Average Accuracy
                    </h1>
                  </div>

                  <h1 className="text-xl lg:text-4xl font-bold text-[#FAC933]">
                    {apiData?.accuracy?.percentage || 0}%
                  </h1>
                  <div className="text-[14px] --sm lg:text-base font-medium">
                    {(apiData?.accuracy?.improvement || 0) > 0 ? '+' : ''}{apiData?.accuracy?.improvement || 0}% improvement
                  </div>
                  <Image
                    alt=""
                    className="absolute top-2 right-0 w-[150px] md:top-0 md:w-[300px]"
                    width={300}
                    height={300}
                    src="/my-game-history/knight-a.png"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="md:grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 flex flex-col gap-6 border rounded-md p-4">
            {/* Rating Progress Chart */}
            {isLoadingProgress ? (
              <ChartSkeleton title="Your Progress" />
            ) : (
              <div className="border-none rounded-lg overflow-hidden">
                {/* Mobile Layout */}
                <div className="block lg:hidden mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold">Your Progress</h3>
                      <p className="text-base">Your ELO Rating Progress</p>
                    </div>
                    <MobileTooltip
                      content="This chart shows your ELO rating progression throughout the selected month. Track how your rating changes week by week to see your improvement patterns."
                      side="left"
                    >
                      <Info
                        className="w-4 h-4 text-blue-base hover:text-blue-600 cursor-pointer transition-colors"
                        strokeWidth={1.5}
                      />
                    </MobileTooltip>
                  </div>
                  <Select value={displayMonth} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Your Progress</h3>
                    <p className="text-base">Your ELO Rating Progress</p>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <MobileTooltip
                      content="This chart shows your ELO rating progression throughout the selected month. Track how your rating changes week by week to see your improvement patterns."
                      side="left"
                    >
                      <Info
                        className="w-4 h-4 text-blue-base hover:text-blue-600 cursor-pointer transition-colors"
                        strokeWidth={1.5}
                      />
                    </MobileTooltip>
                    <Select
                      value={displayMonth}
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {getFormattedRatingData().length === 0 ? (
                  <div className="h-[400px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                    <Image
                      src="/training-plan/no-data.png"
                      alt="No games found"
                      className="mb-2"
                      width={96}
                      height={96}
                    />
                    <p className="text-lg text-gray-600 font-medium">
                      No data available
                    </p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <ResponsiveContainer
                      width="100%"
                      height={400}
                      minWidth={300}
                    >
                      <LineChart
                        data={getFormattedRatingData()}
                        margin={{ left: 0, right: 8 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e0e0e0"
                          vertical={true}
                          horizontal={true}
                        />
                        <XAxis
                          dataKey="week"
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#000", fontSize: 12 }}
                          padding={{ left: 10, right: 10 }}
                          tickMargin={5}
                        />
                        <YAxis
                          domain={[chartRange.min, chartRange.max]}
                          tickFormatter={(value) => `${value}`}
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#000", fontSize: 12 }}
                          width={40}
                        />
                        <RechartsTooltip
                          content={
                            <CustomTooltipContent active={false} payload={[]} />
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{
                            stroke: "#3b82f6",
                            strokeWidth: 2,
                            fill: "#3b82f6",
                            r: 5,
                          }}
                          activeDot={{ r: 7, fill: "#3b82f6" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* Training Distribution Chart */}
            {isLoadingProgress ? (
              <ChartSkeleton title="Weekly Training Distribution" />
            ) : (
              <div className="overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h3 className="text-xl font-bold">
                      Weekly Training Distribution
                    </h3>
                    <p className="text-base">Minutes to invest per Topic</p>
                  </div>
                  <MobileTooltip
                    content="See how your training time is distributed across different chess areas: Openings, Middlegame, Endgame, and Tactics. This helps you understand where you're focusing your study efforts."
                    side="left"
                  >
                    <Info
                      className="w-4 h-4 text-blue-base hover:text-blue-600 cursor-pointer transition-colors"
                      strokeWidth={1.5}
                    />
                  </MobileTooltip>
                </div>
                {trainingData.length === 0 ? (
                  <div className="h-[400px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                    <Image
                      src="/training-plan/no-data.png"
                      alt="No games found"
                      className="mb-2"
                      width={96}
                      height={96}
                    />
                    <p className="text-lg text-gray-600 font-medium">
                      No data available
                    </p>
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <ResponsiveContainer
                      width="100%"
                      height={400}
                      minWidth={300}
                    >
                      <BarChart
                        data={trainingData}
                        barSize={60}
                        margin={{ left: 0, right: 8 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e0e0e0"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="category"
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#000", fontSize: 12 }}
                          padding={{ left: 20, right: 20 }}
                          tickMargin={5}
                        />
                        <YAxis
                          axisLine={true}
                          tickLine={true}
                          tick={{ fill: "#000", fontSize: 12 }}
                          width={40}
                        />
                        <RechartsTooltip
                          content={
                            <CustomBarTooltipContent
                              active={false}
                              payload={[]}
                            />
                          }
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-expect-error
                          cursor={<CustomCursor />}
                        />
                        <Bar dataKey="minutes" radius={[0, 0, 0, 0]}>
                          {trainingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col rounded-md md:border md:p-4 gap-6 mt-6 md:mt-0">
            {/* Recent Games */}
            {isLoadingProgress ? (
              <RecentGamesSkeleton />
            ) : (
              <div className="rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-lg font-bold">
                    Recent Games{" "}
                    <span className="text-[14px] --sm font-normal text-gray-500">
                      {formattedRecentGames.length > 0
                        ? `(Last ${formattedRecentGames.length} games)`
                        : ""}
                    </span>
                  </h1>
                  <MobileTooltip
                    content="Your most recent chess games with detailed analysis including accuracy, moves quality, and performance metrics. Review these to identify improvement areas."
                    side="left"
                  >
                    <Info
                      className="w-4 h-4 text-blue-base hover:text-blue-600 cursor-pointer transition-colors"
                      strokeWidth={1.5}
                    />
                  </MobileTooltip>
                </div>

                {formattedRecentGames.length === 0 ? (
                  <div className="h-[200px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                    <Image
                      src="/training-plan/no-data.png"
                      alt="No games found"
                      className="mb-2"
                      width={96}
                      height={96}
                    />
                    <p className="text-base text-gray-600 font-medium">
                      You have not played any Games yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-sm border overflow-x-auto md:overflow-visible">
                      <table className="w-full border-collapse text-[14px] --">
                        <thead>
                          <tr className="bg-blue-50 font-medium">
                            <th className="p-1 text-left">Date</th>
                            <th className="p-1 text-left">Opponent</th>
                            <th className="p-1 text-left">Result</th>
                            <th className="p-1 text-left">Opening</th>
                            <th className="p-1 text-left">Analysis</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formattedRecentGames.map((game, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100"
                            >
                              <td className="p-1 whitespace-nowrap">
                                {game.date}
                              </td>
                              <td className="p-1">
                                <div className="font-medium text-[14px] -- truncate max-w-[8rem]">
                                  {game.opponent}
                                </div>
                                <div className="text-gray-500 text-[14px] --10px">
                                  Rating: {game.rating}
                                </div>
                              </td>
                              <td className="p-1">
                                <span
                                  className={`font-medium ${
                                    game.result === "WIN"
                                      ? "text-green-500"
                                      : game.result === "LOSS"
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                  }`}
                                >
                                  {game.result}
                                </span>
                              </td>
                              <td className="p-1">{game.opening}</td>
                              <td className="p-1">
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center text-[11px]">
                                    <Target className="w-4 h-4 text-blue-base mr-1" />
                                    {game.accuracy}%
                                  </div>
                                  <div className="flex items-center text-[11px]">
                                    <TriangleAlert className="w-4 h-4 text-yellow-500 mr-1" />
                                    {game.brilliant}
                                  </div>
                                  <div className="flex items-center text-[11px]">
                                    <Clock className="w-4 h-4 text-blue-base mr-1" />
                                    {game.mistakes}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between mt-3 gap-x-2 text-[14px] --sm text-nowrap text-[11px] sm:text-[14px] --sm">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-[#00B427] rounded-sm mr-1" />
                        <h1 className="mr-1 text-[14px] --xs lg:text-base">Win Rate:</h1>
                        <span className="text-[#00B427] font-bold">
                          {apiData?.winRate || 0}%
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Target
                          fill="#F1F5F9"
                          className="w-4 h-4 rounded-full text-blue-base flex items-center justify-center mr-1"
                        />
                        <h1 className="mr-1 text-[14px] --xs lg:text-base">
                          Avg Accuracy:
                        </h1>
                        <span className="text-blue-base font-bold">
                          {apiData?.avgAccuracy || 0}%
                        </span>
                      </div>

                      <div className="w-0 h-0 overflow-hidden sm:w-auto sm:h-auto sm:invisible">
                        <span>Total Games: {formattedRecentGames.length}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Performance Trends */}
            {isLoadingProgress ? (
              <PerformanceTrendsSkeleton />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-x-2">
                    <h1 className="text-lg font-bold">Performance Trends</h1>
                    <h1 className="text-[14px] --sm text-gray-500">
                      (Last 7 days improvement)
                    </h1>
                  </div>
                  <MobileTooltip
                    content="Performance metrics show your improvement over the last 7 days. Green indicates positive trends, while other colors show areas that need attention. Games Won and ELO Rating increases are good, while fewer Mistakes and Blunders indicate better play."
                    side="left"
                  >
                    <Info
                      className="w-4 h-4 text-blue-base hover:text-blue-600 cursor-pointer transition-colors"
                      strokeWidth={1.5}
                    />
                  </MobileTooltip>
                </div>

                {stats.length === 0 ? (
                  <div className="h-[200px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                    <Image
                      src="/training-plan/no-data.png"
                      alt="No games found"
                      className="mb-2"
                      width={96}
                      height={96}
                    />
                    <p className="text-base text-gray-600 font-medium">
                      You have not played any Games in the last 7 days
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {stats.map((stat, index) => {
                      const { color, value } = getChangeColorAndPrefix(
                        stat.change,
                        stat.title
                      );

                      return (
                        <Card
                          key={index}
                          className="p-[8px] md:p-4 min-h-32 rounded-xl border flex items-center bg-white shadow-sm"
                        >
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mr-3">
                              {stat.icon === "trophy" && (
                                <LucideTrophy
                                  className="h-6 w-6 text-green-500"
                                  strokeWidth={1.5}
                                />
                              )}
                              {stat.icon === "target" && (
                                <TargetIcon
                                  className="h-6 w-6 text-blue-base"
                                  strokeWidth={1.5}
                                />
                              )}
                              {stat.icon === "alert-yellow" && (
                                <TriangleAlertIcon
                                  className="h-6 w-6 text-[#FAC933]"
                                  strokeWidth={1.5}
                                />
                              )}
                              {stat.icon === "alert-red" && (
                                <TriangleAlertIcon
                                  className="h-6 w-6 text-[#FD0000]"
                                  strokeWidth={1.5}
                                />
                              )}
                            </div>

                            <div className="flex-1">
                              <h3 className="font-medium text-gray-700 text-[14px] --sm">
                                {stat.title}
                              </h3>
                              <h2 className="text-2xl font-bold">
                                {stat.value}
                              </h2>
                              <div className={`text-[14px] --sm font-bold ${stat.icon === "alert-red" ? "text-[#FD0000]" : stat.icon === "alert-yellow" ? "text-[#FAC933]" : color}`}>
                                {value}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {progressError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            <p className="font-semibold text-base">
              Error loading progress data:
            </p>
            <p className="text-base">{progressError}</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ProgressDisplay;

const getChangeColorAndPrefix = (change: number, title: string) => {
  const isNegative = change < 0;

  if (!isNegative) {
    if (title === "Games Won")
      return { color: "text-green-600", value: `${change.toString() + "%"}` };
    if (title === "Blunders")
      return { color: "text-green-600", value: `${change.toString() + "%"}` };
    if (title === "Mistakes")
      return { color: "text-green-600", value: `${change.toString() + "%"}` };
  }

  if (isNegative) {
    if (title === "Games Won")
      return { color: "text-red-500", value: `${change.toString() + "%"}` };
    if (title === "Mistakes")
      return { color: "text-yellow-500", value: `${change.toString() + "%"}` };
    if (title === "Blunders")
      return { color: "text-red-500", value: `${change.toString() + "%"}` };
  }

  return {
    color: "text-green-600",
    value: `${change > 0 ? "+" : ""}${change}`,
  };
};