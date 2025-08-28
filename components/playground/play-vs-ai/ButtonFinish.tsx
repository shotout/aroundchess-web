import { ChooseDepthAnalyze } from "@/components/modal/ChooseDepthAnalyze";
import { fadeInUp, motion } from "@/utils/motion";
import { Loader2,Plus,Save } from "lucide-react";
import Image from "next/image";

interface ButtonFinishProps {
  handleAnalyzeGame: () => void;
  handleNewGame: () => void;
  handleRematch: () => void;
  handleShare: () => void;
  handleDownload: () => void;
  handleSave: () => void;
  isSaving?: boolean;
  pgn: string;
  getAnalysisButtonContent?: () => {
    text: string;
    icon: React.ReactNode;
    className: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export const ButtonFinish = ({
  handleAnalyzeGame,
  handleNewGame,
  handleRematch,
  handleShare,
  handleDownload,
  handleSave,
  isSaving,
  pgn,
  getAnalysisButtonContent,
}: ButtonFinishProps) => {
  const analysisButton = getAnalysisButtonContent ? getAnalysisButtonContent() : null;

  const renderAnalyzeButton = (className: string) => {
    if (!analysisButton) {
      return <ChooseDepthAnalyze pgnParam={pgn} style={className} />;
    }

    return (
      <button
        onClick={analysisButton.onClick}
        disabled={analysisButton.disabled}
        className={`${analysisButton.className} ${className} rounded-full h-[40px] flex items-center justify-center transition-colors duration-150 ${
          analysisButton.disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="flex flex-row items-center justify-center gap-2">
          {analysisButton.icon}
          <span className="font-medium">{analysisButton.text}</span>
        </div>
      </button>
    );
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col w-full rounded-[8px] sm:border-t border-t-[#DEDEDE] gap-3 px-5 sm:p-4"
    >
      <div className="md:hidden xl:block">
        {renderAnalyzeButton("w-full")}
      </div>

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
        <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white w-full md:w-1/4 xl:w-full rounded-full h-[40px] border border-[#C0CED4]"
        >
          {/* <div className="flex flex-row items-center justify-center gap-2">
            <Save color="#221AE9" className="w-[20px] h-[20px]" size={20} />
            <span className="text-[#221AE9] font-medium">Save Game</span>
          </div> */}
          {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
          ) : (
              <>
                <div className="flex flex-row items-center justify-center gap-2">
                  <Save color="#221AE9" className="w-[20px] h-[20px]" size={20} />
                  <span className="text-[#221AE9] font-medium">Save Game</span>
                </div>
              </>
          )}
        </button>

        <div className="hidden md:block xl:hidden md:w-2/4">
          {renderAnalyzeButton("w-full")}
        </div>
      </div>
    </motion.div>
  );
};
