// components/TopicSelectionSection.tsx
import React from "react";
import IndividualTrainingTopic from "./IndividualTrainingTopic";
import { TopicSelectionSectionProps } from "./types";

const TopicSelectionSection: React.FC<TopicSelectionSectionProps> = ({
  categoryId,
  title,
  icon,
  description,
  subcategories = [],
  topics,
  selectedTopics,
  onToggleTopic,
}) => {
  // Filter topics by category
  const getTopicsBySubcategory = (subcategoryId: string) => {
    return topics.filter((topic) => topic.category === subcategoryId);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-100 text-blue-800 flex items-center justify-center rounded">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>

      <p className="text-sm mb-3">{description}</p>

      {subcategories.length > 0
        ? // For categories with subcategories (like Opening Topics with White and Black)
          subcategories.map((subcategory) => (
            <div key={subcategory.id} className="mb-3">
              <h4 className="font-medium mb-2">{subcategory.title}</h4>
              {getTopicsBySubcategory(subcategory.id).map((topic) => (
                <IndividualTrainingTopic
                  key={topic.id}
                  topic={topic}
                  isSelected={selectedTopics.includes(topic.id)}
                  onSelect={onToggleTopic}
                />
              ))}
            </div>
          ))
        : // For categories without subcategories (like Middlegame and Endgame)
          topics
            .filter((topic) => topic.category === categoryId)
            .map((topic) => (
              <IndividualTrainingTopic
                key={topic.id}
                topic={topic}
                isSelected={selectedTopics.includes(topic.id)}
                onSelect={onToggleTopic}
              />
            ))}
    </div>
  );
};

export default TopicSelectionSection;
