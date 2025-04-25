// components/IndividualTrainingTopic.tsx
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
  const bgColor = isSelected ? "bg-blue-100" : "bg-white";
  const borderColor = isSelected ? "border-blue-500" : "border-gray-200";

  let badgeColor = "";
  let badgeIcon = null;

  switch (topic.level) {
    case "Beginner":
      badgeColor = "bg-blue-100 text-blue-800";
      badgeIcon = "B";
      break;
    case "Intermediate":
      badgeColor = "bg-purple-100 text-purple-800";
      badgeIcon = "I";
      break;
    case "Advanced":
      badgeColor = "bg-pink-100 text-pink-800";
      badgeIcon = "A";
      break;
    case "Expert":
      badgeColor = "bg-orange-100 text-orange-800";
      badgeIcon = "E";
      break;
  }

  const handleClick = () => {
    onSelect(topic.id);
  };

  return (
    <div
      className={`relative border ${borderColor} ${bgColor} rounded-lg p-3 mb-3 cursor-pointer transition-all hover:border-blue-400`}
      onClick={handleClick}
      data-testid={`topic-${topic.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            className={`${badgeColor} flex items-center gap-1 font-semibold`}
          >
            {badgeIcon} {topic.level}
          </Badge>
          <div className="font-medium text-blue-900">{topic.title}</div>
        </div>
        <Checkbox
          checked={isSelected}
          className={
            isSelected
              ? "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
              : ""
          }
          onClick={(e) => {
            // Prevent event bubbling to parent div
            e.stopPropagation();
            handleClick();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        />
      </div>
      {isSelected && (
        <div className="absolute -right-1 -top-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      {/* Visual pattern background (only visible on hover) */}
      <div className="absolute inset-0 bg-blue-50 bg-opacity-70 pointer-events-none opacity-0 hover:opacity-20 transition-opacity">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-200 bg-opacity-40"
            style={{
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default IndividualTrainingTopic;
