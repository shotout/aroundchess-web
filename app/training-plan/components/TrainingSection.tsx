import React from "react";
import TrainingTopicCard from "./TrainingTopicCard";
import Image from "next/image";

interface Topic {
  id: string;
  title: string;
  difficulty?: string;
  level?: string;
  category?: string;
}

interface TrainingSectionProps {
  icon: string | React.ReactNode;
  title: string;
  duration: string;
  instruction: string;
  topics: Topic[];
}

const TrainingSection: React.FC<TrainingSectionProps> = ({
  icon,
  title,
  duration,
  instruction,
  topics = [],
}) => {
  const iconSrc =
    typeof icon === "string" ? icon : "/training-plan/default.png";

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Image
            src={iconSrc}
            alt={title}
            width={34}
            height={32}
            className="lg:w-[34px] lg:h-[32px]"
          />
          <h3 className="text-[16px] font-semibold">{title}</h3>
        </div>
        <div className="text-black text-xs sm:text-[14px] font-medium">
          Estimated total duration per day:{" "}
          <span className="text-blue-800 font-bold">{duration}</span>
        </div>
      </div>

      <div className="border-lightsky-blue-base border bg-[#E6F7FE] p-2 sm:p-3 rounded-lg mb-4 text-gray-800 sm:text-[14px]">
        <p>{instruction}</p>
      </div>

      {topics.length > 0 ? (
        <div
          className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex-shrink-0 min-w-[200px] sm:max-w-[300px]"
            >
              <TrainingTopicCard topic={topic} icon={iconSrc} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-[14px]">
          No topics available for this section.
        </div>
      )}
    </div>
  );
};

export default TrainingSection;
