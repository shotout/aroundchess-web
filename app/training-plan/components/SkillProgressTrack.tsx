import React from "react";
import Image from "next/image";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillProgressTrackProps {
  currentElo: number;
  skillLevels?: any[];
}

const LEVEL_SCALE_FACTORS = {
  novice: 1.0,
  beginner: 1.1,
  intermediate: 1.2,
  expert: 1.3,
  master: 1.5,
  grandmaster: 1.8,
};

const DEFAULT_SKILL_LEVELS = [
  {
    id: "novice",
    title: "Novice",
    elo: 0,
    description:
      "Improve fundamentals and reduce blunders. Build basic tactical awareness.",
  },
  {
    id: "beginner",
    title: "Beginner",
    elo: 800,
    description:
      "Build consistency and expand basic knowledge. Begin refining tactical patterns.",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    elo: 1200,
    description:
      "Enhance tactical sharpness and strategic depth. Transition smoothly from opening to middlegame.",
  },
  {
    id: "expert",
    title: "Expert",
    elo: 1600,
    description:
      "Develop advanced strategies and reduce recurring errors. Integrate deeper analytical work.",
  },
  {
    id: "master",
    title: "Master",
    elo: 2000,
    description:
      "Refine performance with advanced theory and detailed analysis. Fine-tune both strategic and tactical decisions.",
  },
  {
    id: "grandmaster",
    title: "Grand Master",
    description:
      "Elite fine-tuning and continuous innovation.Focus on micro-improvements and personalized analysis.",
    elo: 2400,
  },
];

/**
 * Highest tier the rating has reached, using the same table the track renders
 * so the label next to the ELO can never disagree with the bar beside it.
 */
export const getLevelTitleForElo = (
  currentElo: number,
  skillLevels: { title: string; elo: number }[] = DEFAULT_SKILL_LEVELS
): string => {
  const boundedElo = Math.max(0, currentElo || 0);
  const reached = [...skillLevels]
    .sort((a, b) => a.elo - b.elo)
    .filter((level) => boundedElo >= level.elo)
    .pop();

  return reached?.title ?? skillLevels[0].title;
};

