import React from "react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DialogLevelProgressProps {
  currentElo: number;
  skillLevels?: any[];
}

const DEFAULT_SKILL_LEVELS = [
  {
    id: "novice",
    title: "Novice",
    elo: 0,
  },
  {
    id: "beginner",
    title: "Beginner",
    elo: 800,
  },
  {
    id: "intermediate",
    title: "Intermediate",
    elo: 1200,
  },
  {
    id: "expert",
    title: "Expert",
    elo: 1600,
  },
  {
    id: "master",
    title: "Master",
    elo: 2000,
  },
  {
    id: "grandmaster",
    title: "Grand Master",
    elo: 2400,
  },
];

const DialogLevelProgress: React.FC<DialogLevelProgressProps> = ({
  currentElo,
  skillLevels = DEFAULT_SKILL_LEVELS,
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

  const getDisplayLevels = () => {
    const currentIndex = getCurrentLevelIndex();
    const nextIndex = getNextGoalLevelIndex();

    if (currentIndex === 0 && (currentElo || 0) < skillLevels[0].elo) {
      return skillLevels.slice(0, 3);
    }

    if (nextIndex >= skillLevels.length - 1) {
      return skillLevels.slice(skillLevels.length - 3, skillLevels.length);
    }

    return [
      skillLevels[currentIndex], // Current level (left)
      skillLevels[nextIndex], // Next goal (center)
      skillLevels[nextIndex + 1], // Level after next goal (right)
    ];
  };

  const calculateEloPercentage = (): number => {
    const boundedElo = Math.max(MIN_ELO, Math.min(currentElo || 0, MAX_ELO));
    const displayLevels = getDisplayLevels();

    if (boundedElo < displayLevels[0].elo) {
      return 0;
    }

    if (boundedElo >= displayLevels[displayLevels.length - 1].elo) {
      return 100;
    }

    for (let i = 0; i < displayLevels.length - 1; i++) {
      if (
        boundedElo >= displayLevels[i].elo &&
        boundedElo < displayLevels[i + 1].elo
      ) {
        const segmentStart = (i / (displayLevels.length - 1)) * 100;
        const segmentEnd = ((i + 1) / (displayLevels.length - 1)) * 100;
        const segmentWidth = segmentEnd - segmentStart;

        const segmentProgress =
          (boundedElo - displayLevels[i].elo) /
          (displayLevels[i + 1].elo - displayLevels[i].elo);

        return segmentStart + segmentProgress * segmentWidth;
      }
    }

    return 0;
  };

  const currentEloPercentage = calculateEloPercentage();
  const displayLevels = getDisplayLevels();
  const nextGoalIndex = getNextGoalLevelIndex();

  const badgeClass =
    "min-w-[125px] h-7 rounded-full flex justify-center items-center text-[14px] --xs font-semibold px-[8px] md:px-[10px]";

  if (!skillLevels || skillLevels.length === 0) {
    return (
      <Alert className="mt-4">
        <AlertDescription>
          Skill level information not available.
        </AlertDescription>
      </Alert>
    );
  }

  const calculateProgressWidth = (): string => {
    const completedLevels = displayLevels.filter(
      (level) => (currentElo || 0) >= level.elo
    ).length;

    if (completedLevels === 0) {
      return "0%";
    }

    if (completedLevels === displayLevels.length) {
      return "100%";
    }

    const lastCompletedIndex = completedLevels - 1;
    const nextLevelElo = displayLevels[lastCompletedIndex + 1].elo;
    const lastCompletedElo = displayLevels[lastCompletedIndex].elo;

    const progressBetweenLevels =
      (currentElo - lastCompletedElo) / (nextLevelElo - lastCompletedElo);

    const totalSegments = displayLevels.length - 1;
    const singleSegmentWidth = 100 / totalSegments;

    const progressWidth =
      lastCompletedIndex * singleSegmentWidth +
      progressBetweenLevels * singleSegmentWidth;

    return `${progressWidth}%`;
  };

  return (
    <div className="relative mt-10 2xl:mt-12">
      <div className="w-full space-y-6">
        <div className="grid grid-cols-3 gap-2">
          {displayLevels.map((level, index) => {
            const isReached = (currentElo || 0) >= level.elo;
            const isNextGoal = level.id === skillLevels[nextGoalIndex].id;
            const imagePath = getImagePath(level.id, isReached, isNextGoal);
            const isCompleted = isReached && !isNextGoal;

            const regularWidth = 40;
            const regularHeight = 56;
            const mobileWidth = 30;
            const mobileHeight = 30;

            const nextGoalWidth = regularWidth * 1.2;
            const nextGoalHeight = regularHeight * 1.2;

            return (
              <div
                key={level.id}
                className="flex flex-col items-center relative w-full space-y-2"
              >
                <div className="h-4 lg:h-10 flex items-center justify-center">
                  {isCompleted && (
                    <Image
                      src={"/training-plan/checked.png"}
                      width={30}
                      height={30}
                      alt=""
                    />
                  )}
                  {isNextGoal && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`${badgeClass} bg-gradient-to-b from-[#FFA600] to-[#FFCD7C] text-amber-950`}
                      >
                        Your Next Goal
                      </div>
                      <div className="w-4 h-4 bg-[#FFCD7C] -z-[1] rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2"></div>
                    </div>
                  )}
                </div>

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
                  <div className="font-semibold text-[14px] --xs xl:text-[14px] --sm flex items-center justify-center">
                    <span className="truncate max-w-full">{level.title}</span>
                  </div>
                  <div className="text-[14px] --10px xl:text-[14px] --xs text-gray-600 flex items-center justify-center">
                    <span className="whitespace-nowrap">ELO {level.elo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative h-20">
          <div className="relative w-full mt-6">
            <div className="absolute -translate-y-1/2 w-full grid grid-cols-3 z-10">
              {displayLevels.map((level, index) => {
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

            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 bg-gray-200 z-0"
              style={{
                left: "calc(16.67% + 3.5px)",
                width: "calc(66.66% - 7px)",
              }}
            >
              <div
                className="h-full bg-blue-base"
                style={{
                  width: calculateProgressWidth(),
                }}
              ></div>
            </div>
          </div>

          <div
            className="absolute -translate-x-1/2 top-8"
            style={{
              left: `${((currentEloPercentage * 0.6666) / 100) * 100 + 16.67}%`,
              bottom: 0,
            }}
          >
            <div className="w-4 h-4 bg-[#26E279] -z-[1] rotate-45 absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"></div>
            <div
              className={`${badgeClass} bg-gradient-to-b from-[#26E279] via-[#029A46] to-[#029A46]  text-white`}
            >
              Your current ELO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogLevelProgress;
