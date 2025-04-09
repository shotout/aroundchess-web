import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RefreshCw } from "lucide-react";

interface GamePhaseData {
  name: string;
  performance: number;
  average: number;
}

interface GamePhaseChartProps {
  barData: GamePhaseData[];
  isCacheValid: boolean;
  onRefresh: () => void;
}

const GamePhaseChart: React.FC<GamePhaseChartProps> = ({
  barData,
  isCacheValid,
  onRefresh,
}) => {
  const [barSize, setBarSize] = useState(20);

  // Adjust bar size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setBarSize(50);
      } else if (window.innerWidth >= 768) {
        setBarSize(30);
      } else {
        setBarSize(20);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lg:p-4 rounded-lg w-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-base font-bold">Performance by Game Phase</h1>
        {!isCacheValid && (
          <button
            onClick={onRefresh}
            className="text-blue-500 hover:text-blue-700 flex items-center text-xs"
            title="Refresh data"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </button>
        )}
      </div>
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
  );
};

export default GamePhaseChart;
