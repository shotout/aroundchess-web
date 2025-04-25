import React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { IndividualTrainingTopicProps } from "./types";

const IndividualTrainingTopic: React.FC<IndividualTrainingTopicProps> = ({
  topic,
  isSelected,
  onSelect,
}) => {
  const bgColor = isSelected ? "bg-indigo-100" : "bg-white";
  const borderColor = isSelected ? "border-blue-500" : "border-gray-200";

  let badgeColor = "";
  let badgeIcon = null;

  switch (topic.level) {
    case "Beginner":
      badgeColor = "bg-blue-600 text-white";
      badgeIcon = "b";
      break;
    case "Intermediate":
      badgeColor = "bg-purple-600 text-white";
      badgeIcon = "I";
      break;
    case "Advanced":
      badgeColor = "bg-pink-600 text-white";
      badgeIcon = "A";
      break;
    case "Expert":
      badgeColor = "bg-orange-600 text-white";
      badgeIcon = "E";
      break;
  }

  const handleClick = () => {
    onSelect(topic.id);
  };

  return (
    <div
      className={`relative border ${borderColor} ${bgColor} rounded-xl p-6 mb-3 cursor-pointer transition-all hover:border-blue-400 overflow-hidden`}
      onClick={handleClick}
      data-testid={`topic-${topic.id}`}
    >
      <div className="relative z-10">
        <div className="">
          <div className="inline-flex items-center">
            <Badge
              className={`${badgeColor} flex text-xs items-center gap-2 font-bold rounded-full`}
            >
              {badgeIcon} {topic.level}
            </Badge>
          </div>

          {/* Main title */}
          <h2 className=" font-bold text-blue-900">{topic.title}</h2>
        </div>

        {isSelected && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualTrainingTopic;
