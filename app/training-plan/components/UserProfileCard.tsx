import React, { useMemo, useEffect, useState } from "react";
import { UserProfileCardProps } from "./types";
import Image from "next/image";
import { useUserStore } from "../store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DotSpinner from "@/components/game-history/Spinner";
import SkillProgressTrack, { getLevelTitleForElo } from "./SkillProgressTrack";
import CustomInfoTooltip from "./CustomTooltip";

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userProfile,
  avatar,
  schedule,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  const {
    profile,
    isLoadingUserProfile: isLoading,
    userProfileError: error,
  } = useUserStore();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const combinedProfile = useMemo(() => {
    // TrainingPage already resolves the ELO across its sources (leaderboard
    // first) and hands the result down, so the prop wins here — reading the
    // store first would silently switch sources once it gets populated.
    const currentElo = userProfile?.currentElo || profile?.elo || 0;

    return {
      username: userProfile?.username || profile?.username || "User",
      currentElo,
      level:
        profile?.level || userProfile?.level || getLevelTitleForElo(currentElo),
      targetElo: userProfile?.targetElo || profile?.targetElo || 0,
    };
  }, [profile, userProfile]);

  const avatarUrl = profile?.avatar || avatar;

  const tooltipContent =
    "Improvement is non-linear - each bracket represents increasing complexity and the need for refined techniques. Consistency, regular self-review, and adaptation of training (including coaching and tournament experience) become more critical as you advance.";

  if (error) {
    return (
      <div className="xl:border xl:border-blue-base lg:rounded-md bg-[#F6F9FF]shadow-sm p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading user profile: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading && !profile && !userProfile) {
    return (
      <div className="xl:border xl:border-blue-base lg:rounded-md bg-[#F6F9FF] shadow-sm p-8">
        <div className="flex justify-center items-center">
          <DotSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="xl:border xl:border-blue-base lg:rounded-md bg-[#F6F9FF] shadow-sm">
      {/* Tighter top padding on mobile — below xl the in-page heading is hidden
          and the app's header bar sits directly above, so the full p-4 read as
          a gap between the bar and the pill. */}
      <div className="p-4 pt-2 md:pt-4 gap-y-4 flex flex-col">
        <div className="flex items-center gap-4 justify-between ">
          <div className="bg-white items-center p-1 lg:p-2 gap-x-3 lg:gap-x-2 border-2 border-[#221AE9] rounded-full justify-center flex">
            {avatarUrl && (
              <div className="w-7 h-7 md:w-10 md:h-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={avatarUrl}
                  width={24}
                  height={24}
                  alt="User avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            {/* Smaller on mobile so "name • level • ELO" stays on one line as
                in the mockup. Left free to wrap rather than nowrap-and-overflow
                if a username is long enough to need it. */}
            <div className="text-[12px] md:text-base font-semibold">
              {combinedProfile.username} • {combinedProfile.level} • ELO{" "}
              {combinedProfile.currentElo}
            </div>
          </div>

          <CustomInfoTooltip
            content={tooltipContent}
            className={
              isMobile
                ? `absolute w-[300px] top-0 right-10 z-50 `
                : `absolute w-[450px] xl:w-[500px] z-50 right-8 top-2 xl:right-7 xl:-top-24`
            }
            tooltipClassName="text-[11px] md:text-[14px] --xs rounded-b-md rounded-tl-md md:rounded-t-md md:rounded-bl-md md:rounded-br-none p-4 lg:p-6"
          />
        </div>

        {/* mt-2, not mt-8: this stacks on top of the parent's gap-y-4, so the
            old value put 48px between the pill row and the track. */}
        <button className="mt-2">
          <SkillProgressTrack currentElo={combinedProfile.currentElo || 0} />
        </button>

        <div className="bg-gradient-to-r from-[#D7EBFF] to-[#FFFFFF00] rounded-lg p-4 border border-[#3871EC33]/30 md:flex items-center">
          <div className="flex-1">
            <div className="flex items-start md:items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={"/training-plan/checklist.png"}
                  alt="check icon"
                  width={50}
                  height={50}
                />
              </div>

              <div className="flex flex-col">
                <h3 className="font-semibold text-[14px] --sm md:text-[16px] mb-[8px] md:mb-[4px]">
                  Your next Goals:
                  {/* What you will get if you reach your Next Goals? */}
                </h3>
                <ul className="text-blue-800 text-[14px] --xs md:text-[14px] flex flex-col md:flex-row gap-y-2 md:gap-y-0 md:gap-x-3">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium flex items-center justify-center w-5 md:w-auto">
                      <span className="md:hidden">1.</span>
                      <span className="hidden md:inline">•</span>
                    </span>
                    <span>Build consistency and expand basic knowledge.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium flex items-center justify-center w-5 md:w-auto">
                      <span className="md:hidden">2.</span>
                      <span className="hidden md:inline">•</span>
                    </span>
                    <span>Begin refining tactical patterns.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:flex-shrink-0 pl-16 md:pl-0">
            <div className="flex flex-col md:items-end md:justify-center">
              <div className="text-[14px] --xs md:text-[15px] text-gray-600 mb-[4px] font-semibold">
                Avg. Time to Invest Daily:
              </div>
              <div className="flex items-center gap-1 text-blue-800 text-[14px] --sm md:text-[14px]">
                ~{schedule?.durations?.avgMinutesDaily || 0} min
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;