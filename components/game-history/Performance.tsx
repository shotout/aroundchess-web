import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Target, BookOpen, Clock, Swords } from "lucide-react";
import { Card } from "../ui/card";

const barData = [
  { name: "Opening", performance: 83, average: 75 },
  { name: "Middlegame", performance: 85, average: 75 },
  { name: "Endgame", performance: 84, average: 75 },
  { name: "Tactics", performance: 86, average: 75 },
  { name: "Strategy", performance: 87, average: 75 },
];

// Dummy data for the radar chart
const radarData = [
  {
    subject: "Calculation",
    A: 85,
    fullMark: 100,
  },
  {
    subject: "Positional",
    A: 80,
    fullMark: 100,
  },
  {
    subject: "Tactical",
    A: 90,
    fullMark: 100,
  },
  {
    subject: "Endgame",
    A: 75,
    fullMark: 100,
  },
  {
    subject: "Time Management",
    A: 70,
    fullMark: 100,
  },
  {
    subject: "Opening Knowledge",
    A: 85,
    fullMark: 100,
  },
];

// Dummy data for strengths and weaknesses
const strengthsData = [
  {
    name: "Tactical Vision",
    value: 92,
    icon: <Target className="text-game-green" size={24} />,
  },
  {
    name: "Opening Preparation",
    value: 88,
    icon: <BookOpen className="text-blue-base" size={24} />,
  },
  {
    name: "Time Management",
    value: 85,
    icon: <Clock className="text-yellow-500" size={24} />,
  },
];

const weaknessesData = [
  {
    name: "Endgame Technique",
    value: 72,
    icon: <Swords className="text-purple-500" size={24} fill="#a855f7" />,
  },
  {
    name: "Positional Play",
    value: 75,
    icon: <Swords className="text-purple-500" size={24} fill="#a855f7" />,
  },
  {
    name: "Defense",
    value: 78,
    icon: <Swords className="text-purple-500" size={24} fill="#a855f7" />,
  },
];

const Performance = () => {
  const [barSize, setBarSize] = useState(20);

  // Effect to update bar size based on screen width
  useEffect(() => {
    const handleResize = () => {
      // Mobile: under 768px keep at 30px
      // Tablet: 768px-1024px set to 40px
      // Desktop: 1024px+ set to 50px
      if (window.innerWidth >= 1024) {
        setBarSize(50); // Desktop
      } else if (window.innerWidth >= 768) {
        setBarSize(30); // Tablet
      } else {
        setBarSize(20); // Mobile (default)
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Dummy data that matches the chart in the image

  return (
    <div className="flex flex-col lg:border lg:rounded-md">
      {/* Performance by Game Phase (Full Width on All Devices) */}
      <div className="lg:p-4 rounded-lg w-full">
        <h1 className="text-base font-bold">Performance by Game Phase</h1>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, bottom: 5, left: -25 }}
              layout="horizontal"
              className="text-[10px]"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#999" />
              <XAxis dataKey="name" tick={{ textAnchor: "middle" }} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                axisLine={true}
                tickLine={true}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value}`,
                  name === "performance" ? "Your Score" : "Average",
                ]}
                labelFormatter={(name) => `${name}:`}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="performance" fill="#221AE9" barSize={barSize} />
              <Bar dataKey="average" fill="#9BB8F5" barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle Row: Skill Analysis + Strengths/Weaknesses side by side on tablet and up */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Skill Analysis */}
        <div className="lg:p-4 rounded-lg">
          <h1 className="text-base font-bold">Skill Analysis</h1>
          <div className="h-80 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="90%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="subject"
                  width={"50px"}
                  className="text-xs"
                  orientation="outer"
                  textAnchor="middle"
                />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#C4CDF9"
                  fill="#3A54E8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="lg:p-4 rounded-lg ">
          <h1 className="mb-2 font-bold text-base">Strength and weakness</h1>
          {/* Strengths */}
          <div className="mb-4">
            <h1 className="text-sm font-medium mb-3">Strengths</h1>
            <div className="space-y-3">
              {strengthsData.map((item, index) => (
                <Card
                  key={index}
                  className="bg-white rounded-lg p-3 flex items-center"
                >
                  <div className="mr-3 bg-gray-100 rounded-full h-10 w-10 min-w-10 flex justify-center items-center">
                    {item.icon}
                  </div>

                  <div className="flex flex-col items-center justify-between mb-2 w-full">
                    <div className="flex items-center justify-between w-full mb-2">
                      <h1 className="font-semibold">{item.name}</h1>
                      <h1 className="font-extralight">{item.value}%</h1>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="mb-5">
            <h1 className="text-sm font-medium mb-3">Areas for Improvement</h1>
            <div className="space-y-3">
              {weaknessesData.map((item, index) => (
                <Card
                  key={index}
                  className="bg-white rounded-lg p-3 flex items-center"
                >
                  <div className="mr-3 bg-gray-100 rounded-full h-10 w-10 min-w-10 flex justify-center items-center">
                    {item.icon}
                  </div>

                  <div className="flex flex-col items-center justify-between mb-2 w-full">
                    <div className="flex items-center justify-between w-full mb-2">
                      <h1 className="font-semibold">{item.name}</h1>
                      <h1 className="font-extralight">{item.value}%</h1>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Recommendations (Full Width) */}
      <div className="lg:p-4 rounded-lg w-full">
        <h1 className="text-base font-bold mb-3">
          Improvement Recommendations
        </h1>

        {/* Sub-chapters: Short-Term Goals and Training Focus side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Short-Term Goals */}
          <Card className="p-3 rounded-lg  md:border bg-white">
            <h1 className="font-bold mb-1">Short-Term Goals</h1>
            <ul className="text-sm text-gray-700 list-disc px-4">
              <li>Practice endgame positions with rook and pawn</li>
              <li>Study positional pawn sacrifices</li>
              <li>Work on defensive techniques</li>
            </ul>
          </Card>

          {/* Training Focus */}
          <Card className="p-3 rounded-lg  md:border bg-white">
            <h1 className="font-bold mb-1">Training Focus</h1>
            <ul className="text-sm text-gray-700 list-disc px-4">
              <li>Endgame studies (40%)</li>
              <li>Positional exercises (35%)</li>
              <li>Defensive puzzles (25%)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Performance;
