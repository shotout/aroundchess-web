// components/TrainingTopicCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrainingTopicCardProps } from "./types";
import Image from "next/image";

const TrainingTopicCard: React.FC<TrainingTopicCardProps> = ({
  topic,
  icon,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Image src={icon} alt={icon} width={30} height={30} />
        <Badge className="border rounded-sm border-blue-base text-blue-base bg-white font-medium">
          {topic.level}
        </Badge>
      </div>
      <div className="font-medium mb-4">{topic.title}</div>
      <Button className="w-full btn-primary rounded-full">
        Start Training
      </Button>
    </div>
  );
};

export default TrainingTopicCard;
