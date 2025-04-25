// components/TrainingSection.tsx
import React from "react";
import TrainingTopicCard from "./TrainingTopicCard";
import { TrainingSectionProps } from "./types";

const TrainingSection: React.FC<TrainingSectionProps> = ({
  icon,
  title,
  duration,
  instruction,
  topics,
}) => {
  // Define icons for each category
  const getIconForCategory = (category: string) => {
    switch (category) {
      case "whiteOpening":
        return "♙";
      case "blackOpening":
        return "♟";
      case "middlegame":
        return "♗";
      case "endgame":
        return "♔";
      default:
        return "♖";
    }
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 text-blue-700 flex items-center justify-center rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="text-blue-700 text-sm font-medium">
          Estimated total duration per day:{" "}
          <span className="text-blue-800 font-bold">{duration}</span>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-blue-800">
        <p>{instruction}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {topics.map((topic) => (
          <TrainingTopicCard
            key={topic.id}
            topic={topic}
            icon={getIconForCategory(topic.category)}
          />
        ))}
      </div>
    </div>
  );
};

export default TrainingSection;
