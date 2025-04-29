import React from "react";
import Image from "next/image";
import { SkillProgressTrackProps } from "./types";
import { Check } from "lucide-react";

const SkillProgressTrack: React.FC<SkillProgressTrackProps> = ({
  skillLevels,
  currentElo,
}) => {
  const getImagePath = (
    title: string,
    isReached: boolean,
    isNextGoal: boolean
  ): string => {
    let status = "grey";
    if (isReached) {
      status = "blue";
    } else if (isNextGoal) {
      status = "gold";
    }

    const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
    return `/training-plan/${status}/${formattedTitle}.png`;
  };
  const MIN_ELO = 0;
  const MAX_ELO = 2400;

  const calculateEloPercentage = (): number => {
    const boundedElo = Math.max(MIN_ELO, Math.min(currentElo || 0, MAX_ELO));

    if (boundedElo < skillLevels[0].elo) {
      return 0;
    }

    if (boundedElo >= skillLevels[skillLevels.length - 1].elo) {
      return 100;
    }

    for (let i = 0; i < skillLevels.length - 1; i++) {
      if (
        boundedElo >= skillLevels[i].elo &&
        boundedElo < skillLevels[i + 1].elo
      ) {
        const segmentStart = (i / (skillLevels.length - 1)) * 100;
        const segmentEnd = ((i + 1) / (skillLevels.length - 1)) * 100;
        const segmentWidth = segmentEnd - segmentStart;

        const segmentProgress =
          (boundedElo - skillLevels[i].elo) /
          (skillLevels[i + 1].elo - skillLevels[i].elo);

        return segmentStart + segmentProgress * segmentWidth;
      }
    }

    return 0;
  };

  const getCurrentLevelIndex = (): number => {
    for (let i = 0; i < skillLevels.length; i++) {
      if ((currentElo || 0) < skillLevels[i].elo) {
        return i - 1 >= 0 ? i - 1 : 0;
      }
    }
    return skillLevels.length - 1;
  };

  const getNextGoalLevelIndex = (): number => {
    for (let i = 0; i < skillLevels.length; i++) {
      if ((currentElo || 0) < skillLevels[i].elo) {
        return i;
      }
    }
    return skillLevels.length - 1;
  };

  const currentEloPercentage = calculateEloPercentage();
  const nextGoalIndex = getNextGoalLevelIndex();
  const currentLevelIndex = getCurrentLevelIndex();

  // Standardized badge class for consistent width and height
  const badgeClass =
    "min-w-[120px] h-7 rounded-full flex justify-center items-center text-xs font-semibold";

  return (
    <div className="relative">
      <div className="w-full space-y-6">
        {/* Grid for skill levels */}
        <div className="grid grid-cols-6 gap-2">
          {skillLevels.map((level, index) => {
            const isReached = (currentElo || 0) >= level.elo;
            const isNextGoal = index === nextGoalIndex;
            const imagePath = getImagePath(level.id, isReached, isNextGoal);
            const isCompleted = isReached;

            const regularWidth = 40;
            const regularHeight = 56;
            const mobileWidth = 30;
            const mobileHeight = 30;

            const nextGoalWidth = regularWidth * 1.3;
            const nextGoalHeight = regularHeight * 1.3;

            return (
              <div
                key={level.id}
                className="flex flex-col items-center relative w-full space-y-2"
              >
                {isNextGoal && (
                  <div className="absolute -top-6 lg:-top-14 left-1/2 transform -translate-x-1/2">
                    <div
                      className={`${badgeClass} bg-amber-400 text-amber-950`}
                    >
                      Your Next Goal
                    </div>
                    <div className="w-4 h-4 bg-amber-400 -z-[1] rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2"></div>
                  </div>
                )}

                <div className="h-8 flex items-center justify-center">
                  {isCompleted && !isNextGoal && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Desktop image container - with proper horizontal alignment */}
                <div className="relative hidden xl:flex h-20 w-16 justify-center">
                  <div className="absolute bottom-0 flex justify-center">
                    <Image
                      src={imagePath}
                      alt={level.title}
                      width={isNextGoal ? nextGoalWidth : regularWidth}
                      height={isNextGoal ? nextGoalHeight : regularHeight}
                      className={`object-contain ${
                        isNextGoal ? "origin-bottom scale-150" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Mobile image container - with proper horizontal alignment */}
                <div className="relative flex xl:hidden h-14 w-10 justify-center">
                  <div className="absolute bottom-0 flex justify-center">
                    <Image
                      src={imagePath}
                      alt={level.title}
                      width={mobileWidth}
                      height={mobileHeight}
                      className={`object-contain ${
                        isNextGoal ? "origin-bottom scale-150" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="text-center w-full space-y-1">
                  <div className="font-semibold text-xs xl:text-sm flex items-center justify-center">
                    <span className="truncate max-w-full">{level.title}</span>
                  </div>
                  <div className="text-[10px] xl:text-xs text-gray-600 flex items-center justify-center">
                    <span className="whitespace-nowrap">ELO {level.elo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar container */}
        <div className="relative h-20">
          <div className="relative w-full mt-6">
            {/* Progress bar positioned in the middle of the circles */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[8.33%] w-[83.33%] h-4 rounded-full bg-gray-200 z-0">
              <div
                className="h-full bg-blue-base rounded-full"
                style={{
                  width: `${currentEloPercentage}%`,
                }}
              ></div>
            </div>

            {/* Indicators - aligned exactly below each image */}
            <div className="absolute -translate-y-1/2 w-full grid grid-cols-6 z-10">
              {skillLevels.map((level, index) => {
                const isReached = (currentElo || 0) >= level.elo;
                return (
                  <div
                    key={`indicator-${level.id}`}
                    className="flex items-center justify-center"
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-4 ${
                        isReached
                          ? "bg-purple-600 border-blue-base"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="absolute -translate-x-1/2 top-8"
            style={{
              left: `${currentEloPercentage * 0.8333 + 8.33}%`,
              bottom: 0,
            }}
          >
            <div className="w-4 h-4 bg-green-500 -z-[1] rotate-45 absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"></div>
            <div className={`${badgeClass} bg-green-500 text-white`}>
              Your current ELO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillProgressTrack;
