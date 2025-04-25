// components/DaySelector.tsx
import React from "react";
import { DaySelectorProps } from "./types";

const DaySelector: React.FC<DaySelectorProps> = ({
  day,
  isActive,
  onSelect,
}) => {
  const activeClasses = isActive
    ? "bg-blue-600 text-white border-blue-600"
    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200";

  return (
    <button
      className={`flex flex-col items-center justify-center min-w-20 h-16 rounded-lg border ${activeClasses} transition-colors`}
      onClick={onSelect}
    >
      <div className="font-bold text-lg">{day.date}</div>
      <div className="text-sm">{day.name}</div>
    </button>
  );
};

export default DaySelector;
