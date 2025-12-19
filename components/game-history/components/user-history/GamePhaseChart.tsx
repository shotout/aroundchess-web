import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Info } from "lucide-react";
import { MobileTooltip } from "./Analytics";

interface GamePhaseData {
  name?: string;
  performance?: number;
  average?: number;
}

interface GamePhaseChartProps {
  barData?: GamePhaseData[];
  isCacheValid: boolean;
  onRefresh: () => void;
}

const GamePhaseChart: React.FC<GamePhaseChartProps> = ({
  barData,
  isCacheValid,
  onRefresh,
}) => {
  const [barSize, setBarSize] = useState(20);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [hideTooltipTimeout, setHideTooltipTimeout] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      const hasTouchScreen = "ontouchstart" in window;
      const hasSmallScreen = window.innerWidth <= 768;
      setIsMobileDevice(hasTouchScreen || hasSmallScreen);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTooltipTimeout) {
        clearTimeout(hideTooltipTimeout);
      }
    };
  }, [hideTooltipTimeout]);

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

  const handleMouseEnter = useCallback(() => {
    if (isMobileDevice) {
      if (hideTooltipTimeout) {
        clearTimeout(hideTooltipTimeout);
        setHideTooltipTimeout(null);
      }
      setTooltipVisible(true);
    }
  }, [isMobileDevice, hideTooltipTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (isMobileDevice) {
      const timeout = setTimeout(() => {
        setTooltipVisible(false);
      }, 150);
      setHideTooltipTimeout(timeout);
    }
  }, [isMobileDevice]);

  const handleTouchStart = useCallback(() => {
    if (isMobileDevice) {
      if (hideTooltipTimeout) {
        clearTimeout(hideTooltipTimeout);
        setHideTooltipTimeout(null);
      }
      setTooltipVisible(true);
    }
  }, [isMobileDevice, hideTooltipTimeout]);

  const handleTouchEnd = useCallback(() => {
    if (isMobileDevice) {
      const timeout = setTimeout(() => {
        setTooltipVisible(false);
      }, 1000); 
      setHideTooltipTimeout(timeout);
    }
  }, [isMobileDevice]);

  const handleContainerLeave = useCallback(() => {
    if (isMobileDevice) {
      if (hideTooltipTimeout) {
        clearTimeout(hideTooltipTimeout);
        setHideTooltipTimeout(null);
      }
      setTooltipVisible(false);
    }
  }, [isMobileDevice, hideTooltipTimeout]);

  const tooltipProps = isMobileDevice
    ? {
        active: tooltipVisible,
        wrapperStyle: {
          pointerEvents: "none" as const,
          zIndex: 1000,
        },
        animationDuration: 0,
        isAnimationActive: false,
      }
    : {};

  const mobileStyles: React.CSSProperties = {
    WebkitTapHighlightColor: "transparent",
    WebkitTouchCallout: "none" as any,
    WebkitUserSelect: "none",
    userSelect: "none",
    touchAction: "manipulation",
  };

  const barChartProps = isMobileDevice
    ? {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }
    : {};

  return (
    <div className="lg:p-4 rounded-lg w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold">Performance by Game Phase</h1>
          <MobileTooltip
          content={[
            "**Performance by Game Phase**",
            "Shows your performance score for each chess phase (opening, middlegame, endgame, tactics, strategy). Scores are calculated using phase-specific win rates when you have at least 3 games in that phase, otherwise uses overall win rate.",
          ]}
            side="left"
          >
            <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </MobileTooltip>
        </div>
      <div
        className="h-72"
        onTouchStart={isMobileDevice ? handleTouchStart : undefined}
        onTouchEnd={isMobileDevice ? handleTouchEnd : undefined}
        onMouseLeave={isMobileDevice ? handleContainerLeave : undefined}
        style={isMobileDevice ? mobileStyles : undefined}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 10, right: 10, bottom: 30, left: -25 }}
            layout="horizontal"
            className="text-[14px] --10px"
            {...barChartProps}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#999" />
            <XAxis
              dataKey="name"
              tick={{ textAnchor: "middle" }}
              height={60}
            />
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
                pointerEvents: isMobileDevice ? "none" : "auto",
              }}
              {...tooltipProps}
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
