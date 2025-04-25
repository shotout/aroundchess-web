// components/SkillProgressTrack.tsx
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SkillProgressTrackProps } from "./types";

const SkillProgressTrack: React.FC<SkillProgressTrackProps> = ({
  skillLevels,
  currentElo,
}) => {
  // Calculate the progress percentage based on current ELO
  const calculateProgress = (): number => {
    const totalELO = skillLevels[skillLevels.length - 1].elo;
    return (currentElo / totalELO) * 100;
  };

  // Render chess piece icons with the correct visual representation
  const renderSkillLevelIcons = () => {
    return skillLevels.map((level, index) => {
      let icon;

      switch (level.title) {
        case "Novice":
          icon = (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
            </div>
          );
          break;
        case "Beginner":
          icon = (
            <div className="w-10 h-14 bg-blue-600 flex items-end justify-center pb-1 rounded-t-lg">
              <div className="w-6 h-4 bg-blue-400 rounded-full"></div>
            </div>
          );
          break;
        case "Intermediate":
          icon = (
            <div className="w-10 h-14 bg-amber-400 flex flex-col items-center justify-end rounded-t-sm">
              <div className="w-5 h-6 bg-amber-300 rounded-full mt-1"></div>
              <div className="w-8 h-4 bg-amber-500 rounded-sm mt-auto"></div>
            </div>
          );
          break;
        case "Expert":
          icon = (
            <div className="w-10 h-14 bg-gray-500 flex items-end justify-center pb-1 rounded-sm">
              <div className="w-3 h-8 bg-gray-400 rounded-t-lg"></div>
            </div>
          );
          break;
        case "Master":
          icon = (
            <div className="w-10 h-14 bg-gray-500 flex items-center justify-center">
              <div className="w-6 h-7 bg-gray-400 rounded-t-lg"></div>
            </div>
          );
          break;
        case "Grand Master":
          icon = (
            <div className="w-10 h-14 bg-gray-500 flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-400 rotate-45 translate-y-1"></div>
            </div>
          );
          break;
        default:
          icon = <div className="w-10 h-14 bg-gray-300"></div>;
      }

      return (
        <div key={level.id} className="flex flex-col items-center gap-1">
          <div className="relative">
            {level.completed && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
            {icon}
          </div>
          <div className="text-center mt-1">
            <div className="font-semibold text-sm">{level.title}</div>
            <div className="text-xs text-gray-600">ELO {level.elo}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="relative">
      {/* Next goal badge */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform">
        <Badge className="bg-amber-400 text-amber-950 px-4 py-2 text-sm font-semibold">
          Your Next Goal
        </Badge>
      </div>

      {/* Skill level icons */}
      <div className="grid grid-cols-6 gap-2 mb-1">
        {renderSkillLevelIcons()}
      </div>

      {/* Progress bar */}
      <div className="relative mt-2">
        <Progress value={calculateProgress()} className="h-2 bg-gray-200" />

        {/* Current ELO indicator */}
        <div className="absolute -bottom-8 left-1/3 transform -translate-x-1/2">
          <Badge className="bg-green-500 text-white px-3 py-1">
            Your current ELO
          </Badge>
        </div>
      </div>

      {/* Spacer for the badge underneath */}
      <div className="h-10"></div>
    </div>
  );
};

export default SkillProgressTrack;
