import React, { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SkillProgressTrack from "./SkillProgressTrack";
import GoalsSection from "./GoalsSection";
import { UserProfileCardProps } from "./types";
import { skillLevelsData, UserProfile } from "./mockData";
import Image from "next/image";

const calculateUserLevel = (
  elo: number,
  skillLevels = skillLevelsData
): string => {
  let currentLevel = skillLevels[0].title;
  for (const level of skillLevels) {
    if (elo >= level.elo) {
      currentLevel = level.title;
    }
  }

  return currentLevel;
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userProfile,
  skillLevels = [],
  goals = [],
  duration,
  avatar,
}) => {
  const defaultUserProfile: UserProfile = {
    username: "User",
    level: "Beginner",
    currentElo: 0,
    targetElo: 0,
    avatar: null,
  };

  const profile = userProfile || defaultUserProfile;

  const userLevel = useMemo(() => {
    return calculateUserLevel(
      profile.currentElo ?? 0,
      skillLevels.length > 0 ? skillLevels : skillLevelsData
    );
  }, [profile.currentElo, skillLevels]);

  console.log(avatar);

  return (
    <Card className="xl:border xl:border-blue-base bg-blue-base/5 shadow-sm">
      <CardContent className="p-4 gap-y-4 flex flex-col">
        <div className="flex items-center gap-4 justify-between ">
          <div className="bg-white items-center py-3 gap-x-3 px-4 rounded-full justify-center flex">
            <Image src={avatar} width={20} height={20} alt="" />
            <div className="text-base font-semibold">
              {profile.username} • {userLevel} • ELO {profile.currentElo}
            </div>
          </div>
          <button>
            <AlertCircle className="text-blue-base" />
          </button>
        </div>

        <div className="mt-8">
          <SkillProgressTrack
            skillLevels={skillLevels}
            currentElo={profile.currentElo ?? 0}
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
