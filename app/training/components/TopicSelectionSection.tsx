// components/TopicSelectionSection.tsx
import React from "react";
import IndividualTrainingTopic from "./IndividualTrainingTopic";
import { TopicSelectionSectionProps } from "./types";
import Image from "next/image";

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
  const getTopicsBySubcategory = (subcategoryId: string) => {
    return topics.filter((topic) => topic.category === subcategoryId);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Image src={icon} width={35} height={35} alt="" />
        <h3 className="font-semibold">{title}</h3>
      </div>

      <p className="text-sm mb-3">{description}</p>

      {subcategories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {subcategories.map((subcategory) => (
            <div key={subcategory.id} className="mb-3 w-full">
              <h4 className="font-medium mb-2">{subcategory.title}</h4>
              <div className="space-y-3">
                {getTopicsBySubcategory(subcategory.id).map((topic) => (
                  <IndividualTrainingTopic
                    key={topic.id}
                    topic={topic}
                    isSelected={selectedTopics.includes(topic.id)}
                    onSelect={onToggleTopic}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        topics
          .filter((topic) => topic.category === categoryId)
          .map((topic) => (
            <IndividualTrainingTopic
              key={topic.id}
              topic={topic}
              isSelected={selectedTopics.includes(topic.id)}
              onSelect={onToggleTopic}
            />
          ))
      )}
    </div>
  );
};

export default TopicSelectionSection;
