import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RefreshCw } from "lucide-react";
import { RatingProgressItem } from "@/components/game-history/types/GameHistoryTypes";

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: any;
    payload: RatingProgressItem;
  }[];
  label?: string;
}

// Custom tooltip component for the line chart
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
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

interface RatingProgressChartProps {
  ratingData: RatingProgressItem[];
  isCacheValid: boolean;
  handleForceRefresh: () => void;
}

const RatingProgressChart: React.FC<RatingProgressChartProps> = ({
  ratingData,
  isCacheValid,
  handleForceRefresh,
}) => {
  return (
    <div className="md:p-4 rounded-lg md:shadow-sm">
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
            <XAxis dataKey="minute" axisLine={true} tickLine={true} />
            <YAxis
              domain={[1000, 2000]}
              ticks={[1000, 1200, 1400, 1600, 1800, 2000]}
              axisLine={true}
              tickLine={true}
            />
            <Tooltip content={<CustomTooltip />} />
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

export default RatingProgressChart;
