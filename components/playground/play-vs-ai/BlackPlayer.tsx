import { useProfileStore } from "@/app/store/profile";
import InitialAvatar from "@/components/avatar/InitialAvatar";
import Image from "next/image";

interface BlackPlayerProps {
  winnerColor: string;
  statusGame: string;
  loserColor: string;
  myColor: string;
  AIChoosed: { opponent: { img: string; name: string } };
  user: any;
  capturedBlack: { capturedTheme: string }[];
  PieceChoosed: string;
}

export const BlackPlayer = ({
  winnerColor,
  statusGame,
  loserColor,
  myColor,
  AIChoosed,
  user,
  capturedBlack,
  PieceChoosed,
}: BlackPlayerProps) => {
  const { profile } = useProfileStore();
  let isWin = winnerColor == "black";
  let isDraw = statusGame == "Draw";
  let isLoss = loserColor == "black";
  return (
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
          <InitialAvatar name={profile?.name} size="sm" />
        ) : (
          <Image
            src={AIChoosed.opponent.img}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] rounded-full object-contain"
          />
        )}

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
          {myColor != "white" ? "You" : AIChoosed.opponent.name}
          {/* <div className="text-center">
              <h2 className="text-xl">{blackTime}</h2>
            </div> */}
        </span>
      </div>
      <div className="flex flex-row items-center ">
        {capturedBlack &&
          capturedBlack.length > 0 &&
          capturedBlack.map((captured, index) => {
            let icon = captured.capturedTheme;
            let nextIcon = capturedBlack[index + 1]
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
