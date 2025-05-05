import React from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

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
  const displayLevel = topic.level || topic.difficulty || "Beginner";

  const iconSrc =
    typeof icon === "string" ? icon : "/training-plan/default.png";

  const getBasePath = (id: string) => {
    if (id.startsWith("opening_")) {
      return "/opening-theory";
    } else if (id.startsWith("middlegame_")) {
      return "/middlegame-strategy";
    } else if (id.startsWith("endgame_")) {
      return "/endgame-mastery";
    } else {
      return "/";
    }
  };

  const basePath = getBasePath(topic.id);

  return (
    <div className="border border-gray-200 rounded-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Image src={iconSrc} alt={topic.title} width={30} height={30} />
        <Badge className="border rounded-sm border-blue-base text-blue-base bg-white font-medium">
          {displayLevel}
        </Badge>
      </div>
      <div className="font-medium mb-4">{topic.title}</div>
      <Link href={`${basePath}/${topic.id}`}>
        <button className="w-full btn-primary rounded-full">
          Start Training
        </button>
      </Link>
    </div>
  );
};

export default TrainingTopicCard;
