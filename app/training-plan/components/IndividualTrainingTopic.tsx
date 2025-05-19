import React from "react";
import { AlertCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IndividualTrainingTopicProps } from "./types";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const IndividualTrainingTopic: React.FC<IndividualTrainingTopicProps> = ({
  topic,
  isSelected,
  onSelect,
}) => {
  const isOpeningTopic =
    topic.category === "whiteOpening" || topic.category === "blackOpening";

  const bgColor = isSelected ? "bg-blue-base/5" : "bg-white";
  const borderColor = isSelected ? "border-blue-base" : "border-[#d0cffa]";

  const getBackgroundImage = () => {
    if (isOpeningTopic) {
      switch (topic.level) {
        case "Beginner":
          return "bg-[url('/training-plan/Mobile-Opening-Beginner-Selected.png')]";
        case "Intermediate":
          return "bg-[url('/training-plan/Mobile-Opening-Intermediate.png')]";
        case "Advanced":
          return "bg-[url('/training-plan/Mobile-Opening-Advanced.png')]";
        case "Expert":
          return "bg-[url('/training-plan/Mobile-Opening-Expert.png')]";
        default:
          return "bg-[url('/training-plan/Mobile-Opening-Beginner-Selected.png')]";
      }
    } else {
      switch (topic.level) {
        case "Beginner":
          return "bg-[url('/training-plan/Desktop-Beginner.png')]";
        case "Intermediate":
          return "bg-[url('/training-plan/Desktop-Intermediate.png')]";
        case "Advanced":
          return "bg-[url('/training-plan/Desktop-Advanced.png')]";
        case "Expert":
          return "bg-[url('/training-plan/Desktop-Expert.png')]";
        default:
          return "bg-[url('/training-plan/Desktop-Beginner.png')]";
      }
    }
  };

  const bgImage = getBackgroundImage();

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
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`relative border bg-no-repeat bg-cover ${borderColor} ${bgColor} ${bgImage} rounded-xl p-4 mb-3 cursor-pointer transition-all overflow-hidden ${
              isOpeningTopic ? "h-24" : "h-auto"
            }`}
            onClick={handleClick}
            data-testid={`topic-${topic.id}`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <Badge
                  className={`flex text-xs items-center gap-1 py-1 hover:bg-white px-2 font-bold rounded-sm bg-white border-blue-base text-blue-base`}
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
                }`}
              >
                {topic.title}
              </h2>
            </div>
          </div>
        </TooltipTrigger>
        {isOpeningTopic && (
          <TooltipContent
            side="top"
            align="start"
            sideOffset={20}
            alignOffset={100}
            className="max-w-[300px] rounded-none rounded-t-md rounded-br-md flex items-center gap-x-3 bg-blue-base/5 backdrop-blur-3xl border border-blue-base shadow-lg"
          >
            <AlertCircle className="text-blue-base w-5 h-5" />
            <div className="flex  flex-col  gap-y-2">
              <h3 className="font-semibold text-sm">
                You've played this topic
              </h3>
              <p className="text-xs text-gray-600">N Times</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default IndividualTrainingTopic;
