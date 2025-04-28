// components/DialogLevelProgress.tsx
import React from "react";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DialogLevelProgressProps } from "./types";
import Image from "next/image";

const DialogLevelProgress: React.FC<DialogLevelProgressProps> = ({
  skillLevels,
  currentElo,
}) => {
  // Calculate the exact position based on ELO value - same as SkillProgressTrack
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

  // Get the next level index (for goal)
  const getNextLevelIndex = (): number => {
    for (let i = 0; i < skillLevels.length; i++) {
      if (currentElo < skillLevels[i].elo) {
        return i;
      }
    }
    return skillLevels.length - 1;
  };

  // Get three relevant levels to display
  const getDisplayLevels = () => {
    const currentIndex = getCurrentLevelIndex();
    const nextIndex = getNextLevelIndex();

    // Handle beginning of progression (first three levels)
    if (currentIndex === 0) {
      return skillLevels.slice(0, 3);
    }

    // Handle end of progression (last three levels)
    if (currentIndex >= skillLevels.length - 2) {
      return skillLevels.slice(skillLevels.length - 3, skillLevels.length);
    }

    // Standard case - current level in the middle
    return [
      skillLevels[currentIndex - 1],
      skillLevels[currentIndex],
      skillLevels[nextIndex],
    ];
  };

  const currentLevelIndex = getCurrentLevelIndex();
  const nextLevelIndex = getNextLevelIndex();
  const displayLevels = getDisplayLevels();
  const progressPercentage = calculateEloPosition();

  // Determine which of the displayed levels is current and which is next
  const currentDisplayIndex = displayLevels.findIndex(
    (level) => level.id === skillLevels[currentLevelIndex].id
  );

  const nextDisplayIndex = displayLevels.findIndex(
    (level) => level.id === skillLevels[nextLevelIndex].id
  );

  return (
    <div className="flex-1">
      <div className="relative mb-6">
        {/* Next goal badge - positioned above the next level */}
        <div
          className="absolute -top-3 transform -translate-x-1/2"
          style={{
            left: `${
              nextDisplayIndex === 0
                ? "16.7%"
                : nextDisplayIndex === 1
                ? "50%"
                : "83.3%"
            }`,
          }}
        >
          <Badge className="bg-amber-400 text-amber-950 px-4 py-1">
            Your Next Goal
          </Badge>
        </div>

        <div className="flex justify-between items-end mt-4">
          {displayLevels.map((level, index) => {
            // Use the same chess piece images as in SkillProgressTrack
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

            // Highlight current level
            const isCurrentLevel = index === currentDisplayIndex;
            const bgClass = isCurrentLevel ? "bg-blue-50" : "";

            // Check if this level is completed
            const isCompleted =
              level.elo <= currentElo &&
              level.title !== skillLevels[currentLevelIndex].title;

            return (
              <div
                key={level.id}
                className={`flex flex-col items-center w-1/3 p-2 rounded-lg ${bgClass}`}
              >
                {/* Chess piece with checkmark for completed levels */}
                <div className="relative mb-4 w-10 h-14 flex items-center justify-center">
                  <Image
                    src={imagePath}
                    alt={level.title}
                    width={40}
                    height={56}
                    className="object-contain"
                  />

                  {/* Checkmark for completed levels */}
                  {isCompleted && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center z-20">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center -translate-y-8">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="font-semibold text-sm">{level.title}</div>
                  <div className="text-xs text-gray-600">
                    ELO {level.elo.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4 relative">
          <Progress value={progressPercentage} className="h-2 bg-gray-200" />

          {/* Current ELO indicator */}
          <div
            className="absolute -bottom-6 transform -translate-x-1/2"
            style={{
              // Use same position calculation as SkillProgressTrack
              left: `${progressPercentage}%`,
            }}
          >
            <Badge className="bg-green-500 text-white px-3 py-1">
              Your current ELO ({currentElo})
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogLevelProgress;
