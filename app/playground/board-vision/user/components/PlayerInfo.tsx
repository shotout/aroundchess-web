import React, { useEffect, useState } from "react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { PlayerInfoProps } from "../../types/default-pgn";

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerName }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const res = await fetch(`https://api.chess.com/pub/player/${playerName}`);
        if (!res.ok) {
          console.error("Failed to fetch player data:", res.status);
          return;
        }
        const data = await res.json();

        if (data.avatar) setAvatarUrl(data.avatar);

        if (data.country) {
          // Example: data.country = "https://api.chess.com/pub/country/US"
          const code = data.country.split("/").pop(); // "US"
          setCountryCode(code);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchPlayerData();
  }, [playerName]);

  return (
    <div className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg">
      <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-blue-base">
        <Image
          src={avatarUrl || "/board-vision/user.svg"}
          alt={`${playerName}'s avatar`}
          width={48}
          height={48}
          className="p-1"
        />
      </div>
      <span className="text-gray-700 font-semibold">{playerName}</span>
      {countryCode && (
        <ReactCountryFlag
          countryCode={countryCode}
          className="ml-2"
          svg
          style={{ width: "1.5em", height: "1.5em" }}
        />
      )}
    </div>
  );
};

export default PlayerInfo;
