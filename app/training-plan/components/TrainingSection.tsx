import React, { useRef } from "react";
import TrainingTopicCard from "./TrainingTopicCard";
import Image from "next/image";
import { motion } from "framer-motion";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const iconSrc =
    typeof icon === "string" ? icon : "/training-plan/default.png";

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Image
            src={iconSrc}
            alt={title}
            width={50}
            height={50}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[50px] lg:h-[50px]"
          />
          <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        </div>
        <div className="text-black text-xs sm:text-sm font-medium">
          Estimated total duration per day:{" "}
          <span className="text-blue-800 font-bold">{duration}</span>
        </div>
      </div>

      <div className="border-lightsky-blue-base border bg-[#E6F7FE] p-2 sm:p-3 rounded-lg mb-4 text-gray-800 text-sm sm:text-base">
        <p>{instruction}</p>
      </div>

      {topics.length > 0 ? (
        <div className="overflow-hidden">
          <motion.div
            ref={scrollRef}
            className="flex gap-4 w-full no-scrollbar cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            onDrag={(_, info) => {
              if (scrollRef.current) {
                scrollRef.current.scrollLeft -= info.delta.x;
              }
            }}
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex-shrink-0 min-w-[200px] sm:min-w-[250px] max-w-[250px] sm:max-w-[300px]"
              >
                <TrainingTopicCard topic={topic} icon={iconSrc} />
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm sm:text-base">
          No topics available for this section.
        </div>
      )}
    </div>
  );
};

export default TrainingSection;
