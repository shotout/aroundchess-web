import React from "react";
import Image from "next/image";
import { useUserStore } from "../store";

interface DialogUserInfoProps {
  username: string;
  keyInfo: {
    keyToReachNextLevel: string;
    approximateDuration: string;
  };
}

const DialogUserInfo: React.FC<DialogUserInfoProps> = ({
  username,
  keyInfo,
}) => {
  const { profile } = useUserStore();

  const displayUsername = profile?.username || username;

  return (
    <div className="lg:w-96 w-full border-gray-200 p-2 bg-white rounded-md">
      <div className="flex items-center gap-3 mb-4">
        {profile?.avatar ? (
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={profile.avatar}
              width={48}
              height={48}
              alt={`${displayUsername}'s avatar`}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-bold text-lg">
              {displayUsername.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <div className="font-semibold">{displayUsername}</div>
          <div className="text-blue-500 text-sm">{profile?.elo || "0"} ELO</div>
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
              Your key to reach the next Level:
            </div>
          </div>
          <p className="text-sm text-black">{keyInfo.keyToReachNextLevel}</p>
        </div>

        <div className="rounded-md p-3">
          <div className="flex items-center gap-2">
            <Image
              src={"/training-plan/duration.png"}
              alt=""
              width={15}
              height={15}
            />
            <h1 className="text-sm font-semibold text-black">
              Approximate Duration:
            </h1>
            <p className="bg-[#5E84FF] text-white text-sm py-1 px-2 rounded inline-block">
              {keyInfo.approximateDuration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogUserInfo;
