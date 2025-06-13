import { ResultDistributionItem } from "@/components/game-history/types/GameHistoryTypes";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ResultDistributionChartProps {
  distributionData: ResultDistributionItem[];
}

const CustomTooltip = ({ active, payload, data }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const total = data.reduce(
      (sum: number, entry: ResultDistributionItem) => sum + entry.value,
      0
    );
    const percentage = ((item.value / total) * 100).toFixed(1);

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg flex gap-x-2 shadow-lg cursor-pointer">
        <p className="text-sm text-black">{item.payload.name}</p>
        <p className="text-sm text-black">{percentage}%</p>
      </div>
    );
  }
  return null;
};

const ResultDistributionChart: React.FC<ResultDistributionChartProps> = ({
  distributionData,
}) => {
  return (
    <div className="md:p-4 rounded-lg ">
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
                className="cursor-pointer"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip data={distributionData} />} />
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

export default ResultDistributionChart;
