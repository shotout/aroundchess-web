import React from "react";
import Image from "next/image";
import { useUserStore } from "../store";

interface DialogUserInfoProps {
  username: string;
  keyInfo: {
    keyToReachNextLevel: string;
  };
  skillLevels?: any[];
}

const DEFAULT_SKILL_LEVELS = [
  {
    id: "novice",
    title: "Novice",
    elo: 0,
  },
  {
    id: "beginner",
    title: "Beginner",
    elo: 800,
  },
  {
    id: "intermediate",
    title: "Intermediate",
    elo: 1200,
  },
  {
    id: "expert",
    title: "Expert",
    elo: 1600,
  },
  {
    id: "master",
    title: "Master",
    elo: 2000,
  },
  {
    id: "grandmaster",
    title: "Grand Master",
    elo: 2400,
  },
];

const DialogUserInfo: React.FC<DialogUserInfoProps> = ({
  username,
  keyInfo,
  skillLevels = DEFAULT_SKILL_LEVELS,
}) => {
  const { profile } = useUserStore();
  const displayUsername = profile?.username || username;
  const currentElo = profile?.elo || 0;

  const getCurrentLevel = () => {
    for (let i = skillLevels.length - 1; i >= 0; i--) {
      if (currentElo >= skillLevels[i].elo) {
        return skillLevels[i];
      }
    }
    return skillLevels[0]; // Default to novice if no matching level
  };

  const getNextLevel = () => {
    for (let i = 0; i < skillLevels.length; i++) {
      if (currentElo < skillLevels[i].elo) {
        return skillLevels[i];
      }
    }
    return skillLevels[skillLevels.length - 1]; // If already at max level
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const isMaxLevel = currentLevel.id === skillLevels[skillLevels.length - 1].id;

  const getImagePath = (currentLevelId: string) => {
    // Using blue for achieved levels as in DialogLevelProgress
    const status = "blue";
    const formattedTitle = currentLevelId.toLowerCase().replace(/\s+/g, "-");
    return `/training-plan/${status}/${formattedTitle}.png`;
  };

  const levelImagePath = getImagePath(currentLevel.id);

  return (
    <div className="lg:w-96 w-full border-gray-200 p-2 bg-white rounded-md">
      <div className="flex items-center gap-3 mb-4">
        {profile?.avatar ? (
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 relative">
            <Image
              src={profile.avatar}
              layout="fill"
              alt={`${displayUsername}'s avatar`}
              className="object-cover"
              style={{ borderRadius: "100%" }}
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-500 font-bold text-lg">
              {displayUsername.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <div className="font-semibold">{displayUsername}</div>
          <div className="text-sm flex items-center">
            <div className="w-8 h-10 relative">
              <Image
                src={levelImagePath}
                alt={currentLevel.title}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-xs text-black font-bold">
                {currentLevel.title}
              </div>
              <h1>ELO {currentElo}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F7F7F7] rounded-md">
        <div className="bg-[#F7F7F7] rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={"/training-plan/alert.png"}
              alt=""
              width={15}
              height={15}
            />
            <div className="text-sm font-semibold text-black">
              {isMaxLevel
                ? "You've reached the highest level!"
                : "Your key to reach the next Level:"}
            </div>
          </div>
          <p className="text-sm text-black">
            {isMaxLevel
              ? "Congratulations on achieving Grand Master status!"
              : keyInfo.keyToReachNextLevel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DialogUserInfo;
