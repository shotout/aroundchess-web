import React from "react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { PlayerInfoProps } from "../../types/default-pgn";

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  profilePic,
  playerName,
  countryCode,
}) => {
  return (
    <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
      <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-blue-base">
        <Image
          src={"/board-vision/user.svg"}
          alt={`${playerName}'s photo`}
          width={48}
          height={48}
          className="p-1"
        />
      </div>
      <span className="text-gray-700 font-semibold">{playerName}</span>
      <ReactCountryFlag countryCode={"ID"} className="ml-2" />
    </div>
  );
};

export default PlayerInfo;
