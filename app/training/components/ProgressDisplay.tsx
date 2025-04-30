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
  BrainIcon,
  Clock,
  LucideTrophy,
  Target,
  TargetIcon,
  TrendingUp,
  TriangleAlert,
  Trophy,
} from "lucide-react";
import DotSpinner from "@/components/game-history/Spinner";
import { useAuth } from "@clerk/nextjs";
import { useProgressStore } from "../store";

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
  const { sessionId } = useAuth();
  const currentDate = new Date();

  // Get the current year-month in the format YYYY-MM
  const getCurrentYearMonth = (monthName: string) => {
    const monthIndex = MONTHS.indexOf(monthName);
    const year = currentDate.getFullYear();
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  };

  // Get the display month name from a YYYY-MM string
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

  // Use the progress store
  const {
    progressData: apiData,
    isLoading,
    error,
    currentMonth,
    setCurrentMonth,
    fetchProgressData,
  } = useProgressStore();

  // Set display month based on the currentMonth in the store
  const [displayMonth, setDisplayMonth] = useState(
    getDisplayMonthFromYearMonth(currentMonth)
  );

  // Fetch progress data when component mounts or month changes
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

  // Create performance trends from API if available
  const stats = apiData
    ? [
        {
          title: "Games Won",
          value: apiData.performanceTrends.gamesWon.count?.toString() || "0",
          trend:
            apiData.performanceTrends.gamesWon.change > 0
              ? `+${apiData.performanceTrends.gamesWon.change}%`
              : `${apiData.performanceTrends.gamesWon.change}%`,
          trendColor:
            apiData.performanceTrends.gamesWon.change > 0
              ? "text-green-500"
              : "text-red-500",
          icon: "trophy",
        },
        {
          title: "ELO Rating",
          value: apiData.performanceTrends.eloRating.rating?.toString() || "0",
          trend:
            apiData.performanceTrends.eloRating.change > 0
              ? `+${apiData.performanceTrends.eloRating.change}`
              : `${apiData.performanceTrends.eloRating.change}`,
          trendColor:
            apiData.performanceTrends.eloRating.change > 0
              ? "text-green-500"
              : "text-red-500",
          icon: "target",
        },
        {
          title: "Mistakes",
          value: apiData.performanceTrends.mistakes.count?.toString() || "0",
          trend:
            apiData.performanceTrends.mistakes.change > 0
              ? `+${apiData.performanceTrends.mistakes.change}`
              : `${apiData.performanceTrends.mistakes.change}`,
          trendColor:
            apiData.performanceTrends.mistakes.change < 0
              ? "text-green-500"
              : "text-red-500",
          icon: "brain",
        },
        {
          title: "Blunders",
          value: apiData.performanceTrends.blunders.count?.toString() || "0",
          trend:
            apiData.performanceTrends.blunders.change > 0
              ? `+${apiData.performanceTrends.blunders.change}`
              : `${apiData.performanceTrends.blunders.change}`,
          trendColor:
            apiData.performanceTrends.blunders.change < 0
              ? "text-green-500"
              : "text-red-500",
          icon: "trending-up",
        },
      ]
    : [];

  // Format the rating progress data from API
  const getFormattedRatingData = () => {
    if (apiData?.ratingProgress?.data) {
      return apiData.ratingProgress.data.map((item) => ({
        week: `Week ${item.week}`,
        rating: item.rating,
      }));
    }
    return [];
  };

  // Format the recent games data from API
  const formattedRecentGames = apiData?.recentGames
    ? apiData.recentGames.map((game) => ({
        date: game.date,
        opponent: game.opponent,
        rating: game.rating,
        result: game.result,
        opening: game.opening,
        accuracy: game.analysis.accuracy,
        brilliant: game.analysis.score,
        mistakes: "N/A", // API doesn't provide this field
      }))
    : [];

  // Show partial loading indicators instead of full-screen loader
  const isChartLoading = isLoading || !apiData;

  return (
    <div className="space-y-4 p-4 xl:p-0">
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-4 flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Overall Improvement</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Level Card */}
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

            {/* Accuracy Card */}
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

      {/* Charts and Stats Container with 60/40 split */}
      <div className="md:grid md:grid-cols-5 gap-6">
        {/* Left column - Charts (60%) */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {/* ELO Rating Chart */}
          <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <CardContent className="p-6">
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
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={getFormattedRatingData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
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
                      tick={{ fill: "#000" }}
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                      domain={[
                        (dataMin: number) => Math.max(0, dataMin - 100),
                        (dataMax: number) => dataMax + 100,
                      ]}
                      axisLine={true}
                      tickLine={true}
                      tick={{ fill: "#000" }}
                      padding={{ top: 20, bottom: 20 }}
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
              )}
            </CardContent>
          </Card>

          {/* Training Distribution Chart */}
          <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-1">
                Last Week's Training Distribution
              </h3>
              <p className="text-base mb-4">
                Minutes spent on different aspects
              </p>
              {isChartLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <DotSpinner />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={trainingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    barSize={60}
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
                      tick={{ fill: "#000" }}
                      padding={{ left: 40, right: 40 }}
                    />
                    <YAxis
                      domain={[0, "dataMax + 100"]}
                      axisLine={true}
                      tickLine={true}
                      tick={{ fill: "#000" }}
                    />
                    <RechartsTooltip />
                    <Bar dataKey="minutes" radius={[0, 0, 0, 0]}>
                      {trainingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Recent Games and Stats (40%) */}
        <div className="md:col-span-2 flex flex-col gap-6 mt-6 md:mt-0">
          {/* Recent Games Section */}
          <div className="p-4 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-lg font-bold mb-2">
              Recent Games{" "}
              <span className="text-sm font-normal text-gray-500">
                {formattedRecentGames.length > 0
                  ? `(Last ${formattedRecentGames.length} games)`
                  : "(Loading games...)"}
              </span>
            </h1>

            {isChartLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <DotSpinner />
              </div>
            ) : formattedRecentGames.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-gray-500 text-base">No recent games found</p>
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

          {/* Key Statistics Section */}
          <div className="p-4 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-lg font-bold mb-2">Performance Trends</h1>
            <h1 className="text-sm mb-3">Monthly improvement</h1>
            {isChartLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <DotSpinner />
              </div>
            ) : stats.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-gray-500 text-base">
                  No performance data available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 w-full">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="p-6 rounded-xl border bg-white shadow-sm"
                  >
                    <div className="flex flex-col">
                      <h3 className="font-medium text-gray-700 mb-2 text-lg">
                        {stat.title}
                      </h3>

                      <div className="flex items-start">
                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mr-3">
                          {stat.icon === "trophy" && (
                            <LucideTrophy
                              className="h-8 w-8 text-green-500"
                              fill="#22c55e"
                              strokeWidth={1.5}
                            />
                          )}
                          {stat.icon === "target" && (
                            <TargetIcon
                              className="h-8 w-8 text-blue-500"
                              strokeWidth={1.5}
                            />
                          )}
                          {stat.icon === "brain" && (
                            <BrainIcon
                              className="h-8 w-8 text-yellow-500"
                              strokeWidth={1.5}
                            />
                          )}
                          {stat.icon === "trending-up" && (
                            <TrendingUp
                              className="h-8 w-8 text-purple-500"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col">
                          <h2 className="text-4xl font-bold">{stat.value}</h2>
                          {stat.trend && (
                            <p
                              className={`text-base font-medium ${stat.trendColor} mt-1`}
                            >
                              {stat.trend}
                            </p>
                          )}
                        </div>
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
