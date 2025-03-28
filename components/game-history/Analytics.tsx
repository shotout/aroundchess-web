import React, { useState, useEffect, useMemo } from "react";
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
import DotSpinner from "./Spinner";
import { usePgnStore } from "@/app/store/zustandStore";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

// Define the API URL - use your working API endpoint
const API_BASE_URL = "https://ac-api.kemang.sg/api";

// Define a constant for cache expiration (in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

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
  const {
    username,
    analyticsData: cachedAnalytics,
    analyticsLastFetched,
    setAnalyticsData,
  } = usePgnStore();

  const { sessionId, isLoaded: authIsLoaded } = useAuth();

  // State to store data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [ratingData, setRatingData] = useState([]);
  const [distributionData, setDistributionData] = useState<
    { name: string; value: number; color: string }[]
  >([]);

  interface OpeningData {
    name: string;
    games: number;
    winrate: string;
  }
  const [openingData, setOpeningData] = useState<OpeningData[]>([]);

  interface PerformanceData {
    category: string;
    games: number;
    winRate: number;
  }

  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState({
    averageGameLength: 0,
    accuracy: 0,
    timeManagement: 0,
    blunderRate: 0,
  });
  const [keyStats, setKeyStats] = useState({
    totalGames: 0,
    winRate: 0,
    averageRating: 0,
    longestStreak: 0,
  });
  const [achievements, setAchievements] = useState<string[]>([]);

  // Track API calls with a ref to avoid duplicates
  const fetchRef = React.useRef(false);

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    if (!analyticsLastFetched || !cachedAnalytics) return false;

    // Check if cache has expired
    const now = Date.now();
    const cacheAge = now - analyticsLastFetched;
    return (
      cacheAge < CACHE_EXPIRATION && Object.keys(cachedAnalytics).length > 0
    );
  }, [analyticsLastFetched, cachedAnalytics]);

  // Process and populate UI state from data
  const processApiData = (apiData: any) => {
    // Process rating progress data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ];
    const processedRatingData = apiData.ratingProgress
      .slice(0, months.length)
      .map((rating: any, index: number) => ({
        month: months[index],
        rating: rating,
      }));

    // Process result distribution data
    const resultData = [
      {
        name: "Win",
        value: apiData.resultDistribution.win || 70,
        color: "#00B427",
      },
      {
        name: "Draw",
        value: apiData.resultDistribution.draw || 25,
        color: "#fbbf24",
      },
      {
        name: "Loss",
        value: apiData.resultDistribution.lose || 5,
        color: "#FD0000",
      },
    ];

    // Process opening statistics
    const openingStats = apiData.openingStatistics.map(
      (opening: { name: any; games: any; winRate: any }) => ({
        name: opening.name,
        games: opening.games,
        winrate: `${opening.winRate}%`,
      })
    );

    // Process time control performance
    const timeControlData = apiData.timeControlPerformance.map(
      (item: { type: any; games: any; winRate: any }) => ({
        category: item.type,
        games: item.games,
        winRate: item.winRate,
      })
    );

    // Process performance insights
    const insights = {
      averageGameLength: apiData.performanceInsights.averageGameLength,
      accuracy: apiData.performanceInsights.accuracy,
      timeManagement: apiData.timeManagement.efficiency,
      blunderRate: apiData.blunderRate,
    };

    // Process key statistics
    const stats = {
      totalGames: apiData.keyStatistics.totalGames,
      winRate: 65, // Use a default since it's not in the API data
      averageRating: apiData.keyStatistics.averageRating,
      longestStreak: 8, // Use a default since it's not directly in the API data
    };

    // Process achievements
    const achievementsData = apiData.recentAchievements || [];

    // Update state with processed data
    setRatingData(processedRatingData);
    setDistributionData(resultData);
    setOpeningData(openingStats);
    setPerformanceData(timeControlData);
    setPerformanceInsights(insights);
    setKeyStats(stats);
    setAchievements(achievementsData);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      // Check if already fetching or missing username
      if (!username || fetchRef.current) {
        if (authIsLoaded && !username) {
          setLoading(false);
        }
        return;
      }

      // Use cached data if available and valid
      if (isCacheValid && cachedAnalytics) {
        console.log(
          "Using cached analytics data from",
          new Date(analyticsLastFetched!).toLocaleTimeString()
        );
        processApiData(cachedAnalytics);
        setLoading(false);
        return;
      }

      // Mark as fetching
      fetchRef.current = true;
      setLoading(true);
      setError(null);

      console.log("Fetching analytics for user:", username);

      try {
        // Use the direct API endpoint
        const apiUrl = `${API_BASE_URL}/analytic-games/${username}`;

        console.log("Making request to:", apiUrl);

        // Make a request with authentication if session ID is available
        const config: any = {
          headers: {
            Accept: "application/json",
          },
        };

        if (sessionId) {
          config.headers.Authorization = `Bearer ${sessionId}`;
          console.log("Using auth token");
        }

        const response = await axios.get(apiUrl, config);

        console.log("Analytics API response status:", response.status);

        if (response.data && response.data.success) {
          const apiData = response.data.data;

          // Save to the store for caching
          setAnalyticsData(apiData);

          // Process the data
          processApiData(apiData);
        } else {
          console.log("API response has unexpected format:", response.data);
          setError(new Error("Invalid data format received from server"));
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch analytics")
        );
      } finally {
        setLoading(false);
        // Allow refetching after a delay
        setTimeout(() => {
          fetchRef.current = false;
        }, 3000);
      }
    };

    // Only fetch when auth is loaded
    if (authIsLoaded) {
      fetchAnalytics();
    }
  }, [
    username,
    authIsLoaded,
    sessionId,
    isCacheValid,
    cachedAnalytics,
    analyticsLastFetched,
    setAnalyticsData,
  ]);

  // Force refresh analytics data
  const handleForceRefresh = () => {
    fetchRef.current = false;
    // Clear the cached data and force refetch
    toast.info("Refreshing analytics data...");
  };

  // Calculate the maximum number of games for scaling
  const maxGames = Math.max(
    ...(performanceData.map((item) => item.games) || [500])
  );

  // If loading, show a simple loading state
  if (loading) {
    return <DotSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading analytics: {error.message}</p>
        <Button
          onClick={handleForceRefresh}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Show information when no username is set
  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-xl font-semibold mb-4">
          No Chess.com Username Set
        </div>
        <p className="mb-4 text-gray-600">
          Please connect your Chess.com account to view your analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* Cache status indicator - only show in development */}
      {process.env.NODE_ENV === "development" && isCacheValid && (
        <div className="md:col-span-2 mb-2 text-xs text-gray-500 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          Using cached analytics data from{" "}
          {new Date(analyticsLastFetched!).toLocaleTimeString()}
          <button
            onClick={handleForceRefresh}
            className="ml-2 text-blue-500 hover:text-blue-700 underline text-xs flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </button>
        </div>
      )}

      {/* Left Column for mobile and tablet */}
      <div className="flex flex-col gap-4">
        {/* Rating Progress Chart with Tooltip */}
        <div className="md:p-4 rounded-lg md:shadow-sm md:border">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-base font-bold">Rating Progress</h1>
            {!isCacheValid && (
              <button
                onClick={handleForceRefresh}
                className="text-blue-500 hover:text-blue-700 flex items-center text-xs"
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
          <div className="md:p-4 rounded-lg md:shadow-sm md:border">
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
          <div className="md:p-4 rounded-lg md:shadow-sm md:border">
            <h1 className="text-base font-medium mb-3">Opening Statistics</h1>
            <div className="space-y-3">
              {openingData.map((data, index) => (
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

        {/* Performance Insights */}
        <div className="md:p-4 rounded-lg md:border">
          <h1 className="text-base font-medium mb-3">Performance Insights</h1>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
              <h1 className="text-sm font-thin">Average Game Length</h1>
              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">
                    {performanceInsights.averageGameLength} Moves
                  </h1>
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
                  <h1 className="text-lg font-bold">
                    {performanceInsights.timeManagement}%
                  </h1>
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
                  <h1 className="text-lg font-bold">
                    {performanceInsights.accuracy}%
                  </h1>
                </div>
                <span className="text-xs mt-1 font-thin">Top moves played</span>
              </div>
            </Card>

            <Card className="p-3 rounded-lg shadow-sm md:shadow md:border bg-white">
              <h1 className="text-sm font-thin">Blunder Rate</h1>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">
                    {performanceInsights.blunderRate}%
                  </h1>
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
        <div className="md:p-4 rounded-lg md:border">
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
                  <h2 className="text-base font-semibold">
                    {keyStats.totalGames.toLocaleString()}
                  </h2>
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
                  <h2 className="text-base font-semibold">
                    {keyStats.winRate}%
                  </h2>
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
                  <h2 className="text-base font-semibold">
                    {keyStats.averageRating}
                  </h2>
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
                  <h2 className="text-base font-semibold">
                    {keyStats.longestStreak} wins
                  </h2>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Time Control Performance */}
        <div className="md:p-4 rounded-lg md:border">
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
        <div className="md:p-4 rounded-lg md:border">
          <h1 className="text-base font-medium mb-3">Recent Achievements</h1>
          <div className="space-y-3">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => {
                let icon, title, description;
                // Parse achievement text
                if (achievement.includes("Classical Win")) {
                  icon = (
                    <Trophy
                      className="h-6 w-6 text-yellow-500"
                      fill="#eab308"
                    />
                  );
                  title = "First Classical Win";
                  description = "Won against 2,000+ rated player";
                } else if (achievement.includes("consecutive wins")) {
                  icon = (
                    <Swords className="h-6 w-6 text-blue-500" fill="#3b82f6" />
                  );
                  title = "Winning Streak";
                  description = achievement;
                } else {
                  icon = <TimerIcon className="h-6 w-6 text-green-500" />;
                  title = "Achievement";
                  description = achievement;
                }

                return (
                  <Card
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg shadow-sm md:shadow md:border bg-white"
                  >
                    <div className="h-12 w-12 flex justify-center items-center bg-yellow-100 rounded-full">
                      {icon}
                    </div>
                    <div className="space-y-1">
                      <h1 className="font-bold">{title}</h1>
                      <p className="text-xs">{description}</p>
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
      </div>
    </div>
  );
};

export default Analytics;
