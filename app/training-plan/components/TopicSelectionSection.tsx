import React, { useEffect, useState } from "react";
import IndividualTrainingTopic from "./IndividualTrainingTopic";
import { TopicSelectionSectionProps } from "./types";
import Image from "next/image";
import OpeningTooltip from "./OpeningTooltip";

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

  const getOpeningNames = (): string[] => {
    if (categoryId !== "opening") return [];

    const relevantTopics = topics.filter(
      (topic) => topic.category === categoryId
    );

    return relevantTopics
      .map((topic) => (topic as any).title || (topic as any).name)
      .filter((name): name is string => Boolean(name));
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Image src={icon} width={35} height={35} alt="" />
        <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        {categoryId === "opening" && (
          <OpeningTooltip
            categoryId={categoryId}
            openingNames={getOpeningNames()}
          />
        )}
      </div>

      <p className="text-sm sm:text-base mb-3 text-gray-600 leading-relaxed">
        {description}
      </p>

      {subcategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {subcategories.map((subcategory) => (
            <div key={subcategory.id} className="mb-3 w-full">
              <h4 className="font-medium mb-2 text-sm sm:text-base text-gray-800">
                {subcategory.title}
              </h4>
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
        <div className="space-y-2">
          {topics
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
      )}
    </div>
  );
};

export default TopicSelectionSection;
