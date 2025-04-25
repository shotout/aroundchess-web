// components/ProgressDisplay.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { keyStatsData, ratingChartData, recentGamesData } from "./mockData";
import { ProgressDisplayProps } from "./types";

const CustomTooltipContent = ({
  active,
  payload,
}: {
  active: boolean;
  payload: { payload: { month: string; rating: number } }[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded-md shadow-md">
        <p className="font-semibold">Date: {data.month} 2024</p>
        <p>Rating: {data.rating}</p>
      </div>
    );
  }
  return null;
};

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  currentLevel,
  currentElo,
  accuracyPercentage,
  accuracyImprovement,
}) => {
  const [trainingData] = useState([
    { category: "Tactics", hours: 4.5, fill: "#3b82f6" },
    { category: "Openings", hours: 7, fill: "#FFE492" },
    { category: "Middlegame", hours: 6, fill: "#50C878" },
    { category: "Endgame", hours: 8, fill: "#FF6B6B" },
    { category: "Analysis", hours: 6.5, fill: "#9370DB" },
  ]);
  return (
    <div className="space-y-6">
      {/* Overall Improvement - Level and Accuracy Cards */}
      <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <CardContent className="p-4 flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Overall Improvement</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level Card */}
            <div className="rounded-lg bg-purple-500 text-white p-6 relative overflow-hidden">
              <div className="flex items-center">
                <span className="inline-block mr-2 w-3 h-3 bg-white rotate-45"></span>
                <span className="text-lg text-white/90">My Current Level:</span>
              </div>

              <div className="relative border-l-2 border-r-2 bg-white/10 rounded-md flex flex-col justify-center  ">
                <div className="text-4xl font-bold mb-2">{currentLevel}</div>
                <div className="text-6xl font-bold mb-2">
                  {currentElo.toLocaleString()}
                </div>
                <div className="text-xl text-white/90 flex items-center">
                  ELO Rating
                </div>
              </div>
            </div>

            {/* Accuracy Card */}
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-6">
              <div className="mb-6 flex items-center">
                <div className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center mr-3">
                  <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  Accuracy
                </span>
              </div>

              <div className="text-center">
                <div className="text-6xl font-bold text-amber-500 mb-3">
                  {accuracyPercentage}%
                </div>
                <div className="text-amber-600 font-medium">
                  +{accuracyImprovement}% improvement
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Stats Container with 60/40 split */}
      <div className="md:grid md:grid-cols-5 gap-6">
        {/* Left column - Charts (60%) */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1">
            <CardContent className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">YourProgress</h3>
              <p>Your ELO Rating Progress</p>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                  <LineChart
                    data={ratingChartData}
                    margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
                    className="text-xs"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#999"
                      vertical={true}
                    />
                    <XAxis dataKey="month" axisLine={true} tickLine={true} />
                    <YAxis
                      domain={[0, 2000]}
                      ticks={[0, 500, 1000, 1500, 2000]}
                      axisLine={true}
                      tickLine={true}
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
                        fill: "#221AE9",
                        r: 4,
                      }}
                      activeDot={{ r: 6, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1">
            <CardContent className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-3">
                Last Week’s Training Distribution
              </h3>
              <p>Minutes spent on different aspects</p>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                  <BarChart
                    data={trainingData}
                    margin={{ top: 20, right: 10, left: -40, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="5 5"
                      stroke="#999"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="category"
                      axisLine={true}
                      tickLine={true}
                      padding={{ left: 2, right: 2 }}
                      className="text-xs"
                    />
                    <YAxis
                      domain={[0, 8]}
                      ticks={[0, 2, 4, 6, 8]}
                      axisLine={true}
                      tickLine={true}
                    />
                    <RechartsTooltip />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                      {trainingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right column - Recent Games and Stats (40%) */}
        <div className="md:col-span-2 flex flex-col gap-6 mt-6 md:mt-0">
          {/* Recent Games Section */}
          <div className="p-4 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-base font-bold mb-2">
              Recent Games{" "}
              <span className="text-xs font-light text-gray-500">
                (Last 5 games)
              </span>
            </h1>

            <div className="rounded-sm border overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-xs font-thin">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Opponent</th>
                    <th className="p-2 text-left">Result</th>
                    <th className="p-2 text-left">Opening</th>
                    <th className="p-2 text-left">Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGamesData.map((game, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-2 text-[10px] text-nowrap">
                        {game.date}
                      </td>
                      <td className="p-2">
                        <div className="text-xs font-medium">
                          {game.opponent}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Rating: {game.rating}
                        </div>
                      </td>
                      <td className="p-2">
                        <span
                          className={`text-xs font-medium ${
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
                      <td className="p-2 text-xs">{game.opening}</td>
                      <td className="p-2">
                        <div className="flex flex-col space-y-2 text-xs">
                          <div className="flex items-center">
                            <Target className="w-4 h-4 rounded-full text-blue-base flex items-center justify-center mr-1" />
                            <span className="text-[10px]">
                              {game.accuracy}%
                            </span>
                          </div>
                          <div className="flex items-center">
                            <TriangleAlert className="w-4 h-4 rounded-full text-yellow-500 flex items-center justify-center mr-1" />
                            <span className="text-[10px]">
                              {game.brilliant}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 rounded-full text-blue-base flex items-center justify-center mr-1" />
                            <span className="text-[10px]">{game.mistakes}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-3 gap-x-1 text-xs md:text-[10px]">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 text-green-500 rounded-sm mr-1" />
                <span>Win Rate: {97}%</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 rounded-full text-blue-500 flex items-center justify-center mr-1" />
                <span>Avg Accuracy: {97}%</span>
              </div>
              <div>
                <span>Total Games: {10}</span>
              </div>
            </div>
          </div>

          {/* Key Statistics Section */}
          <div className="p-4 rounded-lg shadow-md border border-gray-200">
            <h1 className="text-base font-bold mb-2">Performance Trends</h1>
            <h1 className="text-xs mb-3">Monthly improvement</h1>
            <div className="grid grid-cols-2 gap-3 w-full">
              {keyStatsData.map((stat, index) => (
                <Card key={index} className="p-3 rounded-lg border bg-white">
                  <div className="flex flex-col items-start">
                    {stat.icon === "trophy" && (
                      <LucideTrophy
                        className="h-6 w-6 text-yellow-500 mb-2"
                        fill="#eab308"
                      />
                    )}
                    {stat.icon === "target" && (
                      <TargetIcon className="h-6 w-6 text-green-500 mb-2" />
                    )}
                    {stat.icon === "brain" && (
                      <BrainIcon className="h-6 w-6 text-blue-500 mb-2" />
                    )}
                    {stat.icon === "trending-up" && (
                      <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
                    )}

                    <h2 className="text-xl font-semibold mb-1">{stat.value}</h2>
                    <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
                    {stat.trend && (
                      <p className={`text-xs font-medium ${stat.trendColor}`}>
                        {stat.trend}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;
