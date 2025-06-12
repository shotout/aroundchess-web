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
    payload: any;
  }[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    const month = data.month || 'Unknown';
    const rating = data.rating || 'N/A';
    
    return (
      <div className="bg-white p-2 border rounded-md shadow-md">
        <p className="font-semibold">Date: {month}</p>
        <p>Rating: {rating}</p>
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
  
  const cleanData = React.useMemo(() => {
    if (!ratingData || !Array.isArray(ratingData)) {
      return [];
    }
    
    return ratingData.map((item, index) => {
      console.log(`Processing item ${index}:`, item);
      
      let cleanMonth = item.month;
      let cleanRating = item.rating;
      
      if (
        typeof item.rating === 'object' &&
        item.rating !== null &&
        'month' in item.rating
      ) {
        console.log('Rating is object:', item.rating);

        cleanMonth = (item.rating as { month?: string }).month || item.month || `Month ${index + 1}`;
        cleanRating = (item.rating as { rating?: number; value?: number }).rating || (item.rating as { value?: number }).value || 0;
      }
      
      const numericRating = typeof cleanRating === 'number' ? 
        cleanRating : 
        (parseInt(String(cleanRating)) || 0);
      
      console.log(`Cleaned: month=${cleanMonth}, rating=${numericRating}`);
      
      return {
        month: cleanMonth,
        rating: numericRating
      };
    });
  }, [ratingData]);

  const chartRange = React.useMemo(() => {
    if (cleanData.length === 0) {
      return {
        min: 400,
        max: 1200,
        ticks: [400, 600, 800, 1000, 1200]
      };
    }

    const ratings = cleanData.map(item => item.rating).filter(r => r > 0);
    
    if (ratings.length === 0) {
      return {
        min: 400,
        max: 1200,
        ticks: [400, 600, 800, 1000, 1200]
      };
    }

    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);
    
    const minY = Math.max(0, Math.floor(minRating / 200) * 200 - 200);
    const maxY = Math.ceil(maxRating / 200) * 200 + 400;
    
    const ticks = [];
    for (let i = minY; i <= maxY; i += 200) {
      ticks.push(i);
    }
    
    return {
      min: minY,
      max: maxY,
      ticks: ticks
    };
  }, [cleanData]);

  if (!cleanData || cleanData.length === 0) {
    return (
      <div className="md:p-4 rounded-lg">
        <h1 className="text-base font-bold mb-2">Rating Progress</h1>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No rating data available
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-4 rounded-lg">
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
            data={cleanData}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="5 5"
              stroke="#999"
              vertical={true}
            />
            <XAxis 
              dataKey="month" 
              axisLine={true} 
              tickLine={true} 
            />
            <YAxis
              domain={[chartRange.min, chartRange.max]}
              ticks={chartRange.ticks}
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