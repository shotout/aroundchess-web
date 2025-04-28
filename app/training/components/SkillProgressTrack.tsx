import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SkillProgressTrackProps } from "./types";
import { Check } from "lucide-react";

const SkillProgressTrack: React.FC<SkillProgressTrackProps> = ({
  skillLevels,
  currentElo,
}) => {
  const MIN_ELO = 0;
  const MAX_ELO = 2400;

  const calculateEloPercentage = (): number => {
    const boundedElo = Math.max(MIN_ELO, Math.min(currentElo || 0, MAX_ELO));
    return (boundedElo / MAX_ELO) * 100;
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

  return (
    <div className="relative">
      <div className="w-full">
        {/* Grid with evenly spaced columns to match progress indicators */}
        <div className="grid grid-cols-6 gap-2 mb-1">
          {skillLevels.map((level, index) => {
            let imagePath: string;
            switch (level.title) {
              case "Novice":
                imagePath = "/training-plan/pawn.png";
                break;
              case "Beginner":
                imagePath = "/training-plan/rook.png";
                break;
              case "Intermediate":
                imagePath = "/training-plan/knight.png";
                break;
              case "Expert":
                imagePath = "/training-plan/bishop.png";
                break;
              case "Master":
                imagePath = "/training-plan/queen.png";
                break;
              case "Grand Master":
                imagePath = "/training-plan/king.png";
                break;
              default:
                imagePath = "/training-plan/default.png";
            }

            const isReached = (currentElo || 0) >= level.elo;
            const isNextGoal = index === nextGoalIndex;
            const isCompleted = isReached;

            return (
              <div
                key={level.id}
                className="flex flex-col items-center relative"
              >
                {isNextGoal && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-400 text-amber-950 min-w-[93px] flex justify-center items-center p-0 text-[10px] font-semibold rounded-full">
                      Your Next Goal
                    </Badge>
                    <div className="w-4 h-4 bg-amber-400 -z-[1] rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2"></div>
                  </div>
                )}

                <div className="h-8 flex items-center justify-center mb-1">
                  {isCompleted && !isNextGoal && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Image container - justify-center to ensure alignment */}
                <div className="relative mb-4 w-10 h-14 hidden xl:flex items-center justify-center">
                  <Image
                    src={imagePath}
                    alt={level.title}
                    width={40}
                    height={56}
                    className="object-contain"
                  />
                </div>

                <div className="relative mb-4 w-10 h-14 flex xl:hidden items-center justify-center">
                  <Image
                    src={imagePath}
                    alt={level.title}
                    width={36}
                    height={50}
                    className="object-contain"
                  />
                </div>

                <div className="text-center mb-4">
                  <div className="font-semibold text-xs xl:text-sm">
                    {level.title}
                  </div>
                  <div className="text-[10px] xl:text-xs text-gray-600">
                    ELO {level.elo}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-2">
          {/* Main progress bar container */}
          <div className="w-full h-4 bg-gray-200 rounded-full relative">
            <div
              className="h-full bg-blue-base rounded-full"
              style={{ width: `${currentEloPercentage}%` }}
            ></div>

            {/* Purple circle indicators using the same grid layout as the images */}
            <div className="absolute top-0 left-0 w-full h-full grid grid-cols-6">
              {skillLevels.map((level, index) => {
                const isReached = (currentElo || 0) >= level.elo;

                return (
                  <div
                    key={`indicator-${level.id}`}
                    className="h-full flex items-center justify-center"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
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

          {/* Current ELO indicator */}
          <div
            className="flex justify-center mt-3"
            style={{
              position: "absolute",
              left: `${currentEloPercentage}%`,
              transform: "translateX(-50%)",
              top: "12px",
            }}
          >
            <div className="bg-green-500 min-w-52 rounded-full text-center flex justify-center items-center text-white px-3 py-1">
              Your current ELO
            </div>
          </div>
        </div>

        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default SkillProgressTrack;
