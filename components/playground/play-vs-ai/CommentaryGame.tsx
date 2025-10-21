import { fadeInUp, motion } from "@/utils/motion";

import Image from "next/image";
interface CommentarGameProps {
  statusGame: string;
  lossReason: string | null;
}
export const CommentarGame = ({
  statusGame,
  lossReason,
}: CommentarGameProps) => {
  const gradColor =
    statusGame == "Win"
      ? `bg-[linear-gradient(to_right,_#FFFFFF58,_#00B427,_#00B427,_#00B427,_#00B427,_#00B427,_#00B427,_#FFFFFF40)]`
      : statusGame == "Draw"
      ? `bg-[linear-gradient(to_right,_#FFFFFF58,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#221AE9,_#FFFFFF40)]`
      : `bg-[linear-gradient(to_right,_#FFFFFF58,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#C01B1B,_#FFFFFF40)]`;
  const color =
    statusGame == "Win"
      ? "#00B427"
      : statusGame == "Draw"
      ? "#221AE9"
      : "#C01B1B";
  const icon =
    statusGame == "Win"
      ? "you-win"
      : statusGame == "Draw"
      ? "you-draw"
      : "you-loss";
  const sparks =
    statusGame == "Win"
      ? "sparks-win"
      : statusGame == "Draw"
      ? "sparks-draw"
      : "sparks-loss";

  const content =
    statusGame == "Win"
      ? "Congratulations! You won this game!"
      : statusGame == "Draw"
      ? "The Game ended in a Draw."
      : lossReason === "resign"
      ? "You lost by resigning the game"
      : "You lost by checkmate";
  return (
    <motion.div
      variants={fadeInUp}
      className={`relative justify-self-center w-[95%] mt-4 rounded-[8px] ${gradColor} border border-[${color}] p-[1px]`}
    >
      <div
        className={`flex h-[56px] flex-row items-center rounded-[8px] border-2 border-dashed border-[${color}] gap-3`}
      >
        <Image
          src={`/images/play-vs-ai/${icon}.png`}
          alt="icon"
          width={1000}
          height={1000}
          className="w-[30px] h-[30px] object-contain m-4 mr-0"
        />
        <span className="font-medium text-[14px] text-white">{content}</span>
        <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
          <Image
            src={`/images/play-vs-ai/${sparks}.png`}
            alt="icon"
            width={1000}
            height={1000}
            className="w-full h-[56px] object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
};
