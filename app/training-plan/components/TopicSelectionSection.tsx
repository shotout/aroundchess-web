import IndividualTrainingTopic from "./IndividualTrainingTopic";
import { TopicSelectionSectionProps } from "./types";
import Image from "next/image";
import OpeningTooltip from "./OpeningTooltip";

interface UpdatedTopicSelectionSectionProps extends TopicSelectionSectionProps {
  recommendations?: any[];
  requirements?: any;
}

const TopicSelectionSection: React.FC<UpdatedTopicSelectionSectionProps> = ({
  categoryId,
  title,
  icon,
  description,
  requirements,
  subcategories = [],
  topics,
  selectedTopics,
  onToggleTopic,
  recommendations = [],
}) => {
  const openingWhiteMax = requirements?.opening?.white || 1;
  const openingBlackMax = requirements?.opening?.black || 1;
  const middleMin = requirements?.middlegame?.min || 1;
  const middleMax = requirements?.middlegame?.max || 1;
  const endMin = requirements?.endgame?.min || 1;
  const endMax = requirements?.endgame?.max || 1;

  const isMiddle = categoryId === "middlegame";
  const isEnd = categoryId === "endgame";
  const max = isMiddle ? middleMax : isEnd ? endMax : 0;
  const min = isMiddle ? middleMin : isEnd ? endMin : 0;
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

  const isTopicRecommended = (topicId: string): boolean => {
    return recommendations.some((rec) => rec.id === topicId);
  };

  const getRecommendedTopicsBySubcategory = (subcategoryId: string) => {
    const subcategoryTopics = getTopicsBySubcategory(subcategoryId);
    return subcategoryTopics.filter((topic) => isTopicRecommended(topic.id));
  };

  const getNonRecommendedTopicsBySubcategory = (subcategoryId: string) => {
    const subcategoryTopics = getTopicsBySubcategory(subcategoryId);
    return subcategoryTopics.filter((topic) => !isTopicRecommended(topic.id));
  };

  const getRecommendedTopicsByCategory = (categoryId: string) => {
    const categoryTopics = topics.filter(
      (topic) => topic.category === categoryId
    );
    return categoryTopics.filter((topic) => isTopicRecommended(topic.id));
  };

  const getNonRecommendedTopicsByCategory = (categoryId: string) => {
    const categoryTopics = topics.filter(
      (topic) => topic.category === categoryId
    );
    return categoryTopics.filter((topic) => !isTopicRecommended(topic.id));
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
          {subcategories.map((subcategory) => {
            const recommendedTopics = getRecommendedTopicsBySubcategory(
              subcategory.id
            );
            const nonRecommendedTopics = getNonRecommendedTopicsBySubcategory(
              subcategory.id
            );
            const recommendValues = recommendedTopics.filter((value) =>
              selectedTopics.includes(value.id)
            );
            const nonRecommendSelected = nonRecommendedTopics.filter((value) =>
              selectedTopics.includes(value.id)
            );
            const isWhite = subcategory.title.includes("White");
            let max = isWhite ? openingWhiteMax : openingBlackMax;
            const isMaxSelected =
              nonRecommendSelected.length + recommendValues.length == max;

            return (
              <div key={subcategory.id} className="mb-3 w-full">
                <h4 className="font-medium mb-2 text-sm sm:text-base text-gray-800">
                  {subcategory.title}
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 hide-scrollbar">
                  {recommendedTopics.length > 0 && (
                    <>
                      {recommendedTopics.map((topic) => {
                        return (
                          <IndividualTrainingTopic
                            key={topic.id}
                            topic={topic}
                            isSelected={selectedTopics.includes(topic.id)}
                            disabled={
                              isMaxSelected &&
                              !selectedTopics.includes(topic.id)
                            }
                            onSelect={
                              isMaxSelected &&
                              !selectedTopics.includes(topic.id)
                                ? () => null
                                : onToggleTopic
                            }
                            isRecommended={true}
                          />
                        );
                      })}
                    </>
                  )}

                  {nonRecommendedTopics.map((topic) => {
                    return (
                      <IndividualTrainingTopic
                        key={topic.id}
                        topic={topic}
                        isSelected={selectedTopics.includes(topic.id)}
                        disabled={
                          isMaxSelected && !selectedTopics.includes(topic.id)
                        }
                        onSelect={
                          isMaxSelected && !selectedTopics.includes(topic.id)
                            ? () => null
                            : onToggleTopic
                        }
                        isRecommended={false}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2 max-h-[363px] overflow-y-auto pr-1 hide-scrollbar">
          {(() => {
            const recommendedTopics =
              getRecommendedTopicsByCategory(categoryId);
            const nonRecommendedTopics =
              getNonRecommendedTopicsByCategory(categoryId);
            const recommendValues = recommendedTopics.filter((value) =>
              selectedTopics.includes(value.id)
            );
            const nonRecommendSelected = nonRecommendedTopics.filter((value) =>
              selectedTopics.includes(value.id)
            );
            const isMaxSelected =
              nonRecommendSelected.length + recommendValues.length == max;
            return (
              <>
                {recommendedTopics.length > 0 && (
                  <>
                    {recommendedTopics.map((topic) => (
                      <IndividualTrainingTopic
                        key={topic.id}
                        topic={topic}
                        isSelected={selectedTopics.includes(topic.id)}
                        disabled={
                          isMaxSelected && !selectedTopics.includes(topic.id)
                        }
                        onSelect={
                          isMaxSelected && !selectedTopics.includes(topic.id)
                            ? () => null
                            : onToggleTopic
                        }
                        isRecommended={true}
                      />
                    ))}
                  </>
                )}

                {nonRecommendedTopics.map((topic) => (
                  <IndividualTrainingTopic
                    key={topic.id}
                    topic={topic}
                    isSelected={selectedTopics.includes(topic.id)}
                    isRecommended={false}
                    disabled={
                      isMaxSelected && !selectedTopics.includes(topic.id)
                    }
                    onSelect={
                      isMaxSelected && !selectedTopics.includes(topic.id)
                        ? () => null
                        : onToggleTopic
                    }
                  />
                ))}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TopicSelectionSection;
