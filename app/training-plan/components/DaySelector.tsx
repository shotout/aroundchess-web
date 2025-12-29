import React from "react";
import { DaySelectorProps } from "./types";

const DaySelector: React.FC<DaySelectorProps> = ({
  day,
  isActive,
  onSelect,
  disabled = false,
}) => {
  const activeClasses = isActive
    ? "bg-blue-base/5 text-black border-blue-base"
    : "text-gray-700 border-gray-200";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      className={`flex flex-col items-center justify-center h-24 w-full px-2 py-4 rounded-lg border ${activeClasses} ${disabledClasses} transition-colors`}
      onClick={onSelect}
      disabled={disabled}
    >
      <div
        className={`font-bold text-[14px] --sm ${
          isActive
            ? "text-white bg-blue-base rounded-full w-8 h-8 flex items-center justify-center"
            : ""
        } `}
      >
        {day.date}
      </div>
      <div className="text-[14px] --sm mt-2">{day.name}</div>
    </button>
  );
};

export default DaySelector;
