import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  PlusCircle,
  Heart,
  Tag,
  Sparkles,
  Trophy,
  Calendar,
  Check,
  Target,
  TriangleAlert,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "../../ui/card";

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

const Statistics = () => {
  // Data for Rating Progress chart
  const [ratingData] = useState([
    { month: "12/24", rating: 0, accuracy: 1300 },
    { month: "01/25", rating: 1500, accuracy: 100 },
    { month: "02/25", rating: 1420, accuracy: 1100 },
    { month: "03/25", rating: 1820, accuracy: 2000 },
  ]);

  // Data for Training Distribution chart
  const [trainingData] = useState([
    { category: "Tactics", hours: 4.5, fill: "#3b82f6" },
    { category: "Openings", hours: 7, fill: "#FFE492" },
    { category: "Middlegame", hours: 6, fill: "#50C878" },
    { category: "Endgame", hours: 8, fill: "#FF6B6B" },
    { category: "Analysis", hours: 6.5, fill: "#9370DB" },
  ]);

  // Dynamic data for Training Goals
  const [trainingGoals] = useState([
    {
      title: "Reach 2000 Rating",
      progress: 75,
      target: "2000 rating",
      dueDate: "2025-02-27",
      termType: "Short-term",
      badgeVariant: "default",
      iconBg: "bg-purple-500",
      Icon: PlusCircle,
    },
    {
      title: "Master Sicilian Defense",
      progress: 80,
      target: "Opening Repertoire",
      dueDate: "2025-02-27",
      termType: "Mid-term",
      badgeVariant: "secondary",
      iconBg: "bg-blue-500",
      Icon: Heart,
    },
    {
      title: "Solve 500 Puzzles",
      progress: 80,
      target: "500 puzzles",
      dueDate: "2025-02-27",
      termType: "Long-term",
      badgeVariant: "destructive",
      iconBg: "bg-purple-500",
      Icon: Tag,
    },
    {
      title: "Mastering Middlegame",
      progress: 0,
      target: "Middlegame Topics",
      dueDate: "2025-02-27",
      termType: "Short-term",
      badgeVariant: "default",
      iconBg: "bg-blue-500",
      Icon: Sparkles,
    },
  ]);

  // Dynamic data for Recent Games
  const [recentGames] = useState([
    {
      date: "2025-02-27",
      opponent: "IM_Chess Master",
      rating: 2100,
      result: "WIN",
      opening: "Sicilian Defense",
      accuracy: 92,
      brilliant: 4,
      mistakes: "10 + 5",
    },
    {
      date: "2025-02-27",
      opponent: "IM_Chess Master",
      rating: 2100,
      result: "WIN",
      opening: "Sicilian Defense",
      accuracy: 92,
      brilliant: 4,
      mistakes: "10 + 5",
    },
    {
      date: "2025-02-27",
      opponent: "IM_Chess Master",
      rating: 2100,
      result: "WIN",
      opening: "Sicilian Defense",
      accuracy: 92,
      brilliant: 4,
      mistakes: "10 + 5",
    },
    {
      date: "2025-02-27",
      opponent: "IM_Chess Master",
      rating: 2100,
      result: "WIN",
      opening: "Sicilian Defense",
      accuracy: 92,
      brilliant: 4,
      mistakes: "10 + 5",
    },
    {
      date: "2025-02-27",
      opponent: "IM_Chess Master",
      rating: 2100,
      result: "WIN",
      opening: "Sicilian Defense",
      accuracy: 92,
      brilliant: 4,
      mistakes: "10 + 5",
    },
  ]);

  // Game statistics
  const winRate = 50;
  const avgAccuracy = 87;
  const totalGames = 150;

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* Left Column for tablet */}
      <div className="flex flex-col gap-4 md:p-4 rounded-lg md:shadow-md md:border md:border-primary-gray">
        {/* Rating Progress Chart with Tooltip */}
        <div className="">
          <h1 className="text-base font-bold mb-2">Improvement Progress</h1>
          <p className="text-[14px] --xs mb-2">
            Your chess improvement journey this month
          </p>
          <div className="h-64 flex">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ratingData}
                margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
                className="text-[14px] --xs"
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
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#FFE492"
                  strokeWidth={2}
                  dot={{
                    stroke: "#FFE492",
                    strokeWidth: 2,
                    fill: "#FFE492",
                    r: 4,
                  }}
                  activeDot={{ r: 6, fill: "#FFE492" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex justify-center items-center gap-x-5 text-[14px] --xs">
            <div className="flex flex-col justify-center items-center gap-y-2 ">
              <div className="w-24 h-4 bg-[#7AA0F2] border border-blue-base"></div>
              <h1>Rating Progress</h1>
            </div>
            <div className="flex flex-col justify-center items-center gap-y-2">
              <div className="w-24 h-4 bg-yellow-300"></div>
              <h1>Accuracy</h1>
            </div>
          </div>
        </div>

        {/* Training Distribution Chart */}
        <div className="">
          <h1 className="text-base font-bold mb-2">Training Distribution</h1>
          <p className="text-[14px] --xs mb-2">Hours spent on different aspects</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
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
                  className="text-[14px] --xs"
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
        </div>
      </div>

      {/* Right Column for tablet */}
      <div className="flex flex-col gap-4 md:p-4 rounded-lg md:shadow-md md:border md:border-primary-gray">
        {/* Training Goals Section */}
        <div className="">
          <h1 className="text-base font-bold mb-2">Training Goals</h1>
          <p className="text-[14px] --xs mb-2">
            Set and track your chess improvement goals
          </p>

          {trainingGoals.map((goal, index) => (
            <Card
              key={index}
              className="bg-white rounded-lg p-4 mb-3 last:mb-0"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full ${goal.iconBg} flex items-center justify-center mr-2`}
                  >
                    <goal.Icon size={12} color="white" />
                  </div>
                  <span className="font-semibold text-[14px] --sm">{goal.title}</span>
                </div>
                <div className="text-blue-base border border-blue-base rounded-[3px] px-2 py-[2px] text-[14px] --xs">
                  {goal.termType}
                </div>
              </div>

              <div className="flex justify-between text-[14px] --xs">
                <p className=" mb-1">Progress</p>
                <div className="flex gap-x-2">
                  <Check
                    size={16}
                    className="text-white rounded-full p-[1px] bg-gray-200"
                  />
                  <p className="">{goal.progress}%</p>
                </div>
              </div>
              <div className="flex items-center mb-2 ">
                <Progress value={goal.progress} className="h-2 bg-gray-300" />
              </div>

              <div className="flex justify-between text-[14px] --xs text-gray-600 mb-3">
                <div className="flex items-center">
                  <Trophy size={16} className="mr-1" />
                  <span>{goal.target}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{goal.dueDate}</span>
                </div>
              </div>

              <Button className="w-full btn-secondary rounded-full h-8">
                <h1 className="text-[14px] --xs">
                  {goal.progress > 0 ? "Resume Training" : "Start Training"}
                </h1>
              </Button>
            </Card>
          ))}
        </div>

        {/* Recent Games Section */}
        <div className=" ">
          <h1 className="text-base font-bold mb-2">
            Recent Games{" "}
            <span className="text-[14px] --xs font-light text-gray-500">
              (Last 5 games)
            </span>
          </h1>

          <div className="rounded-sm border overflow-x-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-[14px] --xs font-thin">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Opponent</th>
                  <th className="p-2 text-left">Result</th>
                  <th className="p-2 text-left">Opening</th>
                  <th className="p-2 text-left">Analysis</th>
                </tr>
              </thead>
              <tbody>
                {recentGames.map((game, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-2 text-[14px] --10px text-nowrap">{game.date}</td>
                    <td className="p-2">
                      <div className="text-[14px] --xs font-medium">{game.opponent}</div>
                      <div className="text-[14px] --10px text-gray-500">
                        Rating: {game.rating}
                      </div>
                    </td>
                    <td className="p-2">
                      <span
                        className={`text-[14px] --xs font-medium ${
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
                    <td className="p-2 text-[14px] --xs">{game.opening}</td>
                    <td className="p-2">
                      <div className="flex flex-col space-y-2 text-[14px] --xs">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 rounded-full text-blue-base flex items-center justify-center mr-1" />
                          <span className="text-[14px] --10px">{game.accuracy}%</span>
                        </div>
                        <div className="flex items-center">
                          <TriangleAlert className="w-4 h-4 rounded-full text-yellow-500 flex items-center justify-center mr-1" />
                          <span className="text-[14px] --10px">{game.brilliant}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 rounded-full text-blue-base flex items-center justify-center mr-1" />
                          <span className="text-[14px] --10px">{game.mistakes}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-3 gap-x-1 text-[14px] --xs md:text-[14px] --10px">
            <div className="flex items-center">
              <Trophy className="w-4 h-4 text-green-500 rounded-sm mr-1" />
              <span>Win Rate: {winRate}%</span>
            </div>
            <div className="flex items-center">
              <Target className="w-4 h-4 rounded-full text-blue-500 flex items-center justify-center mr-1" />
              <span>Avg Accuracy: {avgAccuracy}%</span>
            </div>
            <div>
              <span>Total Games: {totalGames}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
