import React from "react";
import { DialogUserInfoProps } from "./types";
import Image from "next/image";

const DialogUserInfo: React.FC<DialogUserInfoProps> = ({
  username,
  keyInfo,
}) => {
  return (
    <div className="lg:w-96 w-full border-gray-200 p-2 bg-white rounded-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden"></div>
        <div className="flex justify-between items-center w-full">
          <div className="font-semibold">{username}</div>
          <div>hello</div>
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
