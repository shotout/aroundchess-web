import { fadeInUp, motion } from "@/utils/motion";
import { BarChart2, Plus } from "lucide-react";

import Image from "next/image";
import { FaClipboard } from "react-icons/fa";
import { GrClipboard } from "react-icons/gr";
interface ButtonFinishProps {
  handleAnalyzeGame: () => void;
  handleNewGame: () => void;
  handleRematch: () => void;
  handleShare: () => void;
  handleDownload: () => void;
}

export const ButtonFinish = ({
  handleAnalyzeGame,
  handleNewGame,
  handleRematch,
  handleShare,
  handleDownload,
}: ButtonFinishProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col w-full rounded-[8px] border-t border-t-[#DEDEDE] gap-3 p-4"
    >
      <button
        onClick={handleAnalyzeGame}
        className="md:hidden xl:block btn-primary w-full rounded-full h-[40px]"
      >
        <div className="flex flex-row items-center justify-center gap-2">
          <BarChart2 color="white" className="w-[20px] h-[20px]" size={20} />
          <span>Analyze Game</span>
        </div>
      </button>
      <div className="flex w-full gap-2">
        <button
          onClick={handleShare}
          className="bg-white w-full md:w-1/4 xl:w-full rounded-full h-[40px] border border-[#C0CED4]"
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <Image
              alt="clipboard"
              src={"/images/play-vs-ai/clipboard.png"}
              width={1000}
              height={1000}
              className="h-[20px] w-[20px]"
            />
            <span className="font-medium text-[16px] text-[#221AE9]">
              Share PGN/FEN
            </span>
          </div>
        </button>
        <button
          onClick={handleNewGame}
          className="btn-secondary w-full md:w-1/4 xl:w-full rounded-full h-[40px]"
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <Plus color="#221AE9" className="w-[20px] h-[20px]" size={20} />
            <span className="text-[#221AE9] font-medium">New Game</span>
          </div>
        </button>
        {/* <button
          onClick={handleRematch}
          className="btn-tertiary w-full md:w-1/4 xl:w-full rounded-full h-[40px]"
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <Image
              src={"/images/play-vs-ai/rematch.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-[16px] h-[16px] object-contain"
            />
            <span className="text-[#221AE9] font-medium">Rematch</span>
          </div>
        </button> */}

        <button
          onClick={handleAnalyzeGame}
          className="hidden md:block xl:hidden md:w-2/4 btn-primary w-full rounded-full h-[40px]"
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <BarChart2 color="white" className="w-[20px] h-[20px]" size={20} />
            <span>Analyze Game</span>
          </div>
        </button>
      </div>
      {/* <div className="flex w-full gap-2">
        <button
          onClick={handleShare}
          className="flex flex-row items-center justify-center min-h-[40px] w-full px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
        >
          <Image
            src={"/images/play-vs-ai/share-filled.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[16px] h-[16px] object-contain"
          />
          <span className="font-medium text-xs mt-1">Share</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex flex-row items-center justify-center min-h-[40px] w-full px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
        >
          <Image
            src={"/images/play-vs-ai/download-filled.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[16px] h-[16px] object-contain"
          />
          <span className="font-medium text-xs mt-1">Download</span>
        </button>
      </div> */}
    </motion.div>
  );
};
