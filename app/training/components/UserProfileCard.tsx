// components/UserProfileCard.tsx
import React from "react";
import { AlertCircle, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SkillProgressTrack from "./SkillProgressTrack";
import GoalsSection from "./GoalsSection";
import { UserProfileCardProps } from "./types";

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userProfile,
  skillLevels,
  goals,
  duration,
}) => {
  return (
    <Card className="border border-blue-base bg-blue-base/5 shadow-sm">
      <CardContent className="p-4 gap-y-4 flex flex-col">
        <div className="flex items-center gap-4 justify-between ">
          <div className="bg-white items-center py-3 gap-x-3 px-4 rounded-full justify-center flex">
            <div className="bg-white p-1 rounded-full">
              <Brain className="text-blue-500" />
            </div>
            <div className="text-base font-semibold">
              {userProfile.username} • {userProfile.level} • ELO{" "}
              {userProfile.currentElo}
            </div>
          </div>
          <button>
            <AlertCircle className="text-blue-base" />
          </button>
        </div>

        <div className="mt-8">
          <SkillProgressTrack
            skillLevels={skillLevels}
            currentElo={userProfile.currentElo}
          />
        </div>

        <GoalsSection goals={goals} duration={duration} />
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
