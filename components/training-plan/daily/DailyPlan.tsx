import React from "react";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  CircleDot,
  Target,
  Clock3,
  Users,
  Settings,
  BrainIcon,
  TargetIcon,
  TrendingUp,
  LucideTrophy,
  WatchIcon,
  Check,
  TriangleAlert,
} from "lucide-react";

const DailyPlan = () => {
  const trainingTasks = [
    {
      title: "Tactical Puzzles",
      tag: "Tactics",
      description:
        "Solve 20 tactical puzzles focusing on pin and fork patterns",
      duration: "30 minutes",
      completed: true,
    },
    {
      title: "Opening Study",
      tag: "Opening",
      description: "Review and practice Sicilian Defense main lines",
      duration: "45 minutes",
      completed: true,
    },
    {
      title: "Practice Games",
      tag: "Games",
      description: "Play 3 rapid games (15+10) applying opening knowledge",
      duration: "60 minutes",
      completed: true,
    },
    {
      title: "Finalize Games",
      tag: "Games",
      description: "Play 3 rapid games (15+10) applying opening knowledge",
      duration: "60 minutes",
      completed: false,
    },
    {
      title: "Endgame Training",
      tag: "Endgame",
      description: "Play 3 rapid games (15+10) applying opening knowledge",
      duration: "60 minutes",
      completed: true,
    },
  ];

  // Calculate completion percentage
  const completedTasks = trainingTasks.filter((task) => task.completed).length;
  const completionPercentage = Math.round(
    (completedTasks / trainingTasks.length) * 100
  );

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
      title: "Games Won",
      value: "65",
      trend: "+5%",
      trendColor: "text-green-500",
      icon: <LucideTrophy className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Accuracy",
      value: "82%",
      trend: "+3%",
      trendColor: "text-game-green",
      icon: <TargetIcon className="h-6 w-6 text-blue-base" />,
    },
    {
      title: "Mistakes",
      value: "15",
      trend: "-20%",
      trendColor: "text-yellow-500",
      icon: <TriangleAlert className="h-6 w-6 text-yellow-500" />,
    },
    {
      title: "Blunders",
      value: "8",
      trend: "-30%",
      trendColor: "text-red-500",
      icon: <TriangleAlert className="h-6 w-6 text-red-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
      {/* Left Column (Today's Training) - 60% width on larger screens */}
      <div className="md:col-span-6 flex flex-col md:p-4 rounded-lg md:shadow-md md:border md:border-primary-gray">
        {/* Today's Training Section */}
        <div className="">
          {/* Header with completion status */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-bold text-sm">
              Today's Training{" "}
              <span className="text-gray-500 font-normal text-[10px]">
                {"(Thursday, 27 February 2025)"}
              </span>
            </h1>
            <span className="text-blue-base font-medium text-xs">
              {completionPercentage}% completed
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-4 w-full mb-2 rounded-full overflow-hidden">
            <TargetIcon className="absolute h-3 w-full bg-blue-100 rounded-full" />
            <div
              className="absolute h-3 bg-blue-base rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Training tasks */}
          <div className="space-y-3">
            {trainingTasks.map((task, index) => (
              <Card
                key={index}
                className="px-4 py-3 min-h-28 border rounded-lg"
              >
                <div className="flex justify-between">
                  <div className="flex gap-x-4 ">
                    {/* Blue circle dot on the left */}
                    <div className="flex items-center">
                      <TargetIcon className="h-8 w-8 text-blue-base" />
                    </div>

                    {/* Content in the middle */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 mb-1">
                        <h2 className="font-semibold text-sm">{task.title}</h2>
                        <span className="text-xs text-blue-base border border-blue-base rounded-[2px] px-2 py-0.5">
                          {task.tag}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mb-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <WatchIcon className="h-4 w-4" />
                        <span>{task.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkmark on the right */}
                  <div className="flex items-center ml-2">
                    {task.completed ? (
                      <Check className="h-6 w-6 p-[2px] text-white bg-green-500 rounded-full" />
                    ) : (
                      <Check className="h-6 w-6 p-[2px] text-white bg-primary-gray rounded-full" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
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

        {/* Performance Trends Section */}
        <div className="w-full">
          <h1 className="text-base font-bold mb-2">Performance Trends</h1>
          <h1 className="text-xs mb-3">Last 7 days improvement</h1>
          <div className="grid grid-cols-2 gap-3 w-full">
            {keyStats.map((stat, index) => (
              <Card key={index} className="p-3 rounded-lg border bg-white">
                {/* Mobile View - Original horizontal layout */}
                <div className="flex items-center gap-3 md:hidden">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <h2 className="text-xl font-semibold">{stat.value}</h2>
                    {stat.trend && (
                      <p className={`text-sm ${stat.trendColor}`}>
                        {stat.trend}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tablet and Desktop View - New centered layout */}
                <div className="hidden md:flex md:flex-col md:items-start">
                  {/* Icon at the top and centered */}
                  {index === 0 && (
                    <LucideTrophy className="h-6 w-6 text-green-500 mb-2" />
                  )}
                  {index === 1 && (
                    <TargetIcon className="h-6 w-6 text-blue-600 mb-2" />
                  )}
                  {index === 2 && (
                    <TriangleAlert className="h-6 w-6 text-yellow-500 mb-2" />
                  )}
                  {index === 3 && (
                    <TriangleAlert className="h-6 w-6 text-red-500 mb-2" />
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

export default DailyPlan;
