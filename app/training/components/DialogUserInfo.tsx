import React from "react";
import { Info, Clock } from "lucide-react";
import { DialogUserInfoProps } from "./types";

const DialogUserInfo: React.FC<DialogUserInfoProps> = ({
  username,
  keyInfo,
}) => {
  return (
    <div className="w-72 border-r border-gray-200 pr-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          <div className="w-full h-full bg-blue-100"></div>
        </div>
        <div>
          <div className="font-semibold">{username}</div>
        </div>
      </div>

      <div className="bg-[#F7F7F7] rounded-md p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
            <Info className="h-3 w-3 text-black" />
          </div>
          <div className="text-sm font-semibold text-black">
            Your key to reach the next Level:
          </div>
        </div>
        <p className="text-sm text-black">{keyInfo.keyToReachNextLevel}</p>
      </div>

      <div className="bg-blue-50 rounded-md p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="h-3 w-3 text-black" />
          </div>
          <div className="text-sm font-semibold text-blue-900">
            Approximate Duration:
          </div>
        </div>
        <div className="bg-blue-200 text-blue-800 text-sm py-1 px-2 rounded inline-block">
          {keyInfo.approximateDuration}
        </div>
      </div>
    </div>
  );
};

export default DialogUserInfo;
