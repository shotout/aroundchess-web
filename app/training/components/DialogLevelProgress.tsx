// components/DialogLevelProgress.tsx
import React from "react";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DialogLevelProgressProps } from "./types";

const DialogLevelProgress: React.FC<DialogLevelProgressProps> = ({
  skillLevels,
  currentElo,
}) => {
  // Filter to display only 3 levels around current
  const displayLevels = skillLevels.filter((level) => {
    const currentIndex = skillLevels.findIndex((l) => l.current);
    const levelIndex = skillLevels.indexOf(level);
    // Display current level, one before, and one after
    return levelIndex >= currentIndex - 1 && levelIndex <= currentIndex + 1;
  });

  return (
    <div className="flex-1">
      <div className="relative mb-6">
        {/* Next goal badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-amber-400 text-amber-950 px-4 py-1">
            Your Next Goal
          </Badge>
        </div>

        <div className="flex justify-between items-end mt-4">
          {displayLevels.map((level, index) => (
            <div key={level.id} className="flex flex-col items-center w-24">
              {level.title === "Beginner" && (
                <div className="w-8 h-12 bg-blue-600 flex items-end justify-center pb-1 rounded-t-lg mb-1">
                  <div className="w-4 h-3 bg-blue-400 rounded-full"></div>
                </div>
              )}
              {level.title === "Intermediate" && (
                <div className="w-8 h-12 bg-amber-400 flex items-end justify-center pb-1 rounded-t-sm mb-1">
                  <div className="w-4 h-5 bg-amber-300 rounded-full"></div>
                </div>
              )}
              {level.title === "Expert" && (
                <div className="w-8 h-12 bg-gray-500 flex items-end justify-center pb-1 rounded-t-sm mb-1">
                  <div className="w-3 h-7 bg-gray-400 rounded-t-lg"></div>
                </div>
              )}
              <div className="text-center">
                <div className="font-semibold text-sm">{level.title}</div>
                <div className="text-xs text-gray-600">
                  ELO {level.elo.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4 relative">
          <Progress value={40} className="h-2 bg-gray-200" />

          {/* Current ELO indicator */}
          <div className="absolute -bottom-6 left-1/3 transform -translate-x-1/2">
            <Badge className="bg-green-500 text-white px-3 py-1">
              Your current ELO
            </Badge>
          </div>

          {/* Checkmark for completed level */}
          <div className="absolute -top-3 left-1/12 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogLevelProgress;
