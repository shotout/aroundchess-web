import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import PlayerInfo from "./PlayerInfo";
import { UserBoardDisplayProps } from "../../types/default-pgn";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { CustomChessArrows } from "@/components/game-history/components/CustomChessArrows";
import { ArrowConfig } from "../../types/default-pgn";

const UserBoardDisplay: React.FC<UserBoardDisplayProps> = ({
  currentPosition,
  gameQuestion,
  highlightedSquares,
  arrows,
  leftPanelVariants,
  username,
  userProfilePic,
  opponentProfilePic,
  opponentName,
}) => {
  const isValidPosition =
    currentPosition &&
    currentPosition.fen &&
    typeof currentPosition.fen === "string" &&
    currentPosition.fen.includes(" ");

  const [boardSize, setBoardSize] = useState<number | undefined>(600);
  const [mounted, _] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Same rule as UserPGN: the side resolved from the game record's colour wins,
  // with the name match as the fallback for positions that predate it.
  const isUserPlayingWhite = currentPosition?.userColor
    ? currentPosition.userColor === "white"
    : currentPosition?.white?.toLowerCase() === username?.toLowerCase();

  // The account's profile picture follows its own name to whichever row that
  // name is in, like the vs-AI board and the sidebar; whatever the game data
  // carried is the fallback. It used to be pinned to the bottom row on the
  // assumption that the bottom row is always the signed-in player — but the
  // rows are assigned from the game record's own username (see below), so when
  // that names the other side, the account's own handle shows in the top row
  // and its picture stayed behind next to the opponent's name.
  //
  // Row names come from PGN headers, so they can be a chess.com handle, the
  // account's display name or its username. Match loosely (letters and digits
  // only) against every identity we hold, so "Tyo Sndr" still matches
  // "TyoSndr".
  const { profile } = useProfileStore();
  const { username: chessComUsername, usernameAnalysis } = usePgnStore();
  const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const accountNames = [
    profile?.username,
    profile?.name,
    typeof profile?.email === "string" ? profile.email.split("@")[0] : "",
    chessComUsername,
    usernameAnalysis,
  ]
    .filter((name): name is string => typeof name === "string" && name.trim() !== "")
    .map(normalize)
    .filter((name) => name !== "");
  const isAccount = (name?: string) =>
    !!name && accountNames.includes(normalize(name));
  // Only trust the top row as the account's when the bottom row isn't: with the
  // side resolved from the game record the bottom row is the player, and both
  // rows can carry an account identity (display name vs chess.com handle).
  const topIsAccount = isAccount(opponentName) && !isAccount(username);
  // When neither row matches (a PGN imported under some other handle) the
  // bottom row is still the player's own row, so it keeps the account picture.
  const topProfilePic = topIsAccount
    ? profile?.imageUrl || opponentProfilePic
    : opponentProfilePic;
  const bottomProfilePic = topIsAccount
    ? userProfilePic
    : profile?.imageUrl || userProfilePic;

  const userElo = isUserPlayingWhite
    ? currentPosition?.whiteElo
    : currentPosition?.blackElo;
  const opponentElo = isUserPlayingWhite
    ? currentPosition?.blackElo
    : currentPosition?.whiteElo;

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 3.2 : 480;

    // Get the actual container width
    const containerWidth = containerRef.current?.offsetWidth || width;
    const maxBoardWidth = Math.min(containerWidth - 40, 700); // 40px for padding, max 600px

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20, maxBoardWidth));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8, maxBoardWidth));
    }
  };

  if (!isValidPosition) {
    return (
      <motion.div
        className="border border-gray-200 md:col-span-6 p-4 rounded-md flex items-center justify-center"
        variants={leftPanelVariants}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Invalid position data</h2>
          <p>The chess position could not be displayed.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="xl:border border-[#E5E7EB] xl:bg-white xl:shadow-sm md:col-span-6 xl:p-4 p-0 mb-4 xl:mb-0 rounded-[16px] flex flex-col justify-center gap-[8px]"
      variants={leftPanelVariants}
    >
      {/* Player rows are a desktop affordance in the design; mobile shows the
          plain "white vs black" caption under the board instead. */}
      <div className="hidden xl:block">
        <PlayerInfo
          profilePic={topProfilePic}
          playerName={opponentName}
          elo={opponentElo}
        />
      </div>

      <div className="relative w-full flex justify-center items-center my-4" ref={containerRef}>
        <div className="bg-white flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex justify-center items-center">
            {/* Add max-width constraint and ensure the board fits within parent */}
            <div className="max-w-full relative" style={{ maxWidth: '100%' }}>
              <TwoDChessboard
                boardWidth={boardSize ?? 0}
                arePiecesDraggable={false}
                position={currentPosition.fen}
                orientation={isUserPlayingWhite ? "white" : "black"}
                areArrowsAllowed={false}
                customSquareStyles={highlightedSquares}
                onPromotionPieceSelect={function (
                  piece?: PromotionPieceOption,
                  promoteFromSquare?: Square,
                  promoteToSquare?: Square
                ): boolean {
                  throw new Error("Function not implemented.");
                }}
              />
              {/* Custom Arrows Overlay */}
              {arrows && arrows.length > 0 && !gameQuestion?.text.includes("legal moves") && (
                <CustomChessArrows
                  arrows={arrows as ArrowConfig[]}
                  boardSize={boardSize ?? 0}
                  orientation={isUserPlayingWhite ? "white" : "black"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden xl:block">
        <PlayerInfo
          profilePic={bottomProfilePic}
          playerName={username}
          elo={userElo}
        />
      </div>

      {/* Mobile caption, matching the design */}
      {currentPosition.white && currentPosition.black && (
        <p className="xl:hidden text-center text-[14px] text-[#111827] mt-[8px]">
          {currentPosition.white} VS {currentPosition.black}
        </p>
      )}
    </motion.div>
  );
};

export default UserBoardDisplay;