import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  setSelectedTimeframe: (value: string) => void;
  customTimeframe: { duration: number; unit: "days" | "weeks" | "months" };
  setCustomTimeframe: (value: {
    duration: number;
    unit: "days" | "weeks" | "months";
  }) => void;
  currentElo?: string;
  labelText?: string;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  setSelectedTimeframe,
  customTimeframe,
  setCustomTimeframe,
  currentElo,
  labelText,
}) => {
  // Determine what type of data we're showing based on the passed value and labelText
  const getValueType = () => {
    if (labelText) return labelText;
    if (currentElo?.includes("%")) return "Accuracy";
    return "ELO Rating";
  };

  return (
    <div className="mb-6">
      {currentElo && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[14px] --xs">
            4
          </div>
          <Label htmlFor="timeframe-select" className="font-medium">
            In which timeframe would you like to achieve your Goal?
          </Label>
        </div>
      )}
      <div className="relative border border-gray-300 rounded-md">
        <select
          id="timeframe-select"
          className="w-full p-3 bg-white rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
        >
          <option value="" disabled>
            Select...
          </option>
          <option value="1-month">1 Month</option>
          <option value="3-months">3 Months</option>
          <option value="6-months">6 Months</option>
          <option value="1-year">1 Year</option>
          <option value="custom">Custom Timeframe</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {selectedTimeframe === "custom" && (
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={customTimeframe.duration}
            onChange={(e) =>
              setCustomTimeframe({
                ...customTimeframe,
                duration: parseInt(e.target.value) || 1,
              })
            }
            className="w-24"
          />
          <select
            value={customTimeframe.unit}
            onChange={(e) =>
              setCustomTimeframe({
                ...customTimeframe,
                unit: e.target.value as "days" | "weeks" | "months",
              })
            }
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TimeframeSelector;
