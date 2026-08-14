import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { usePgnStore } from "@/app/store/zustandStore";
import InitialAvatar from "@/components/avatar/InitialAvatar";
import { GamePlayerAvatar } from "@/components/v2/game-player-avatar";
import { useTutorial } from "@/components/TutorialProvider";
import Image from "next/image";

interface BlackPlayerProps {
  winnerColor: string;
  statusGame: string;
  loserColor: string;
  myColor: string;
  AIChoosed: { opponent: { img: string; name: string; elo?: number } };
  capturedBlack: { capturedTheme: string }[];
  PieceChoosed: string;
}

export const BlackPlayer = ({
  winnerColor,
  statusGame,
  loserColor,
  myColor,
  AIChoosed,
  capturedBlack,
  PieceChoosed,
}: BlackPlayerProps) => {
  const { profile } = useProfileStore();
  const { leaderboard } = usePlayPageStore();
  const { username } = usePgnStore();
  const isBlackUser = myColor != "white";
  const blackElo = isBlackUser ? leaderboard?.my_elo : AIChoosed.opponent.elo;
  const isWin = winnerColor == "black";
  const isDraw = statusGame == "Draw";
  const isLoss = loserColor == "black";
  const avatarSeed = profile?.username || username || profile?.email || "user";

  const { isTutorialPlay } = useTutorial();

  return isTutorialPlay ? (
    <div className={`flex flex-row min-h-[80px] items-center justify-between rounded-[8px] border border-[#FD0000] bg-[rgb(253,0,0,.16)] px-[16px]`}>
      <div className="flex item-center gap-[10px] md:gap-[16px]">
        <InitialAvatar name={username || "Anonymous"} className="bg-white" textColor="text-black" />
        <span className="text-[#FD0000] flex items-center text-[14px] md:text-[16px]">AI</span>
      </div>
    
      {myColor === "white" ? (
        <Image src={"/images/tutorial-black-chess.png"} alt="..." width={220} height={44} />
      ) : (
        <Image src={"/images/tutorial-white-chess.png"} alt="..." width={220} height={44} />
      )}
    </div>
  ) : (
    <div
      className={`flex flex-row min-h-[80px] items-center justify-between rounded-[8px] border ${
        isWin
          ? "border-[#00B427] bg-[#00B42716]"
          : isDraw
          ? "border-[#221AE9] bg-[#221AE916]"
          : isLoss
          ? "border-[#FD0000] bg-[#FD000020]"
          : "border-[#DEDEDE] bg-white "
      } p-2 gap-2 mb-2`}
    >
      <div className="flex flex-row items-center gap-2">
        {myColor != "white" ? (
          <GamePlayerAvatar imageUrl={profile?.imageUrl} seed={avatarSeed} />
        ) : (
          <Image
            src={AIChoosed.opponent.img}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] rounded-full object-contain"
          />
        )}

        <div className="flex flex-col leading-tight">
          <span
            className={`text-[17.23px] font-medium ${
              isWin
                ? "text-[#00B427] "
                : isDraw
                ? "text-[#221AE9] "
                : isLoss
                ? "text-[#FD0000]  "
                : "text-[#040404]"
            }`}
          >
            {myColor != "white"
              ? username
              : AIChoosed.opponent.name.replace(/ .*/, "")}
          </span>
          {!!blackElo && (
            <span className="text-[13px] text-[#6B7280]">ELO {blackElo}</span>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center ">
        {capturedBlack &&
          capturedBlack.length > 0 &&
          capturedBlack.map((captured, index) => {
            const icon = captured.capturedTheme;
            const nextIcon = capturedBlack[index + 1]
              ? capturedBlack[index + 1].capturedTheme
              : "";
            if (icon.length != 2) return null;
            return (
              <div key={index} className={`${icon == nextIcon ? "-mr-2" : ""}`}>
                {icon && (
                  <Image
                    src={`/pieces/${PieceChoosed}/${icon}.png`}
                    alt="icon"
                    width={1000}
                    height={1000}
                    className="w-[20px] h-[28px] sm:w-[24px] sm:h-[32px] lg:w-[28px] lg:h-[36px] object-contain inline-block"
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
