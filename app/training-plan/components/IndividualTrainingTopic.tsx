import React from "react";
import { AlertCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IndividualTrainingTopicProps } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePgnStore } from "@/app/store/zustandStore";
import Image from "next/image";

interface OpeningData {
  opening_name: string;
  total_game: number;
}

interface OpeningsByColor {
  white: OpeningData[];
  black: OpeningData[];
}

type LegacyOpeningData = OpeningData[];

interface UpdatedIndividualTrainingTopicProps
  extends IndividualTrainingTopicProps {
  isRecommended?: boolean;
  disabled?: boolean;
}

const IndividualTrainingTopic: React.FC<
  UpdatedIndividualTrainingTopicProps
> = ({ topic, isSelected, onSelect, isRecommended = false, disabled }) => {
  const isOpeningTopic =
    topic.category === "whiteOpening" || topic.category === "blackOpening";

  const bgColor = isSelected
    ? "bg-gradient-to-r from-white to-blue-base/30"
    : disabled
    ? "bg-[#f0f0f0]"
    : "bg-white";
  const borderColor = isSelected ? "border-blue-base" : "border-[#d0cffa]";

  const { openingPlayed } = usePgnStore();

  const getOpeningPlayCount = () => {
    if (!isOpeningTopic || !openingPlayed) return 0;

    let totalPlayCount = 0;

    const hasColorCategories =
      openingPlayed &&
      typeof openingPlayed === "object" &&
      !Array.isArray(openingPlayed) &&
      ("white" in openingPlayed || "black" in openingPlayed);

    if (hasColorCategories) {
      const coloredData = openingPlayed as OpeningsByColor;

      if (Array.isArray(coloredData.white)) {
        const whiteMatch = coloredData.white.find(
          (opening) => opening.opening_name === topic.title
        );
        if (whiteMatch) {
          totalPlayCount += whiteMatch.total_game;
        }
      }

      if (Array.isArray(coloredData.black)) {
        const blackMatch = coloredData.black.find(
          (opening) => opening.opening_name === topic.title
        );
        if (blackMatch) {
          totalPlayCount += blackMatch.total_game;
        }
      }
    } else if (Array.isArray(openingPlayed)) {
      const legacyOpenings = openingPlayed as LegacyOpeningData;
      const matchingOpening = legacyOpenings.find(
        (opening) => opening.opening_name === topic.title
      );
      totalPlayCount = matchingOpening ? matchingOpening.total_game : 0;
    }

    return totalPlayCount;
  };

  const playCount = getOpeningPlayCount();

  const handleClick = () => {
    onSelect(topic.id);
  };

  const getDetailedPlayCount = () => {
    if (!isOpeningTopic || !openingPlayed) {
      return { white: 0, black: 0, total: 0 };
    }

    let whiteCount = 0;
    let blackCount = 0;

    const hasColorCategories =
      openingPlayed &&
      typeof openingPlayed === "object" &&
      !Array.isArray(openingPlayed) &&
      ("white" in openingPlayed || "black" in openingPlayed);

    if (hasColorCategories) {
      const coloredData = openingPlayed as OpeningsByColor;

      if (Array.isArray(coloredData.white)) {
        const whiteMatch = coloredData.white.find(
          (opening) => opening.opening_name === topic.title
        );
        whiteCount = whiteMatch ? whiteMatch.total_game : 0;
      }

      if (Array.isArray(coloredData.black)) {
        const blackMatch = coloredData.black.find(
          (opening) => opening.opening_name === topic.title
        );
        blackCount = blackMatch ? blackMatch.total_game : 0;
      }
    } else if (Array.isArray(openingPlayed)) {
      const legacyOpenings = openingPlayed as LegacyOpeningData;
      const matchingOpening = legacyOpenings.find(
        (opening) => opening.opening_name === topic.title
      );
      return {
        white: 0,
        black: 0,
        total: matchingOpening ? matchingOpening.total_game : 0,
        isLegacy: true,
      };
    }

    return {
      white: whiteCount,
      black: blackCount,
      total: whiteCount + blackCount,
      isLegacy: false,
    };
  };

  const detailedCount = getDetailedPlayCount();

  const formatPlayCount = (count: number) => {
    return count === 1 ? "Time" : "Times";
  };

  const renderMobilePlayCount = () => {
    if (!isOpeningTopic || playCount === 0) return null;

    return (
      <div className="block md:hidden mt-2">
        <p className="text-[14px] --xs text-gray-600 leading-tight">
          You've played this Topic:{" "}
          {detailedCount.isLegacy ? (
            <span className="font-medium">
              {detailedCount.total}{" "}
              {formatPlayCount(detailedCount.total).toLowerCase()}
            </span>
          ) : (
            <span className="font-medium">
              {detailedCount.total}{" "}
              {formatPlayCount(detailedCount.total).toLowerCase()}
            </span>
          )}
        </p>
      </div>
    );
  };

  const shouldShowTooltip = isOpeningTopic && playCount > 0;
  const shouldShowRecommendedTooltip = isRecommended;

  const topicContent = (
    <div
      className={`relative border ${borderColor} ${bgColor} rounded-xl p-3 cursor-pointer transition-all overflow-hidden h-[90px] flex flex-col justify-between`}
      onClick={handleClick}
      data-testid={`topic-${topic.id}`}
    >
      <div className="relative z-10">
        <div
          className={`flex items-center ${
            isRecommended ? "justify-between" : "justify-end"
          }`}
        >
          {isRecommended && (
            <Badge
              className={`flex text-[14px] --xs items-center gap-x-2 font-bold rounded-[2px] ${
                disabled
                  ? "bg-[f0f0f0]"
                  : isRecommended
                  ? "bg-white"
                  : " border-blue-base text-blue-base"
              }`}
            >
              <Image
                src={"/training-plan/recom.png"}
                alt="recommendation tag"
                width={30}
                height={30}
                className="max-w-5"
              />
              <span className="inline-block text-black">Recommended</span>
            </Badge>
          )}

          <div
            className={`w-5 h-5 p-1 border rounded-sm border-[#d0cffa] flex items-center ${
              isSelected ? "bg-blue-base" : ""
            } justify-center`}
          >
            {isSelected && <Check className="h-6 w-6 text-white" />}
          </div>
        </div>

        <h2
          className={`font-bold mt-2 text-[14px] --sm ${
            isSelected ? "text-blue-base" : "text-black"
          }`}
        >
          {topic.title}
        </h2>

        {renderMobilePlayCount()}
      </div>
    </div>
  );

  if (shouldShowRecommendedTooltip) {
    return (
      <TooltipProvider delayDuration={300} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {shouldShowTooltip ? (
              <TooltipProvider delayDuration={300} skipDelayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>{topicContent}</TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="start"
                    sideOffset={20}
                    alignOffset={100}
                    className="max-w-[300px] rounded-none rounded-t-md rounded-br-md flex items-center gap-x-3 bg-blue-base/5 backdrop-blur-3xl border border-blue-base shadow-lg"
                  >
                    <AlertCircle className="text-blue-base w-5 h-5" />
                    <div className="flex flex-col gap-y-2">
                      <h3 className="font-semibold text-[14px] --sm">
                        You've played this opening
                      </h3>
                      <div className="text-[14px] --xs text-gray-600">
                        {detailedCount.isLegacy ? (
                          <p>
                            {detailedCount.total}{" "}
                            {formatPlayCount(detailedCount.total)}
                          </p>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-medium">
                              Total: {detailedCount.total}{" "}
                              {formatPlayCount(detailedCount.total)}
                            </p>
                            {detailedCount.white > 0 && (
                              <p>As White: {detailedCount.white}</p>
                            )}
                            {detailedCount.black > 0 && (
                              <p>As Black: {detailedCount.black}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              topicContent
            )}
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            sideOffset={5}
            alignOffset={5}
            className="max-w-[230px] rounded-none rounded-t-md rounded-br-md bg-blue-base/5 backdrop-blur-3xl border border-blue-base "
          >
            <div className="flex items-center gap-x-2 p-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-blue-base max-w-5" />
              </div>
              <p className="text-[14px] --xs text-black">
                Grandmasters recommend this Concept for the Training Plan of
                your current level.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (shouldShowTooltip) {
    return (
      <TooltipProvider delayDuration={300} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{topicContent}</TooltipTrigger>
          <TooltipContent
            side="top"
            align="start"
            sideOffset={20}
            alignOffset={100}
            className="max-w-[300px] rounded-none rounded-t-md rounded-br-md flex items-center gap-x-3 bg-blue-base/5 backdrop-blur-3xl border border-blue-base shadow-lg"
          >
            <AlertCircle className="text-blue-base w-5 h-5" />
            <div className="flex flex-col gap-y-2">
              <h3 className="font-semibold text-[14px] --sm">
                You've played this opening
              </h3>
              <div className="text-[14px] --xs text-gray-600">
                {detailedCount.isLegacy ? (
                  <p>
                    {detailedCount.total} {formatPlayCount(detailedCount.total)}
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium">
                      Total: {detailedCount.total}{" "}
                      {formatPlayCount(detailedCount.total)}
                    </p>
                    {detailedCount.white > 0 && (
                      <p>As White: {detailedCount.white}</p>
                    )}
                    {detailedCount.black > 0 && (
                      <p>As Black: {detailedCount.black}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return topicContent;
};

export default IndividualTrainingTopic;
