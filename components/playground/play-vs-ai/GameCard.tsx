import { formatDateHistory } from "@/functions/format-date";
import Image from "next/image";
import { FC } from "react";
import { MdAccessTime } from "react-icons/md";

type GameCardProps = {
  result: "win" | "loss" | "draw";
  date: string;
  opponent: string;
  elo: number;
  moves: number;
  time: string;
};
const resultStyles = {
  win: {
    text: "You Won!",
    border: "#00B427",
    textColor: "#00B427",
    moveIcon: "#00B427",
  },
  draw: {
    text: "Draw!",
    border: "#221AE9",
    textColor: "#221AE9",
    moveIcon: "#221AE9",
  },
  loss: {
    text: "You Lost!",
    border: "#FD0000",
    textColor: "#FD0000",
    moveIcon: "#FD0000",
  },
  
};

const GameCard: FC<GameCardProps> = ({
  result,
  date,
  opponent,
  elo,
  moves,
  time,
}) => {
  const style = resultStyles[result];

  return (
    <div
      className={`flex flex-col border rounded-[8px] p-4 mb-3 shadow-sm border-[${style.border}] bg-[${style.border}16]`}
    >
      <div className="flex flex-row justify-between items-center">
        <div
          className={`flex flex-row items-center gap-2 font-semibold ${style.textColor}`}
        >
          <Image
            src={`/images/play-vs-ai/trophy-${result}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] object-contain"
          />
          <span>{style.text}</span>
        </div>
        <span className="text-gray-500 text-[14px] --sm">{formatDateHistory(date)}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 min-h-[18px] ">
        <div className="flex flex-row items-center gap-1">
          <span className="font-medium text-[14px] --">Vs {opponent}:</span>
          <Image
            src={`/images/play-vs-ai/elo-icon.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[12px] h-[12px] object-contain mb-1"
          />
          <span className="font-medium text-[14px]">ELO Rating: {elo}</span>
          <span className="font-medium text-[14px]">•</span>
        </div>

        <div className={`flex flex-row items-center gap-1`}>
          <div className={`flex flex-row items-center gap-1`}>
            <Image
              src={`/images/play-vs-ai/${result}-moves.png`}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[16px] h-[12px] object-contain mb-1"
            />
            <span className="font-medium text-[14px]">{moves} Moves </span>
          </div>
          <span className="font-medium text-[14px]">•</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
