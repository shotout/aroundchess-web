import React, { useState } from "react";
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
import { keyStatsData, recentGamesData } from "./mockData";
import { ProgressDisplayProps } from "./types";

const monthlyRatingData = {
  January: [
    { week: "Week 1", rating: 600 },
    { week: "Week 2", rating: 650 },
    { week: "Week 3", rating: 720 },
    { week: "Week 4", rating: 750 },
  ],
  February: [
    { week: "Week 1", rating: 750 },
    { week: "Week 2", rating: 790 },
    { week: "Week 3", rating: 820 },
    { week: "Week 4", rating: 900 },
  ],
  March: [
    { week: "Week 1", rating: 800 },
    { week: "Week 2", rating: 870 },
    { week: "Week 3", rating: 1000 },
    { week: "Week 4", rating: 1000 },
  ],
  April: [
    { week: "Week 1", rating: 1000 },
    { week: "Week 2", rating: 1050 },
    { week: "Week 3", rating: 1100 },
    { week: "Week 4", rating: 1180 },
  ],
  May: [
    { week: "Week 1", rating: 1180 },
    { week: "Week 2", rating: 1220 },
    { week: "Week 3", rating: 1250 },
    { week: "Week 4", rating: 1300 },
  ],
  June: [
    { week: "Week 1", rating: 1300 },
    { week: "Week 2", rating: 1350 },
    { week: "Week 3", rating: 1420 },
    { week: "Week 4", rating: 1450 },
  ],
  July: [
    { week: "Week 1", rating: 1450 },
    { week: "Week 2", rating: 1470 },
    { week: "Week 3", rating: 1500 },
    { week: "Week 4", rating: 1550 },
  ],
  August: [
    { week: "Week 1", rating: 1550 },
    { week: "Week 2", rating: 1620 },
    { week: "Week 3", rating: 1650 },
    { week: "Week 4", rating: 1700 },
  ],
  September: [
    { week: "Week 1", rating: 1700 },
    { week: "Week 2", rating: 1750 },
    { week: "Week 3", rating: 1780 },
    { week: "Week 4", rating: 1820 },
  ],
  October: [
    { week: "Week 1", rating: 1820 },
    { week: "Week 2", rating: 1870 },
    { week: "Week 3", rating: 1900 },
    { week: "Week 4", rating: 1950 },
  ],
  November: [
    { week: "Week 1", rating: 1950 },
    { week: "Week 2", rating: 2000 },
    { week: "Week 3", rating: 2050 },
    { week: "Week 4", rating: 2100 },
  ],
  December: [
    { week: "Week 1", rating: 2100 },
    { week: "Week 2", rating: 2150 },
    { week: "Week 3", rating: 2200 },
    { week: "Week 4", rating: 2250 },
  ],
};

// Training data
const trainingData = [
  { category: "Openings", minutes: 180, fill: "#90b1ff" },
  { category: "Middlegame", minutes: 130, fill: "#f3d48c" },
  { category: "Endgame", minutes: 120, fill: "#8eeda6" },
  { category: "Tactics", minutes: 170, fill: "#ff9a9a" },
];

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
        <p className="font-semibold">{data.week}</p>
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
  const [selectedMonth, setSelectedMonth] = useState("March");

  return (
    <div className="space-y-4 p-4 xl:p-0">
      {/* Charts and Stats Container with 60/40 split */}
      <div className="md:grid md:grid-cols-5 gap-6">
        {/* Left column - Charts (60%) */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {/* ELO Rating Chart */}
          <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Your Progress</h3>
                  <p className="text-base">Your ELO Rating Progress</p>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(monthlyRatingData).map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={
                    monthlyRatingData[
                      selectedMonth as keyof typeof monthlyRatingData
                    ]
                  }
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
                    domain={[0, 4000]}
                    ticks={[
                      0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600,
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
            </CardContent>
          </Card>

          {/* Training Distribution Chart */}
          <Card className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-1">
                Last Week's Training Distribution
              </h3>
              <p className="text-base mb-4">
                Minutes spent on different aspects
              </p>
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
                    domain={[0, 1400]}
                    ticks={[0, 200, 400, 600, 800, 1000, 1200, 1400]}
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
