import React from "react";
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
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAchievementDetails } from "@/components/game-history/hooks/useAnalyticsData";

// Rating Progress Chart
export const RatingProgressChart: React.FC<{
  ratingData: any[];
  isCacheValid: boolean;
  handleForceRefresh: () => void;
}> = ({ ratingData, isCacheValid, handleForceRefresh }) => {
  return (
    <div className="md:p-4 rounded-lg md:shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-base font-bold">Rating Progress</h1>
        {!isCacheValid && (
          <button
            onClick={handleForceRefresh}
            className="text-blue-500 hover:text-blue-700 flex items-center text-[14px] --xs"
            title="Refresh data"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </button>
        )}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ratingData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
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
              content={({ active, payload }) => {
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
              }}
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
  );
};

// Result Distribution Chart
export const ResultDistributionChart: React.FC<{
  distributionData: any[];
}> = ({ distributionData }) => {
  return (
    <div className="md:p-4 rounded-lg md:shadow-sm ">
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
      <div className="flex justify-center items-center gap-x-4">
        <div className="flex flex-col items-center gap-y-2">
          <div className="w-12 h-2 bg-green-500"></div>
          <h1>Win</h1>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <div className="w-12 h-2 bg-yellow-500"></div>
          <h1>Draw</h1>
        </div>
        <div className="flex flex-col items-center gap-y-2">
          <div className="w-12 h-2 bg-red-500"></div>
          <h1>Lose</h1>
        </div>
      </div>
    </div>
  );
};

// Opening Statistics
export const OpeningStatistics: React.FC<{
  openingData: any[];
}> = ({ openingData }) => {
  return (
    <div className="md:p-4 rounded-lg md:shadow-sm ">
      <h1 className="text-base font-medium mb-3">Opening Statistics</h1>
      <div className="space-y-3">
        {openingData.map((data, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <h1 className="font-bold">{data.name}</h1>
              <p className="text-[14px] --sm text-gray-600">{data.games} games</p>
            </div>
            <h1 className="text-green-500">{data.winrate} win rate</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance Insights Section
export const PerformanceInsightsSection: React.FC<{
  insights: any;
}> = ({ insights }) => {
  return (
    <div className="md:p-4 rounded-lg">
      <h1 className="text-base font-medium mb-3">Performance Insights</h1>
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-[14px] --sm font-semibold">Average Game Length</h1>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">
                {insights.averageGameLength} Moves
              </h1>
            </div>
            <span className="text-[14px] --xs mt-1 ">+3 moves from last month</span>
          </div>
        </Card>

        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-[14px] --sm font-semibold">Time Management</h1>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">{insights.timeManagement}%</h1>
            </div>
            <span className="text-[14px] --xs mt-1">Efficient time usage</span>
          </div>
        </Card>

        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-[14px] --sm font-semibold">Accuracy</h1>

          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">{insights.accuracy}%</h1>
            </div>
            <span className="text-[14px] --xs mt-1">Top moves played</span>
          </div>
        </Card>

        <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
          <h1 className="text-[14px] --sm font-semibold">Blunder Rate</h1>

          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <h1 className="text-lg font-bold">{insights.blunderRate}%</h1>
            </div>
            <p className="text-[14px] --xs mt-1">
              <span className="text-red-400">-12% </span>
              from last month
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Key Statistics Section
export const KeyStatisticsSection: React.FC<{
  stats: any;
}> = ({ stats }) => {
  return (
    <div className="md:p-4 rounded-lg">
      <h1 className="text-base font-medium mb-3">Key Statistics</h1>
      <div className="grid grid-cols-2 gap-3">
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
              <p className="text-[14px] --10px text-green-500">+45 this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 rounded-lg md:border bg-white h-auto md:h-20 lg:h-24 flex">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <TargetIcon className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] --xs text-gray-500">Win Rate</p>
              <h2 className="text-base font-semibold">{stats.winRate}%</h2>
              <p className="text-[14px] --10px text-green-500">+5%</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 rounded-lg md:border bg-white h-auto md:h-20 lg:h-24 flex">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-gray-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <BrainIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] --xs text-gray-500">Average Rating</p>
              <h2 className="text-base font-semibold">{stats.averageRating}</h2>
              <p className="text-[14px] --10px text-green-500">+25 point this month</p>
            </div>
          </div>
        </Card>

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
              <p className="text-[14px] --10px text-purple-300">Current streak</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Time Control Performance
export const TimeControlPerformance: React.FC<{
  performanceData: any[];
}> = ({ performanceData }) => {
  const maxGames = Math.max(
    ...(performanceData.map((item) => item.games) || [500])
  );

  return (
    <div className="md:p-4 rounded-lg">
      <h1 className="text-base font-medium mb-3">Time Control Performance</h1>
      <div className="space-y-4">
        {performanceData.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">{item.category}</span>
              <span className="text-gray-600 text-[14px] --sm">{item.games} games</span>
            </div>

            <div className="relative h-2 w-full">
              <div className="absolute h-2 w-full bg-gray-200 rounded-full"></div>
              <div
                className="absolute h-2 bg-blue-500 rounded-full"
                style={{ width: `${(item.games / maxGames) * 100}%` }}
              ></div>
            </div>

            <div className="w-full flex justify-between">
              <span className="text-[14px] --sm font-medium text-gray-700">
                Win Rate
              </span>
              <span
                className={`ml-2 text-[14px] --sm font-medium ${
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
  );
};

// Achievement Icon Component
const AchievementIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "trophy":
      return <Trophy className="h-6 w-6 text-yellow-500" fill="#eab308" />;
    case "swords":
      return <Swords className="h-6 w-6 text-blue-500" fill="#3b82f6" />;
    default:
      return <TimerIcon className="h-6 w-6 text-green-500" />;
  }
};

// Recent Achievements
export const RecentAchievements: React.FC<{
  achievements: string[];
}> = ({ achievements }) => {
  return (
    <div className="md:p-4 rounded-lg ">
      <h1 className="text-base font-medium mb-3">Recent Achievements</h1>
      <div className="space-y-3">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => {
            const { icon, title, description } =
              getAchievementDetails(achievement);

            return (
              <Card
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg shadow-sm md:shadow md:border bg-white"
              >
                <div className="h-12 w-12 flex justify-center items-center bg-yellow-100 rounded-full">
                  <AchievementIcon type={icon} />
                </div>
                <div className="space-y-1">
                  <h1 className="font-bold">{title}</h1>
                  <p className="text-[14px] --xs">{description}</p>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center text-gray-500 p-4">
            No achievements yet
          </div>
        )}
      </div>
    </div>
  );
};