const SkillProgressTrack: React.FC<SkillProgressTrackProps> = ({
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

  const calculateEloPercentage = (isFullView = true): number => {
    const boundedElo = Math.max(MIN_ELO, Math.min(currentElo || 0, MAX_ELO));

    if (boundedElo < skillLevels[0].elo) {
      return 0;
    }

    if (boundedElo >= skillLevels[skillLevels.length - 1].elo) {
      return 100;
    }

    if (!isFullView) {
      const mobileLevels = getMobileDisplayLevels();

      if (boundedElo < mobileLevels[0].elo) {
        return 0;
      }

      if (boundedElo >= mobileLevels[mobileLevels.length - 1].elo) {
        return 100;
      }

      for (let i = 0; i < mobileLevels.length - 1; i++) {
        if (
          boundedElo >= mobileLevels[i].elo &&
          boundedElo < mobileLevels[i + 1].elo
        ) {
          const segmentStart = (i / (mobileLevels.length - 1)) * 100;
          const segmentEnd = ((i + 1) / (mobileLevels.length - 1)) * 100;
          const segmentWidth = segmentEnd - segmentStart;

          const segmentProgress =
            (boundedElo - mobileLevels[i].elo) /
            (mobileLevels[i + 1].elo - mobileLevels[i].elo);

          return segmentStart + segmentProgress * segmentWidth;
        }
      }

      return 0;
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

  const getMobileDisplayLevels = () => {
    const currentIndex = getCurrentLevelIndex();
    const nextGoalIndex = getNextGoalLevelIndex();
    const afterGoalIndex = Math.min(nextGoalIndex + 1, skillLevels.length - 1);

    if (currentIndex === nextGoalIndex && nextGoalIndex === afterGoalIndex) {
      const prevIndex = Math.max(0, currentIndex - 1);
      return [
        skillLevels[prevIndex],
        skillLevels[currentIndex],
        skillLevels[currentIndex],
      ];
    }

    if (currentIndex === nextGoalIndex) {
      const afterAfterGoalIndex = Math.min(
        afterGoalIndex + 1,
        skillLevels.length - 1
      );
      return [
        skillLevels[currentIndex],
        skillLevels[afterGoalIndex],
        skillLevels[afterAfterGoalIndex],
      ];
    }

    if (nextGoalIndex === afterGoalIndex) {
      const prevIndex = Math.max(0, currentIndex - 1);
      if (prevIndex === currentIndex) {
        return [
          skillLevels[currentIndex],
          skillLevels[nextGoalIndex],
          skillLevels[nextGoalIndex],
        ];
      }
      return [
        skillLevels[prevIndex],
        skillLevels[currentIndex],
        skillLevels[nextGoalIndex],
      ];
    }

    return [
      skillLevels[currentIndex],
      skillLevels[nextGoalIndex],
      skillLevels[afterGoalIndex],
    ];
  };

  const currentEloPercentage = calculateEloPercentage(true);
  const mobileEloPercentage = calculateEloPercentage(false);
  const nextGoalIndex = getNextGoalLevelIndex();
  const mobileLevels = getMobileDisplayLevels();

  // Calculate positions for triangle and badge separately
  const MAX_BADGE_POSITION = 85; // Maximum safe position for badge (to prevent cutoff)
  const trianglePosition = currentEloPercentage * 0.8333 + 9.5; // Actual triangle position
  const badgePosition = Math.min(trianglePosition, MAX_BADGE_POSITION); // Badge stops at threshold

  const badgeClass =
    "w-max h-6 md:h-7 rounded-full flex justify-center items-center text-[11.6px] md:text-[14px] --xs px-[10px] md:px-[16px] font-semibold";

  if (!skillLevels || skillLevels.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Skill level information not available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative">
      <TooltipProvider delayDuration={300} skipDelayDuration={100}>
        <div className="relative w-full space-y-6 overflow-x-scroll">
          <div className="w-[640px] lg:w-full grid grid-cols-6 gap-2">
            {skillLevels.map((level, index) => {
              const isReached = (currentElo || 0) >= level.elo;
              const isNextGoal = index === nextGoalIndex;
              const imagePath = getImagePath(level.id, isReached, isNextGoal);
              const isCompleted = isReached;

              const baseWidth = 40;
              const baseHeight = 56;
              const scaleFactor =
                LEVEL_SCALE_FACTORS[
                  level.id as keyof typeof LEVEL_SCALE_FACTORS
                ] || 1;

              const regularWidth = baseWidth * scaleFactor;
              const regularHeight = baseHeight * scaleFactor;

              return (
                <div
                  key={level.id}
                  className="flex flex-col items-center relative w-full space-y-2"
                >
                  <div className="h-8 flex items-center justify-center">
                    {isCompleted && !isNextGoal && (
                      <div className="w-6 h-6 bg-gradient-to-b from-[#26E279] via-[#029A46] to-[#029A46] rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white font-light" />
                      </div>
                    )}
                    {isNextGoal && (
                      <div className="absolute -top-0 left-1/2 transform -translate-x-1/2">
                        <div
                          className={`${badgeClass} bg-gradient-to-b from-[#FFA600] to-[#FFCD7C] text-black`}
                        >
                          Your Next Goal
                        </div>
                        <div className="w-4 h-4 bg-[#FFCD7C] -z-[1] rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2"></div>
                      </div>
                    )}
                  </div>

                  <div className="relative h-[98px] flex justify-center items-end">
                    {/* <div className="inline-flex items-end h-full">
                      <div className="relative w-fit h-fit flex items-end">
                        <Image
                          src={imagePath}
                          alt={level.title}
                          width={regularWidth}
                          height={regularHeight}
                          className="object-contain align-bottom"
                        />
                      </div>
                    </div> */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-end h-full">
                          <div className="relative w-fit h-fit flex items-end">
                            <Image
                              src={imagePath}
                              alt={level.title}
                              width={regularWidth}
                              height={regularHeight}
                              className="object-contain align-bottom"
                            />
                          </div>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent
                        side="right"
                        align="start"
                        sideOffset={20}
                        alignOffset={10}
                        className={`!bg-[#ECEBFF] overflow-hidden w-[250px] border border-[#221AE9] shadow-[0px_4px_8px_0px_rgba(34,26,233,0.12)] text-[#0B094E] rounded-[8px] ${
                          level.id === "grandmaster"
                            ? "!rounded-br-[0px]"
                            : "!rounded-bl-[0px]"
                        }`}
                      >
                        <div className="flex items-center gap-x-2 p-1">
                          <AlertCircle className="text-blue-base w-[24px] h-[24px]" />
                          <div className="w-[calc(100%-26px)] text-[14px] leading-[130%] --xs text-left">
                            {level.description}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="text-center w-full space-y-1">
                    <div className="font-semibold text-[14px] --sm flex items-center justify-center">
                      <span className="truncate max-w-full">{level.title}</span>
                    </div>
                    <div className="text-[14px] --xs text-gray-600 flex items-center justify-center">
                      <span className="whitespace-nowrap">ELO {level.elo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <div className="hidden grid-cols-6 gap-2">
            {mobileLevels.map((level, mobileIndex) => {
              const isReached = (currentElo || 0) >= level.elo;
              const isNextGoal =
                level.elo > (currentElo || 0) && mobileIndex === 1;
              const imagePath = getImagePath(level.id, isReached, isNextGoal);
              const isCompleted = isReached;

              const mobileWidth = 36;
              const mobileHeight = 50;

              return (
                <div
                  key={`mobile-${level.id}`}
                  className="flex flex-col items-center relative w-full space-y-2"
                >
                  <div className="h-8 flex items-center justify-center">
                    {isCompleted && !isNextGoal && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {isNextGoal && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div
                          className={`${badgeClass} bg-gradient-to-b from-[#FFA600] to-[#FFCD7C] text-black`}
                        >
                          Your Next Goal
                        </div>
                        <div className="w-4 h-4 bg-[#FFCD7C] -z-[1] rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2"></div>
                      </div>
                    )}
                  </div>

                  <div className="relative flex h-16 w-12 justify-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-0 flex justify-center">
                          <Image
                            src={imagePath}
                            alt={level.title}
                            width={mobileWidth}
                            height={mobileHeight}
                            className={`object-contain`}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        align="start"
                        sideOffset={20}
                        alignOffset={100}
                        className="bg-blue-base/5 backdrop-blur-3xl border border-blue-base shadow-lg rounded-md"
                      >
                        <div className="flex flex-col gap-y-1 p-2">
                          <h3 className="font-semibold text-[14px] --sm">
                            {level.title}
                          </h3>
                          <p className="text-[14px] --xs text-gray-600">
                            ELO Requirement: {level.elo}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="text-center w-full space-y-1">
                    <div className="font-semibold text-[14px] --xs flex items-center justify-center">
                      <span className="truncate max-w-full">{level.title}</span>
                    </div>
                    <div className="text-[14px] --10px text-gray-600 flex items-center justify-center">
                      <span className="whitespace-nowrap">ELO {level.elo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div> */}

          <div className="w-[640px] lg:w-full relative h-20 block">
            <div className="relative w-full mt-6">
              <div className="absolute -translate-y-1/2 w-full grid grid-cols-6 z-[5]">
                {skillLevels.map((level, index) => {
                  const isReached = (currentElo || 0) >= level.elo;
                  return (
                    <div
                      key={`indicator-desktop-${level.id}`}
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
                className="absolute top-1/2 -translate-y-1/2 h-4 rounded-full bg-gray-200 z-0"
                style={{
                  left: "calc(8.33% + 3.5px)",
                  width: "calc(83.33% - 7px)",
                }}
              >
                <div
                  className="h-full bg-blue-base rounded-full"
                  style={{
                    width: `${currentEloPercentage}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Badge container - stops at safe position to prevent cutoff */}
            <div
              className="absolute -translate-x-1/2 top-8"
              style={{
                left: `${badgePosition}%`,
                bottom: 0,
              }}
            >
              {/* Green triangle indicator - centered on badge */}
              <div className={`${badgePosition < 10 ? 'left-[calc(50%-8px)]' : 'left-1/2'} w-4 h-4 -z-[1] bg-[#26E279] rotate-45 absolute top-0 -translate-x-1/2 -translate-y-1/2`}></div>

              {/* Badge text */}
              <div
                className={`${badgeClass} bg-gradient-to-b from-[#26E279] to-[#029A46] text-white`}
              >
                Your current ELO
              </div>
            </div>
          </div>

          {/* <div className="relative h-20 xl:hidden">
            <div className="relative w-full mt-6">
              <div className="absolute -translate-y-1/2 w-full grid grid-cols-3 z-10">
                {mobileLevels.map((level, index) => {
                  const isReached = (currentElo || 0) >= level.elo;
                  return (
                    <div
                      key={`indicator-mobile-${level.id}`}
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
                className="absolute top-1/2 -translate-y-1/2 h-4 rounded-full bg-gray-200 z-0"
                style={{
                  left: "calc(16.67% + 3.5px)",
                  width: "calc(66.67% - 7px)",
                }}
              >
                <div
                  className="h-full bg-blue-base rounded-full"
                  style={{
                    width: `${mobileEloPercentage}%`,
                  }}
                ></div>
              </div>
            </div>

            <div
              className="absolute -translate-x-1/2 top-8"
              style={{
                left: `${
                  ((mobileEloPercentage * 0.6667) / 100) * 100 + 16.67
                }%`,
                bottom: 0,
              }}
            >
              <div className="w-4 h-4 bg-[#26E279] -z-[1] rotate-45 absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"></div>
              <div
                className={`${badgeClass} bg-gradient-to-b from-[#26E279] to-[#029A46] text-white`}
              >
                Your current ELO
              </div>
            </div>
          </div> */}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default SkillProgressTrack;
