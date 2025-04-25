// components/TrainingTopicCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrainingTopicCardProps } from "./types";

const TrainingTopicCard: React.FC<TrainingTopicCardProps> = ({
  topic,
  icon,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-blue-600">{icon}</div>
        <Badge className="bg-blue-100 text-blue-800 font-medium">
          {topic.level}
        </Badge>
      </div>
      <div className="font-medium mb-4">{topic.title}</div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Start Training
      </Button>
    </div>
  );
};

export default TrainingTopicCard;
