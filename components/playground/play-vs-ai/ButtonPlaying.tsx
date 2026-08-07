import DotSpinner from "@/components/game-history/Spinner";
import { fadeInUp, motion } from "@/utils/motion";
import Image from "next/image";

interface ButtonPlayingProps {
  currentTurn: string;
  myColor: string;
  hintClicked: boolean;
  bestLine: string | null;
  handleHint: () => void;
  handleResign: () => void;
  handleNewGame: () => void;
  /** False until the game is under way — there is nothing to resign from the
   *  opening position. Kept disabled rather than hidden so the three buttons
   *  hold their thirds of the row, same as Hint and the board's Undo. */
  canResign?: boolean;
}

export const ButtonPlaying = ({
  currentTurn,
  myColor,
  hintClicked,
  bestLine,
  handleHint,
  handleResign,
  handleNewGame,
  canResign = true,
}: ButtonPlayingProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex w-full rounded-[8px] sm:border-t border-t-[#DEDEDE] gap-[6px] px-[16px] sm:p-2"
    >
      <button
        disabled={
          currentTurn.toLowerCase() != myColor ||
          (!hintClicked && bestLine?.length == null)
        }
        onClick={handleHint}
        className={`flex flex-row rounded-full sm:rounded-[8px] justify-center items-center min-h-[32px] md:min-h-[40px] w-1/3 px-4 py-2 border ${
          hintClicked
            ? `border-[#221AE9] bg-[#221AE908] text-[#221AE9]`
            : `border-[#DEDEDE] bg-white`
        }  hover:bg-blue-100 gap-1`}
      >
        {!hintClicked && bestLine?.length == null ? (
          <DotSpinner size={5} />
        ) : (
          <>
            {hintClicked ? (
              <Image
                src={"/images/play-vs-ai/hint.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[12px] h-[16px] sm:w-[16px] sm:h-[20px] object-contain"
              />
            ) : (
              <Image
                src={"/images/play-vs-ai/hint-icon.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[12px] h-[16px] sm:w-[16px] sm:h-[20px] object-contain"
              />
            )}
            <span className="font-medium text-[14px] --xs mt-1 ">Hint</span>
          </>
        )}
      </button>
      <button
        onClick={handleResign}
        disabled={!canResign}
        className="flex flex-row justify-center bg-[#E6F7FE] border-[#C6EEFE] shadow-inner shadow-white drop-shadow sm:bg-white items-center min-h-[32px] md:min-h-[40px] w-1/3 px-4 py-2 border sm:border-[#DEDEDE] rounded-full sm:rounded-[8px] hover:bg-gray-100 gap-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#E6F7FE] sm:disabled:hover:bg-white"
      >
        <Image
          src={"/images/play-vs-ai/resign.png"}
          alt="icon"
          width={1000}
          height={1000}
          className="w-[11px] h-[16px] object-contain "
        />

        <span className="font-medium text-[14px] --xs mt-1 text-blue-base sm:text-black ">
          Resign
        </span>
      </button>
      <button
        onClick={handleNewGame}
        className="
        bg-blue-base border-[#1B14CC] shadow-inner shadow-[#4E47FF] sm:shadow-none sm:bg-transparent drop-shadow rounded-full
        flex flex-row items-center justify-center min-h-[32px] md:min-h-[40px] w-1/3 px-[4px] md:px-4 py-2 border sm:border-[#DEDEDE] sm:rounded-[8px] hover:bg-gray-100 gap-x-1"
      >
        <Image
          src={"/images/play-vs-ai/new-game.png"}
          alt="icon"
          width={16}
          height={16}
          className="w-[16px] h-[16px] object-contain invert-[100%] md:invert-0 grayscale-[100%] md:grayscale-0"
        />
        <span className="font-medium text-[13px] --xs mt-1 text-white sm:text-black">
          New Game
        </span>
      </button>
    </motion.div>
  );
};