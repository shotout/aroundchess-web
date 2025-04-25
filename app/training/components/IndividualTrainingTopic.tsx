import React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IndividualTrainingTopicProps } from "./types";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const IndividualTrainingTopic: React.FC<IndividualTrainingTopicProps> = ({
  topic,
  isSelected,
  onSelect,
}) => {
  const bgColor = isSelected ? "bg-blue-base/5" : "bg-white";
  const borderColor = isSelected ? "border-blue-base" : "border-[#d0cffa]";

  let bgImage = "";
  switch (topic.level) {
    case "Beginner":
      bgImage = "bg-[url('/training-plan/bns.png')]";
      break;
    case "Intermediate":
      bgImage = "bg-[url('/training-plan/bis.png')]";
      break;
    case "Advanced":
      bgImage = "bg-[url('/training-plan/bans.png')]";
      break;
    case "Expert":
      bgImage = "bg-[url('/training-plan/bans.png')]";
      break;
    default:
      bgImage = "bg-[url('/training-plan/default-bg.png')]";
  }

  let badgeIcon: string | StaticImport = "";
  let width: number = 10;
  let height: number = 10;

  switch (topic.level) {
    case "Beginner":
      badgeIcon = "/training-plan/beginner.png";
      width = 8;
      height = 8;
      break;
    case "Intermediate":
      badgeIcon = "/training-plan/intermediate.png";
      width = 15;
      height = 15;
      break;
    case "Advanced":
      badgeIcon = "/training-plan/advanced.png";
      width = 15;
      height = 15;
      break;
    case "Expert":
      badgeIcon = "/training-plan/advanced.png";
      width = 15;
      height = 15;
      break;
  }

  const handleClick = () => {
    onSelect(topic.id);
  };

  return (
    <div
      className={`relative border ${borderColor} ${bgColor} ${bgImage} bg-no-repeat bg-cover rounded-xl p-4 mb-3 cursor-pointer transition-all overflow-hidden`}
      onClick={handleClick}
      data-testid={`topic-${topic.id}`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <Badge
            className={`flex text-xs items-center gap-1 py-1 px-2 font-bold rounded-sm bg-white border-blue-base text-blue-base`}
          >
            <span className="flex items-center justify-center">
              <Image
                src={badgeIcon}
                width={width}
                height={height}
                alt=""
                className="inline-block"
              />
            </span>

            <span className="inline-block">{topic.level}</span>
          </Badge>

          <div
            className={`w-5 h-5 p-1 border rounded-sm border-[#d0cffa] flex items-center ${
              isSelected ? "bg-blue-base" : ""
            } justify-center`}
          >
            {isSelected && <Check className="h-6 w-6 text-white" />}
          </div>
        </div>

        <h2
          className={`font-bold ${
            isSelected ? "text-blue-base" : "text-black"
          } `}
        >
          {topic.title}
        </h2>
      </div>
    </div>
  );
};

export default IndividualTrainingTopic;
