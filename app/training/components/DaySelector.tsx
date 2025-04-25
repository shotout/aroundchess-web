import React from "react";
import { DaySelectorProps } from "./types";

const DaySelector: React.FC<DaySelectorProps> = ({
  day,
  isActive,
  onSelect,
}) => {
  const activeClasses = isActive
    ? "bg-blue-base/5 text-black border-blue-base"
    : "text-gray-700 border-gray-200";

  return (
    <button
      className={`flex flex-col items-center justify-center h-24 flex-1 px-2 py-4 rounded-lg border ${activeClasses} transition-colors`}
      onClick={onSelect}
    >
      <div
        className={`font-bold text-sm ${
          isActive
            ? "text-white bg-blue-base rounded-full w-8 h-8 flex items-center justify-center"
            : ""
        } `}
      >
        {day.date}
      </div>
      <div className="text-sm mt-2">{day.name}</div>
    </button>
  );
};

export default DaySelector;
