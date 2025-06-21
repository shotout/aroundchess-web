import { ResultDistributionItem } from "@/components/game-history/types/GameHistoryTypes";
import React, { useState, useCallback } from "react";
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
      <div className="bg-white p-3 border border-gray-200 rounded-lg flex gap-x-2 shadow-lg pointer-events-none">
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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Handle mouse events for desktop
  const handleMouseEnter = useCallback(() => {
    setTooltipVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipVisible(false);
    setActiveIndex(null);
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = useCallback(() => {
    setTooltipVisible(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Add a small delay to prevent immediate hiding on touch
    setTimeout(() => {
      setTooltipVisible(false);
      setActiveIndex(null);
    }, 100);
  }, []);

  // Handle pie slice hover/touch
  const handlePieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
    setTooltipVisible(true);
  }, []);

  const handlePieLeave = useCallback(() => {
    // Don't immediately hide on pie leave for mobile compatibility
    if (!("ontouchstart" in window)) {
      setActiveIndex(null);
      setTooltipVisible(false);
    }
  }, []);

  return (
    <div className="md:p-4 rounded-lg">
      <h1 className="text-base font-medium mb-2">Result Distribution</h1>
      <div className="flex items-center justify-center h-64">
        <div
          className="w-48 h-48"
          style={{
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            KhtmlUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
            touchAction: "manipulation",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
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
                style={{
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                }}
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      outline: "none",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip data={distributionData} />}
                active={tooltipVisible}
                wrapperStyle={{
                  pointerEvents: "none",
                  zIndex: 1000,
                }}
                animationDuration={0}
                isAnimationActive={false}
              />
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
