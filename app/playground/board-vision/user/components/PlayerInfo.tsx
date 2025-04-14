import React from "react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { PlayerInfoProps } from "../../types/default-pgn";

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  profilePic,
  playerName,
  countryCode = "US",
}) => {
  return (
    <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
      <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-indigo-500">
        <Image
          src={profilePic || `/api/placeholder/48/48`}
          alt={`${playerName}'s photo`}
          width={48}
          height={48}
        />
      </div>
      <span className="text-gray-700 font-semibold">{playerName}</span>
      <ReactCountryFlag countryCode={countryCode} className="ml-2" />
    </div>
  );
};

export default PlayerInfo;
