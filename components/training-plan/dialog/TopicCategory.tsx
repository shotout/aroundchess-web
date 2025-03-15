import React from "react";
import TopicCard from "./TopicCard";
import { DifficultyLevel, TrainingTopic } from "../data/TrainingData";

interface TopicCategoryProps {
  categoryNumber: string;
  title: string;
  topics: TrainingTopic[];
  selectedTopics: string[];
  toggleTopicSelection: (id: string) => void;
  activeFilter: DifficultyLevel;
  showLimit?: boolean;
}

const TopicCategory: React.FC<TopicCategoryProps> = ({
  categoryNumber,
  title,
  topics,
  selectedTopics,
  toggleTopicSelection,
  activeFilter,
  showLimit = true,
}) => {
  const filteredTopics = topics.filter(
    (topic) => !activeFilter || topic.difficulty === activeFilter
  );

  return (
    <div className="col-span-1 ">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
          {categoryNumber}
        </div>
        <h3 className="text-xs text-nowrap font-medium">{title}</h3>
        {showLimit && (
          <span className="text-[10px] text-gray-500">(select up to 3)</span>
        )}
      </div>
      <div className="border p-4 rounded-lg">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isSelected={selectedTopics.includes(topic.id)}
            onToggle={() => toggleTopicSelection(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicCategory;
