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
  Target,
  TargetIcon,
  TriangleAlert,
  TriangleAlertIcon,
  Trophy,
} from "lucide-react";
import DotSpinner from "@/components/game-history/Spinner";
import { useAuth } from "@clerk/nextjs";
import { useProgressStore } from "../store";
import Image from "next/image";
import CacheUtil, { CACHE_KEYS } from "../api/cacheUtils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProfileStore } from "@/app/store/profile";

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
        <p className="font-semibold text-sm">{data.week}</p>
        <p className="text-sm">Rating: {data.rating}</p>
      </div>
    );
  }
  return null;
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
    isLoading,
    error,
    currentMonth,
    setCurrentMonth,
    fetchProgressData,
  } = useProgressStore();

  const [displayMonth, setDisplayMonth] = useState(
    getDisplayMonthFromYearMonth(currentMonth)
  );

  // Add local loading state to prevent unnecessary loading spinner
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (sessionId != "") {
      // Check if data is already cached
      const hasCachedData = CacheUtil.hasValidCache(CACHE_KEYS.PROGRESS_DATA);

      // Only set loading state to true if no cached data
      if (!hasCachedData) {
        setIsInitialLoad(true);
      } else {
        setIsInitialLoad(false);
      }

      fetchProgressData(sessionId, currentMonth)
        .then(() => {
          setIsInitialLoad(false);
        })
        .catch(() => {
          setIsInitialLoad(false);
        });
    }
  }, [sessionId, currentMonth, fetchProgressData]);

  const handleMonthChange = (month: string) => {
    setDisplayMonth(month);
    const yearMonth = getCurrentYearMonth(month);
    setCurrentMonth(yearMonth);

    setIsInitialLoad(true);

    if (sessionId != "") {
      fetchProgressData(sessionId, yearMonth)
        .then(() => {
          setIsInitialLoad(false);
        })
        .catch(() => {
          setIsInitialLoad(false);
        });
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
          icon: "trophy",
        },
        {
          title: "ELO Rating",
          value: apiData.performanceTrends.eloRating.rating?.toString() || "0",
          icon: "target",
        },
        {
          title: "Mistakes",
          value: apiData.performanceTrends.mistakes.count?.toString() || "0",
          icon: "alert-yellow",
        },
        {
          title: "Blunders",
          value: apiData.performanceTrends.blunders.count?.toString() || "0",
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

  // Only show loading spinner during initial load, not when data is cached
  const isChartLoading = isInitialLoad || (isLoading && !apiData);

  return (
    <div className="space-y-4 p-4 xl:p-0">
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-4 flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Overall Improvement</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-[#CF9DFF] to-[#CF9DFF]/80 flex items-start gap-y-2 justify-center flex-col rounded-lg max-h-[150px] text-white p-6 relative overflow-hidden">
              <h1 className="text-lg font-medium">my current level</h1>
              {isChartLoading ? (
                <div className="bg-white/20 border-r-2 border-l-2 rounded-md p-4 w-full flex items-center justify-center">
                  <DotSpinner />
                </div>
              ) : (
                <div className="bg-white/20 border-r-2 border-l-2 rounded-md p-2">
                  <h1 className="text-xl font-semibold">
                    {apiData?.currentLevel?.level}
                  </h1>
                  <div className="flex items-center gap-x-2">
                    <h1 className="text-4xl font-bold">
                      {apiData?.currentLevel?.rating?.toLocaleString()}
                    </h1>
                    <h1 className="text-base">
                      elo rating<span className="ml-2">⭐</span>
                    </h1>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#FAC933]/5 border border-[#FAC933] flex items-start gap-y-2 justify-center flex-col rounded-lg p-6 max-h-[150px] text-black relative overflow-hidden">
              <div className="flex items-center gap-x-2">
                <TargetIcon className="w-5 h-5 text-[#FAC933]" />
                <h1 className="text-lg font-medium text-black">Accuracy</h1>
              </div>

              {isChartLoading ? (
                <div className="w-full flex items-center justify-center py-4">
                  <DotSpinner />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-[#FAC933]">
                    {apiData?.accuracy?.percentage}%
                  </h1>
                  <div className="text-base font-medium">
                    +{apiData?.accuracy?.improvement}% improvement
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 flex flex-col gap-6 border rounded-md p-4">
          <div className="border-none rounded-lg overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Your Progress</h3>
                <p className="text-base">Your ELO Rating Progress</p>
              </div>
              <Select value={displayMonth} onValueChange={handleMonthChange}>
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
            {isChartLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <DotSpinner />
              </div>
            ) : getFormattedRatingData().length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                <Image
                  src="/training-plan/no-data.png"
                  alt="No games found"
                  className=" mb-2"
                  width={96}
                  height={96}
                />
                <p className="text-lg text-gray-600 font-medium">
                  No data available
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={400} minWidth={300}>
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
                      domain={[0, 2400]}
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

          <div className="overflow-hidden">
            <h3 className="text-xl font-bold mb-1">
              Last Week's Training Distribution
            </h3>
            <p className="text-base mb-4">Minutes spent on different aspects</p>
            {isChartLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <DotSpinner />
              </div>
            ) : trainingData.length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                <Image
                  src="/training-plan/no-data.png"
                  alt="No games found"
                  className=" mb-2"
                  width={96}
                  height={96}
                />
                <p className="text-lg text-gray-600 font-medium">
                  No data available
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={400} minWidth={300}>
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
                      domain={[0, 1400]}
                      axisLine={true}
                      tickLine={true}
                      tick={{ fill: "#000", fontSize: 12 }}
                      width={40}
                    />
                    <RechartsTooltip />
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
        </div>

        <div className="md:col-span-2 flex flex-col rounded-md border p-4 gap-6 mt-6 md:mt-0">
          <div className="rounded-lg ">
            <h1 className="text-lg font-bold mb-2">
              Recent Games{" "}
              <span className="text-sm font-normal text-gray-500">
                {formattedRecentGames.length > 0
                  ? `(Last ${formattedRecentGames.length} games)`
                  : ""}
              </span>
            </h1>

            {isChartLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <DotSpinner />
              </div>
            ) : formattedRecentGames.length === 0 ? (
              <div className="h-[200px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                <Image
                  src="/training-plan/no-data.png"
                  alt="No games found"
                  className=" mb-2"
                  width={96}
                  height={96}
                />
                <p className="text-base text-gray-600 font-medium">
                  You have not played any Games yet.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-sm border overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-50 text-sm font-medium">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Opponent</th>
                        <th className="p-2 text-left">Result</th>
                        <th className="p-2 text-left">Opening</th>
                        <th className="p-2 text-left">Analysis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formattedRecentGames.map((game, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-2 text-sm text-nowrap">
                            {game.date}
                          </td>
                          <td className="p-2">
                            <div className="text-sm font-medium">
                              {game.opponent}
                            </div>
                            <div className="text-xs text-gray-500">
                              Rating: {game.rating}
                            </div>
                          </td>
                          <td className="p-2">
                            <span
                              className={`text-sm font-medium ${
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
                          <td className="p-2 text-sm">{game.opening}</td>
                          <td className="p-2">
                            <div className="flex flex-col space-y-2 text-sm">
                              <div className="flex items-center">
                                <Target className="w-4 h-4 rounded-full text-blue-base flex items-center justify-center mr-1" />
                                <span className="text-sm">
                                  {game.accuracy}%
                                </span>
                              </div>
                              <div className="flex items-center">
                                <TriangleAlert className="w-4 h-4 rounded-full text-yellow-500 flex items-center justify-center mr-1" />
                                <span className="text-sm">
                                  {game.brilliant}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 rounded-full text-blue-base flex items-center justify-center mr-1" />
                                <span className="text-sm">{game.mistakes}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-3 gap-x-1 text-sm">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 text-green-500 rounded-sm mr-1" />
                    <span>Win Rate: {apiData?.winRate || 0}%</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 rounded-full text-blue-500 flex items-center justify-center mr-1" />
                    <span>Avg Accuracy: {apiData?.avgAccuracy || 0}%</span>
                  </div>
                  <div>
                    <span>Total Games: {formattedRecentGames.length}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="">
            <div className="flex items-center gap-x-2 mb-2">
              <h1 className="text-lg font-bold">Performance Trends</h1>
              <h1 className="text-sm text-gray-500">
                (Last 7 days improvement)
              </h1>
            </div>

            {isChartLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <DotSpinner />
              </div>
            ) : stats.length === 0 ? (
              <div className="h-[200px] flex flex-col items-center justify-center bg-[#C0CED440]/20 rounded-lg">
                <Image
                  src="/training-plan/no-data.png"
                  alt="No games found"
                  className=" mb-2"
                  width={96}
                  height={96}
                />
                <p className="text-base text-gray-600 font-medium">
                  You have not played any Games in the last 7 days
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3  w-full">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="p-4 min-h-32 rounded-xl border flex items-center bg-white shadow-sm"
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
                        <h3 className="font-medium text-gray-700 text-sm">
                          {stat.title}
                        </h3>
                        <h2 className="text-2xl font-bold">{stat.value}</h2>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <p className="font-semibold text-base">
            Error loading progress data:
          </p>
          <p className="text-base">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ProgressDisplay;
