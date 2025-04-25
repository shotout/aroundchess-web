// components/TrainingSection.tsx
import React from "react";
import TrainingTopicCard from "./TrainingTopicCard";
import { TrainingSectionProps } from "./types";
import Image from "next/image";

const TrainingSection: React.FC<TrainingSectionProps> = ({
  icon,
  title,
  duration,
  instruction,
  topics,
}) => {
  return (
    <div className="mb-6 border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Image src={icon} alt={icon} width={50} height={50} />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="text-black text-sm font-medium">
          Estimated total duration per day:{" "}
          <span className="text-blue-800 font-bold">{duration}</span>
        </div>
      </div>

      <div className="border-lightsky-blue-base border bg-[#E6F7FE] p-3 rounded-lg mb-4 text-gray-800">
        <p>{instruction}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {topics.map((topic) => (
          <TrainingTopicCard key={topic.id} topic={topic} icon={icon} />
        ))}
      </div>
    </div>
  );
};

export default TrainingSection;
