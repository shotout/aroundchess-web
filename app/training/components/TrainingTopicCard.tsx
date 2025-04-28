import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface TrainingTopicCardProps {
  topic: {
    id: string;
    title: string;
    difficulty?: string;
    level?: string;
    category?: string;
  };
  icon: string | React.ReactNode;
}

const TrainingTopicCard: React.FC<TrainingTopicCardProps> = ({
  topic,
  icon,
}) => {
  // Use either level or difficulty, whichever is available
  const displayLevel = topic.level || topic.difficulty || "Beginner";

  // Ensure we have a string for the icon
  const iconSrc =
    typeof icon === "string" ? icon : "/training-plan/default.png";

  return (
    <div className="border border-gray-200 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Image src={iconSrc} alt={topic.title} width={30} height={30} />
        <Badge className="border rounded-sm border-blue-base text-blue-base bg-white font-medium">
          {displayLevel}
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
