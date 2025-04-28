import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SkillProgressTrack from "./SkillProgressTrack";
import GoalsSection from "./GoalsSection";
import { UserProfileCardProps } from "./types";
import { UserProfile } from "./mockData";

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userProfile,
  skillLevels = [],
  goals = [],
  duration,
}) => {
  const defaultUserProfile: UserProfile = {
    username: "User",
    level: "Beginner",
    currentElo: 0,
    targetElo: 0,
    avatar: null,
  };

  const profile = userProfile || defaultUserProfile;

  return (
    <Card className="xl:border xl:border-blue-base bg-blue-base/5 shadow-sm">
      <CardContent className="p-4 gap-y-4 flex flex-col">
        <div className="flex items-center gap-4 justify-between ">
          <div className="bg-white items-center py-3 gap-x-3 px-4 rounded-full justify-center flex">
            <div className="bg-white p-1 rounded-full">{profile.avatar}</div>
            <div className="text-base font-semibold">
              {profile.username} • {profile.level} • ELO {profile.currentElo}
            </div>
          </div>
          <button>
            <AlertCircle className="text-blue-base" />
          </button>
        </div>

        <div className="mt-8">
          <SkillProgressTrack
            skillLevels={skillLevels}
            // currentElo={profile.currentElo}
            currentElo={1600}
          />
        </div>

        {duration && goals.length > 0 && (
          <GoalsSection goals={goals} duration={duration} />
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
