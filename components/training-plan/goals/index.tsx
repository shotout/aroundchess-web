import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  PuzzleIcon,
  Calendar,
  CheckCircle,
  LucideTrophy,
  TargetIcon,
  BrainIcon,
  TrendingUp,
  Users,
  Clock3,
  Settings,
  Check,
  WatchIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";

// Sample training goals data
const trainingGoalsData = [
  {
    id: 1,
    title: "Reach 2000 ELO Rating",
    icon: "trophy",
    progress: 75,
    metric: "2000 rating",
    date: "2025-02-27",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Reach 80% Accuracy",
    icon: "target",
    progress: 0,
    metric: "Accuracy",
    date: "2025-02-27",
    status: "not-started",
  },
  {
    id: 3,
    title: "Solve 500 Puzzles",
    icon: "puzzle",
    progress: 80,
    metric: "500 puzzles",
    date: "2025-02-27",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Solve 500 Puzzles",
    icon: "puzzle",
    progress: 80,
    metric: "500 puzzles",
    date: "2025-02-27",
    status: "in-progress",
  },
  {
    id: 5,
    title: "Solve 500 Puzzles",
    icon: "puzzle",
    progress: 80,
    metric: "500 puzzles",
    date: "2025-02-27",
    status: "in-progress",
  },
  {
    id: 6,
    title: "Master Queen's Gambit",
    icon: "puzzle",
    progress: 60,
    metric: "Opening mastery",
    date: "2025-03-15",
    status: "in-progress",
  },
  {
    id: 7,
    title: "Analyze 50 Games",
    icon: "target",
    progress: 40,
    metric: "Game analysis",
    date: "2025-03-30",
    status: "in-progress",
  },
];

// Performance metrics data
const metrics = [
  {
    title: "Tactical Accuracy",
    icon: <Target className="h-5 w-5 text-green-500" />,
    current: 85,
    target: 90,
    color: "blue",
  },
  {
    title: "Opening Proficiency",
    icon: <Settings className="h-5 w-5 text-blue-600" />,
    current: 50,
    target: 75,
    color: "blue",
  },
  {
    title: "Time Management",
    icon: <Clock3 className="h-5 w-5 text-yellow-500" />,
    current: 85,
    target: 90,
    color: "blue",
  },
  {
    title: "Endgame Technique",
    icon: <Users className="h-5 w-5 text-purple-500" />,
    current: 85,
    target: 90,
    color: "blue",
  },
];

// Key statistics data
const keyStats = [
  {
    title: "Total Games",
    value: "1,234",
    trend: "+45 this month",
    trendColor: "text-green-500",
    icon: <LucideTrophy className="h-6 w-6 text-yellow-500" fill="#eab308" />,
  },
  {
    title: "Win Rate",
    value: "65%",
    trend: "+5%",
    trendColor: "text-game-green",
    icon: <TargetIcon className="h-6 w-6 text-game-green" />,
  },
  {
    title: "Average Rating",
    value: "1,850",
    trend: "+25 points",
    trendColor: "text-green-500",
    icon: <BrainIcon className="h-6 w-6 text-blue-base" />,
  },
  {
    title: "Longest Streak",
    value: "8 wins",
    trend: "",
    trendColor: "",
    icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
  },
];

// Helper function to get the appropriate icon
interface IconProps {
  className: string;
}

type IconType = "trophy" | "target" | "puzzle";

const getIcon = (iconType: IconType): React.ReactElement<IconProps> => {
  switch (iconType) {
    case "trophy":
      return <Trophy className="h-4 w-4 text-blue-base" />;
    case "target":
      return <Target className="h-4 w-4 text-blue-base" />;
    case "puzzle":
      return <PuzzleIcon className="h-4 w-4 text-blue-base" />;
    default:
      return <Trophy className="h-4 w-4 text-blue-base" />;
  }
};

