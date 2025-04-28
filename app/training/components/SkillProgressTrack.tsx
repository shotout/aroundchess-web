// components/SkillProgressTrack.tsx
import React from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SkillProgressTrackProps } from "./types";
import { Check } from "lucide-react";

const SkillProgressTrack: React.FC<SkillProgressTrackProps> = ({
  skillLevels,
  currentElo,
}) => {
  // Calculate the exact position based on ELO value
  const calculateEloPosition = (): number => {
    const maxELO = skillLevels[skillLevels.length - 1].elo;
    return (currentElo / maxELO) * 100;
  };

  // Find the current level index based on ELO
  const getCurrentLevelIndex = (): number => {
    for (let i = 0; i < skillLevels.length; i++) {
      if (currentElo < skillLevels[i].elo) {
        return i - 1 >= 0 ? i - 1 : 0;
      }
    }
    return skillLevels.length - 1; // If all levels are passed
  };

  // Find the next goal level index (nearest higher ELO level)
  const getNextGoalLevelIndex = (): number => {
    for (let i = 0; i < skillLevels.length; i++) {
      if (currentElo < skillLevels[i].elo) {
        return i;
      }
    }
    return skillLevels.length - 1; // If all levels are passed
  };

  // Get ELO position percentage for markers
  const currentEloPosition = calculateEloPosition();
  const nextGoalIndex = getNextGoalLevelIndex();
  const currentLevelIndex = getCurrentLevelIndex();

  return (
    <div className="relative">
      {/* Next goal badge - positioned at the next level */}
      <div
        className="absolute -top-12 transform -translate-x-1/2"
        style={{
          left: `${nextGoalIndex * (100 / (skillLevels.length - 1))}%`,
        }}
      >
        <Badge className="bg-amber-400 text-amber-950 px-4 py-2 text-sm font-semibold">
          Your Next Goal
        </Badge>
      </div>

      <div className="w-full">
        {/* Skill level columns with icons and progress circles aligned */}
        <div className="grid grid-cols-6 gap-2 mb-1">
          {skillLevels.map((level, index) => {
            // Define image paths based on skill level
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

            // Determine if this level has been reached based on ELO value
            const isReached = currentElo >= level.elo;

            return (
              <div key={level.id} className="flex flex-col items-center">
                {/* Chess piece with checkmark */}
                <div className="relative mb-4 w-10 h-14 flex items-center justify-center">
                  <Image
                    src={imagePath}
                    alt={level.title}
                    width={40}
                    height={56}
                    className="object-contain"
                  />

                  {/* Checkmark positioned at the top for completed levels */}
                  {isReached && index < currentLevelIndex && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center z-20">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center -translate-y-8">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Title and ELO */}
                <div className="text-center mb-4">
                  <div className="font-semibold text-sm">{level.title}</div>
                  <div className="text-xs text-gray-600">ELO {level.elo}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar container with perfectly aligned circles */}
        <div className="relative mt-2">
          {/* Custom progress bar - slightly taller to accommodate circles */}
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden relative">
            {/* Filled portion of progress bar based on exact ELO position */}
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${currentEloPosition}%` }}
            ></div>

            {/* Progress indicator circles precisely aligned with columns above */}
            <div className="absolute top-0 left-0 w-full grid grid-cols-6 gap-2 h-full">
              {skillLevels.map((level, index) => {
                const isReached = currentElo >= level.elo;

                return (
                  <div
                    key={`indicator-${level.id}`}
                    className="flex justify-center items-center h-full"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white ${
                        isReached ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current ELO indicator - positioned at exact current ELO location */}
          <div
            className="absolute -bottom-8 transform -translate-x-1/2"
            style={{ left: `${currentEloPosition}%` }}
          >
            <Badge className="bg-green-500 text-white px-3 py-1">
              Your current ELO
            </Badge>
          </div>
        </div>

        {/* Spacer for the badge underneath */}
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default SkillProgressTrack;
