import React from "react";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle } from "lucide-react";
import { TrainingTopic } from "../data/TrainingData";

interface TopicCardProps {
  topic: TrainingTopic;
  isSelected: boolean;
  onToggle: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isSelected,
  onToggle,
}) => {
  return (
    <div className="mb-2 border rounded-lg p-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[14px] --sm">{topic.name}</span>
          <Button
            variant="outline"
            className="text-[14px] --xs mt-1 rounded-[2px] py-1 h-auto border-blue-base text-blue-base"
          >
            {topic.difficulty}
          </Button>
        </div>

        <div
          className={`w-5 h-5 flex items-center justify-center ${
            isSelected
              ? "bg-blue-600 text-white shadow-xl shadow-blue-light"
              : "border border-gray-300"
          }`}
          onClick={onToggle}
        >
          {isSelected && <Check className="w-4 h-4" />}
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
