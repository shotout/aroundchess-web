import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  BrainIcon,
  LucideTrophy,
  Swords,
  TargetIcon,
  TimerIcon,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Card } from "../ui/card";

const OpeningData = [
  {
    name: "Sicilian Defense",
    games: 45,
    winrate: "65%",
  },
  {
    name: "Queen's Gambit",
    games: 35,
    winrate: "60%",
  },
  {
    name: "Ruy Lopez",
    games: 30,
    winrate: "55%",
  },
  {
    name: "King's Indian Defense",
    games: 25,
    winrate: "50%",
  },
];

// Custom tooltip content component for the Rating Progress chart
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

const Analytics = () => {
  // Data for Rating Progress chart - can be updated from props or API
  const [ratingData] = useState([
    { month: "Jan", rating: 1300 },
    { month: "Feb", rating: 1500 },
    { month: "Mar", rating: 1420 },
    { month: "Apr", rating: 1820 },
    { month: "May", rating: 1740 },
    { month: "Jun", rating: 1880 },
  ]);

  // Data for Result Distribution - can be updated from props or API
  const [distributionData] = useState([
    { name: "Win", value: 70, color: "#00B427" }, // Green
    { name: "Draw", value: 25, color: "#fbbf24" }, // Yellow
    { name: "Loss", value: 5, color: "#FD0000" }, // Red
  ]);

  const performanceData = [
    { category: "Bullet", games: 250, winRate: 62 },
    { category: "Blitz", games: 500, winRate: 58 },
    { category: "Rapid", games: 150, winRate: 65 },
    { category: "Classical", games: 50, winRate: 70 },
  ];

  // Calculate the maximum number of games for scaling
  const maxGames = Math.max(...performanceData.map((item) => item.games));

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* Left Column for mobile and tablet */}
      <div className="flex flex-col gap-4">
        {/* Rating Progress Chart with Tooltip */}
        <div className="p-4 rounded-lg md:shadow-sm md:border">
          <h1 className="text-base font-bold mb-2">Rating Progress</h1>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ratingData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#999"
                  vertical={true}
                />
                <XAxis dataKey="month" axisLine={true} tickLine={true} />
                <YAxis
                  domain={[1000, 2000]}
                  ticks={[1000, 1200, 1400, 1600, 1800, 2000]}
                  axisLine={true}
                  tickLine={true}
                />
                <RechartsTooltip
                  content={<CustomTooltipContent active={false} payload={[]} />}
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
        </div>

        {/* Result Distribution and Opening Statistics side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  md:bg-white">
          {/* Result Distribution Chart */}
          <div className="p-4 rounded-lg md:shadow-sm md:border">
            <h1 className="text-base font-medium mb-2">Result Distribution</h1>
            <div className="flex items-center justify-center h-64">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Opening Statistics */}
          <div className="p-4 rounded-lg md:shadow-sm md:border">
            <h1 className="text-base font-medium mb-3">Opening Statistics</h1>
            <div className="space-y-3">
              {OpeningData.map((data, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h1 className="font-bold">{data.name}</h1>
                    <p className="text-sm text-gray-600">{data.games} games</p>
                  </div>
                  <h1 className="text-green-500">{data.winrate} winrate</h1>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Insights - Moved to the original position of Opening Statistics */}
        <div className="p-4 rounded-lg md:border">
          <h1 className="text-base font-medium mb-3">Performance Insights</h1>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
              <h1 className="text-sm font-thin">Average Game Length</h1>
              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">35 Moves</h1>
                </div>
                <span className="text-xs mt-1 font-thin">
                  +3 moves from last month
                </span>
              </div>
            </Card>

            <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
              <h1 className="text-sm font-thin">Time Management</h1>
              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">85%</h1>
                </div>
                <span className="text-xs mt-1 font-thin">
                  Efficient time usage
                </span>
              </div>
            </Card>

            <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
              <h1 className="text-sm font-thin">Accuracy</h1>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">92%</h1>
                </div>
                <span className="text-xs mt-1 font-thin">Top moves played</span>
              </div>
            </Card>

            <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
              <h1 className="text-sm font-thin">Blunder Rate</h1>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">3.5%</h1>
                </div>
                <p className="text-xs mt-1 font-thin">
                  <span className="text-red-400">-12% </span>
                  from last month
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Column for mobile and tablet */}
      <div className="flex flex-col gap-4">
        {/* Key Statistics */}
        <div className="p-4 rounded-lg md:border">
          <h1 className="text-base font-medium mb-3">Key Statistics</h1>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 rounded-lg md:border bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <LucideTrophy
                    className="h-6 w-6 text-yellow-500"
                    fill="#eab308"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-xs text-gray-500">Total Games</p>
                  <h2 className="text-base font-semibold">1,234</h2>
                  <p className="text-[10px] text-green-500">+45 this month</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 rounded-lg md:border bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <TargetIcon className="h-6 w-6 text-game-green" />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-xs text-gray-500">Win Rate</p>
                  <h2 className="text-base font-semibold">65%</h2>
                  <p className="text-[10px] text-game-green">+5%</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 rounded-lg md:border bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <BrainIcon className="h-6 w-6 text-blue-base" />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-xs text-gray-500">Average Rating</p>
                  <h2 className="text-base font-semibold">1,850</h2>
                  <p className="text-[10px] text-green-500">
                    +25 point this month
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-3 rounded-lg md:border bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-xs text-gray-500">Longest Streak</p>
                  <h2 className="text-base font-semibold">8 wins</h2>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Time Control Performance */}
        <div className="p-4 rounded-lg md:border">
          <h1 className="text-base font-medium mb-3">
            Time Control Performance
          </h1>
          <div className="space-y-4">
            {performanceData.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    {item.category}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {item.games} games
                  </span>
                </div>

                <div className="relative h-2 w-full">
                  <div className="absolute h-2 w-full bg-gray-200 rounded-full"></div>
                  <div
                    className="absolute h-2 bg-blue-base rounded-full"
                    style={{ width: `${(item.games / maxGames) * 100}%` }}
                  ></div>
                </div>

                <div className="w-full flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Win Rate
                  </span>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      item.winRate >= 60
                        ? "text-green-500"
                        : item.winRate >= 50
                        ? "text-blue-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.winRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="p-4 rounded-lg md:border">
          <h1 className="text-base font-medium mb-3">Recent Achievements</h1>
          <div className="space-y-3">
            <Card className="flex items-center gap-3 p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
              <div className="h-12 w-12 flex justify-center items-center bg-yellow-100 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-500" fill="#eab308" />
              </div>
              <div className="space-y-1">
                <h1 className="font-bold">First Classical Win</h1>
                <p className="text-xs">Won against 2,000+ rated player</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 p-3 rounded-lg shadow-sm md:shadow md:border bg-white mt-3">
              <div className="h-12 w-12 flex justify-center items-center bg-blue-100 rounded-full">
                <Swords className="h-6 w-6 text-blue-500" fill="#3b82f6" />
              </div>
              <div className="space-y-1">
                <h1 className="font-bold">Winning Streak</h1>
                <p className="text-xs">8 consecutive wins in blitz</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 p-3 rounded-lg shadow-sm md:shadow md:border bg-white mt-3">
              <div className="h-12 w-12 flex justify-center items-center bg-green-100 rounded-full">
                <TimerIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="space-y-1">
                <h1 className="font-bold">Time Management</h1>
                <p className="text-xs">90% time efficiency in last 10 games</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
