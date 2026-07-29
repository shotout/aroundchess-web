import React from "react";
import { GamePlayerAvatar } from "@/components/v2/game-player-avatar";
import { PlayerInfoProps } from "../../types/default-pgn";

/**
 * A player row above/below the board: avatar, name, ELO — same treatment as the
 * vs-AI game screen's player bars.
 *
 * It used to fetch the avatar and country from api.chess.com on every mount and
 * render a country flag. The flag is gone (design) and the picture now comes
 * from the app's own data like everywhere else, so drawing a player row no
 * longer depends on a third-party request.
 */
const PlayerInfo: React.FC<PlayerInfoProps> = ({
  profilePic,
  playerName,
  elo,
}) => {
  return (
    <div className="flex items-center gap-[12px] p-[12px] rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
      <GamePlayerAvatar imageUrl={profilePic} seed={playerName || "player"} />
      <div className="flex flex-col leading-tight min-w-0">
        <span className="font-bold text-[16px] text-[#111827] truncate">
          {playerName}
        </span>
        {elo ? (
          <span className="text-[14px] text-[#6B7280]">ELO {elo}</span>
        ) : null}
      </div>
    </div>
  );
};

export default PlayerInfo;
