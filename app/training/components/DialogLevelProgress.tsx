import React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogLevelProgressProps } from "./types";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DialogLevelProgress: React.FC<DialogLevelProgressProps> = ({
  skillLevels,
  currentElo,
}) => {
  const MIN_ELO = 0;
  const MAX_ELO = 2400;

  const calculateEloPercentage = (): number => {
    const boundedElo = Math.max(MIN_ELO, Math.min(currentElo, MAX_ELO));
    return (boundedElo / MAX_ELO) * 100;
  };

  const getEloPositionPercentage = (elo: number): number => {
    return (elo / MAX_ELO) * 100;
  };

  const getCurrentLevelIndex = (): number => {
    for (let i = 0; i < skillLevels.length; i++) {
      if (currentElo < skillLevels[i].elo) {
        return i - 1 >= 0 ? i - 1 : 0;
      }
    }
    return skillLevels.length - 1; // If all levels are passed
  };

  const getNextLevelIndex = (): number => {
    for (let i = 0; i < skillLevels.length; i++) {
      if (currentElo < skillLevels[i].elo) {
        return i;
      }
    }
    return skillLevels.length - 1;
  };

  const getDisplayLevels = () => {
    const currentIndex = getCurrentLevelIndex();
    const nextIndex = getNextLevelIndex();

    if (currentIndex === 0) {
      return skillLevels.slice(0, 3);
    }

    if (currentIndex >= skillLevels.length - 2) {
      return skillLevels.slice(skillLevels.length - 3, skillLevels.length);
    }

    return [
      skillLevels[currentIndex - 1],
      skillLevels[currentIndex],
      skillLevels[nextIndex],
    ];
  };

  const currentLevelIndex = getCurrentLevelIndex();
  const nextLevelIndex = getNextLevelIndex();
  const displayLevels = getDisplayLevels();
  const progressPercentage = calculateEloPercentage();

  return (
    <div className={cn("relative w-full flex justify-center")}>
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-2 mb-1">
          {displayLevels.map((level, index) => {
            let imagePath;
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

            const isReached = currentElo >= level.elo;
            const isNextGoal = level.id === skillLevels[nextLevelIndex].id;
            const isCompleted = isReached && !isNextGoal;

            return (
              <div key={level.id} className="flex flex-col items-center">
                <div className="h-8 flex items-center justify-center mb-1">
                  {isCompleted && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}

                  {isNextGoal && (
                    <Badge className="bg-amber-400 text-amber-950 px-4 py-1 text-sm font-semibold">
                      Your Next Goal
                    </Badge>
                  )}
                </div>

                <div className="relative mb-4 w-10 h-14 flex items-center justify-center">
                  <Image
                    src={imagePath}
                    alt={level.title}
                    width={40}
                    height={56}
                    className="object-contain"
                  />
                </div>

                <div className="text-center mb-4">
                  <div className="font-semibold text-sm">{level.title}</div>
                  <div className="text-xs text-gray-600">ELO {level.elo}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-2">
          <div className="w-full h-4 bg-gray-200 rounded-full relative">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>

            <div className="absolute top-0 left-0 w-full h-full">
              {displayLevels.map((level) => {
                const isReached = currentElo >= level.elo;
                const positionPercentage = getEloPositionPercentage(level.elo);

                return (
                  <div
                    key={`indicator-${level.id}`}
                    className="absolute top-0 h-full flex items-center justify-center"
                    style={{
                      left: `${positionPercentage}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 absolute ${
                        isReached
                          ? "bg-purple-600 border-blue-600"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="flex justify-center mt-3"
            style={{
              position: "absolute",
              left: `${progressPercentage}%`,
              transform: "translateX(-50%)",
              top: "12px",
            }}
          >
            <div className="bg-green-500 min-w-52 rounded-full text-center flex justify-center items-center text-white px-3 py-1">
              Your current ELO ({currentElo})
            </div>
          </div>
        </div>

        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default DialogLevelProgress;
