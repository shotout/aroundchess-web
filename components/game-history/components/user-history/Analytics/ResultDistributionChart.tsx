import { ResultDistributionItem } from "@/components/game-history/types/GameHistoryTypes";
import React, { useState, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MobileTooltip } from "../Analytics";
import { Info } from "lucide-react";

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

  const handleMouseEnter = useCallback(() => {
    setTooltipVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltipVisible(false);
    setActiveIndex(null);
  }, []);

  const handleTouchStart = useCallback(() => {
    setTooltipVisible(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => {
      setTooltipVisible(false);
      setActiveIndex(null);
    }, 100);
  }, []);

  const handlePieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
    setTooltipVisible(true);
  }, []);

  const handlePieLeave = useCallback(() => {
    if (!("ontouchstart" in window)) {
      setActiveIndex(null);
      setTooltipVisible(false);
    }
  }, []);

  return (
    <div className="md:p-4 rounded-lg">
      <div className="flex items-center justify-between">
      <h1 className="text-base font-medium">Result Distribution</h1>
        <MobileTooltip
         content={[
            "**Wins =** counts the number of games won by the player, whether playing as White or Black.",
            "**Draws =** calculates the total number of games that ended in a draw from all available games.",
            "**Losses =** totalGames - wins - draws.",
          ]}
          side="bottom"
          >
          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </MobileTooltip>
          </div>
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
