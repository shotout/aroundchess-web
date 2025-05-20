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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Image src={icon} width={35} height={35} alt="" />
        <h3 className="font-semibold">{title}</h3>
        <OpeningTooltip
          categoryId={categoryId}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          openingNames={topics.title}
          className={
            isMobile
              ? `absolute w-[300px] top-0 left-10 z-50 `
              : `absolute w-[450px] xl:w-[500px] z-50 left-8 top-2 xl:left-7 xl:-top-20`
          }
          tooltipClassName="text-[11px] md:text-xs rounded-b-md rounded-tl-md md:rounded-t-md md:rounded-br-md md:rounded-bl-none p-4 lg:p-6"
        />
      </div>

      <p className="text-sm mb-3">{description}</p>

      {subcategories.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
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
