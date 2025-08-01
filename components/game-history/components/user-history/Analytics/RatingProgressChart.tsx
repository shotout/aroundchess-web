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
import {  Info } from "lucide-react";
import { RatingProgressItem } from "@/components/game-history/types/GameHistoryTypes";
import { MobileTooltip } from "../Analytics";

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
  isCacheValid?: boolean;
  handleForceRefresh?: () => void;
}

const RatingProgressChart: React.FC<RatingProgressChartProps> = ({
  ratingData,
}) => {
  
  const cleanData = React.useMemo(() => {
    if (!ratingData || !Array.isArray(ratingData)) {
      return [];
    }
    
    return ratingData.map((item, index) => {
      let cleanMonth = item.month;
      let cleanRating = item.rating;
      
      if (
        typeof item.rating === 'object' &&
        item.rating !== null &&
        'month' in item.rating
      ) {

        cleanMonth = (item.rating as { month?: string }).month || item.month || `Month ${index + 1}`;
        cleanRating = (item.rating as { rating?: number; value?: number }).rating || (item.rating as { value?: number }).value || 0;
      }
      
      const numericRating = typeof cleanRating === 'number' ? 
        cleanRating : 
        (parseInt(String(cleanRating)) || 0);
      
      
      return {
        month: cleanMonth,
        rating: numericRating
      };
    });
  }, [ratingData]);

const chartRange = React.useMemo(() => {
  if (cleanData.length === 0) {
    const defaultValues = [800, 1000];
    const minValue = Math.min(...defaultValues);
    const maxValue = Math.max(...defaultValues);
    const adjustedMin = Math.max(minValue - 200, 0);
    const adjustedMax = maxValue + 200;
    
    return {
      min: adjustedMin,
      max: adjustedMax
    };
  }

  const values = cleanData.map(item => item.rating).filter(r => r > 0);
  
  if (values.length === 0) {
    const defaultValues = [800, 1000];
    const minValue = Math.min(...defaultValues);
    const maxValue = Math.max(...defaultValues);
    const adjustedMin = Math.max(minValue - 200, 0);
    const adjustedMax = maxValue + 200;
    
    return {
      min: adjustedMin,
      max: adjustedMax
    };
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const adjustedMin = Math.max(minValue - 200, 0);
  const adjustedMax = maxValue + 200;
  
  return {
    min: adjustedMin,
    max: adjustedMax
  };
}, [cleanData]);

  if (!cleanData || cleanData.length === 0) {
    return (
      <div className="md:p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-base font-medium">Rating Progress</h1>
          <MobileTooltip
            content={[
            "**Rating =** represents the change in a player's average rating from month to month, which can be  used to display a visual graph or performance history.",
          ]}
            side="left"
          >
            <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </MobileTooltip>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No rating data available
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-base font-medium">Rating Progress</h1>
        <MobileTooltip
           content={[
            "**Rating =** represents the change in a player's average rating from month to month, which can be  used to display a visual graph or performance history.",
          ]}
          side="left"
        >
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </MobileTooltip>
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
              tickFormatter={(value) => `${value}`}
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