const TrainingGoals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("Soonest due date");
  const [goals, setGoals] = useState(trainingGoalsData);

  // Calculate pagination values
  const totalPages = Math.ceil(goals.length / itemsPerPage);
  const indexOfLastGoal = currentPage * itemsPerPage;
  const indexOfFirstGoal = indexOfLastGoal - itemsPerPage;
  const currentGoals = goals.slice(indexOfFirstGoal, indexOfLastGoal);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sort order change
  useEffect(() => {
    let sortedGoals = [...trainingGoalsData];

    if (sortOrder === "Soonest due date") {
      sortedGoals.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (sortOrder === "Highest progress") {
      sortedGoals.sort((a, b) => b.progress - a.progress);
    } else if (sortOrder === "Lowest progress") {
      sortedGoals.sort((a, b) => a.progress - b.progress);
    }

    setGoals(sortedGoals);
    setCurrentPage(1); // Reset to first page when sort changes
  }, [sortOrder]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
      {/* Left Column (Training Goals) - 60% width on larger screens */}
      <div className="md:col-span-6 flex flex-col md:p-4 rounded-lg md:shadow-md md:border md:border-primary-gray">
        {/* Training Goals Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-base">Training Goals </h2>
            <p className="text-xs max-w-40 text-gray-600">
              Set and track your chess improvement goals
            </p>
          </div>
          <div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-48 border rounded-md bg-gray-primary text-xs">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2 text-xs">Order:</span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white text-nowrap">
                <SelectItem value="Soonest due date">
                  Soonest due date
                </SelectItem>
                <SelectItem value="Highest progress">
                  Highest progress
                </SelectItem>
                <SelectItem value="Lowest progress">Lowest progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Training Goal Cards */}
        <div className="space-y-3 mb-4">
          {currentGoals.map((goal) => (
            <Card key={goal.id} className="px-4 py-3 border rounded-lg">
              <div className="flex flex-col">
                {/* Goal header */}
                <div className="flex gap-x-2 items-center mb-3">
                  <div className="flex items-center">
                    <TargetIcon className="h-4 w-4 text-blue-base" />
                  </div>
                  <h3 className="text-sm font-semibold">{goal.title}</h3>
                </div>

                {/* Progress bar and button in same line */}
                <div className="flex items-center w-full justify-between">
                  <div className="w-[70%]">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs">Progress</p>
                      <div className="flex items-center">
                        <span className="text-xs font-medium mr-1">
                          {goal.progress}%
                        </span>
                        {goal.progress === 100 ? (
                          <Check className="h-4 w-4 p-[1px] text-white bg-green-500 rounded-full" />
                        ) : (
                          <Check className="h-4 w-4 p-[1px] text-white bg-primary-gray rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="relative h-4 w-full rounded-full overflow-hidden">
                      <div className="absolute h-full w-full bg-blue-100 rounded-full" />
                      <div
                        className="absolute h-full bg-blue-base rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-[25%]">
                    <button className="px-4 py-2 rounded-md text-xs text-blue-base w-full btn-tertiary">
                      {goal.status === "not-started" ? "Start" : "Resume"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 w-[70%]">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{goal.metric}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WatchIcon className="h-4 w-4" />
                    <span>{goal.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto">
          <div className="flex items-center mb-3 sm:mb-0">
            <span className="text-xs text-gray-600 mr-2">Goals per Page</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-16 border rounded-md bg-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-1"
            >
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show based on current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={i}
                  variant="ghost"
                  onClick={() => goToPage(pageNum)}
                  className={`h-8 w-8 p-0 mx-1 flex items-center justify-center ${
                    currentPage === pageNum
                      ? "bg-blue-100 text-blue-600 rounded-md"
                      : "text-gray-500"
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="ghost"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-1"
            >
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column (Performance Metrics and Key Statistics) - 40% width on larger screens */}
      <div className="md:col-span-4 flex flex-col gap-6 md:border md:shadow-md md:border-primary-gray md:p-4 rounded-md w-full">
        {/* Performance Metrics Section */}
        <div className="w-full">
          <div className="mb-2">
            <h1 className="font-bold text-base">Performance Metrics</h1>
            <p className="text-xs text-gray-600">
              Track your progress across different aspects
            </p>
          </div>

          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className="px-4 py-3 border rounded-lg flex items-center"
              >
                <div className="mr-3 bg-gray-100 rounded-full h-10 w-10 min-w-10 flex justify-center items-center">
                  {metric.icon}
                </div>

                <div className="flex flex-col items-center justify-between w-full">
                  <div className="flex items-center justify-between w-full mb-2">
                    <h2 className="font-semibold text-sm">{metric.title}</h2>
                    <div className="text-xs">
                      <span className="font-semibold">{metric.current}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${metric.current}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between w-full mt-1 text-xs">
                    <div>
                      Current:{" "}
                      <span className="font-semibold text-green-500">
                        {metric.current}%
                      </span>
                    </div>
                    <div>
                      Target:{" "}
                      <span className="font-semibold text-green-500">
                        {metric.target}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Statistics Section */}
        <div className="w-full">
          <h1 className="text-base font-bold mb-2">Performance Trends</h1>
          <h1 className="text-xs mb-3">Monthly improvement</h1>
          <div className="grid grid-cols-2 gap-3 w-full">
            {keyStats.map((stat, index) => (
              <Card key={index} className="p-3 rounded-lg border bg-white">
                {/* Mobile View - Original horizontal layout */}
                <div className="flex items-center gap-3 md:hidden">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs text-gray-500">{stat.title}</p>
                    <h2 className="text-base font-semibold">{stat.value}</h2>
                    {stat.trend && (
                      <p className={`text-[10px] ${stat.trendColor}`}>
                        {stat.trend}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tablet and Desktop View - New centered layout */}
                <div className="hidden md:flex md:flex-col md:items-start">
                  {/* Icon at the top */}
                  {index === 0 && (
                    <LucideTrophy
                      className="h-6 w-6 text-yellow-500 mb-2"
                      fill="#eab308"
                    />
                  )}
                  {index === 1 && (
                    <TargetIcon className="h-6 w-6 text-game-green mb-2" />
                  )}
                  {index === 2 && (
                    <BrainIcon className="h-6 w-6 text-blue-base mb-2" />
                  )}
                  {index === 3 && (
                    <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
                  )}

                  {/* Value in the middle, large and bold */}
                  <h2 className="text-xl font-semibold mb-1">{stat.value}</h2>

                  {/* Title below the value */}
                  <p className="text-xs text-gray-500 mb-1">{stat.title}</p>

                  {/* Trend at the bottom */}
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
  );
};

export default TrainingGoals;
