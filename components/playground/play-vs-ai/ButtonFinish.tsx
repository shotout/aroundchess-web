import { usePgnStore } from "@/app/store/zustandStore";
import { MobileTooltip } from "@/components/game-history/components/user-history/Analytics";
import { ChooseDepthAnalyze } from "@/components/modal/ChooseDepthAnalyze";
import { fadeInUp, motion } from "@/utils/motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Info, Loader2, Plus, Save } from "lucide-react";
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
  isSaved: boolean;
}

export const ButtonFinish = ({
  handleAnalyzeGame,
  handleNewGame,
  handleRematch,
  handleShare,
  handleDownload,
  handleSave,
  isSaving,
  isSaved,
  pgn,
  getAnalysisButtonContent,
}: ButtonFinishProps) => {
  const { username } = usePgnStore();
  const analysisButton = getAnalysisButtonContent
    ? getAnalysisButtonContent()
    : null;

  const renderAnalyzeButton = (className: string) => {
    if (!analysisButton) {
      return <ChooseDepthAnalyze pgnParam={pgn} style={className} />;
    }

    return (
      <button
        onClick={analysisButton.onClick}
        disabled={analysisButton.disabled}
        className={`${
          analysisButton.className
        } ${className} rounded-full h-[40px] flex items-center justify-center transition-colors duration-150 ${
          analysisButton.disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex flex-row items-center justify-center gap-2">
          {analysisButton.icon}
          <span className="font-medium">{analysisButton.text}</span>
        </div>
      </button>
    );
  };
  const renderButtonSave = () => {
    // While auto-save is in progress, show the existing "Saving..." state.
    // After the game has been saved (isSaved && !isSaving), replace the save button
    // with the Analyze flow so the user can analyze this game immediately.
    if (analysisButton && isSaved && !isSaving) {
      return renderAnalyzeButton("w-full");
    }

    return (
      <TooltipProvider>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={` w-full md:w-1/4 xl:w-full rounded-full h-[40px] border border-[#C0CED4] ${
              isSaved ? "bg-green-600" : "btn-primary"
            }`}
          >
            {isSaving ? (
              <div className="flex flex-row items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#221AE9]" />
                <span className="text-[#fff] font-medium">Saving...</span>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-2">
                <Save color="#fff" className="w-[20px] h-[20px]" size={20} />
                <span className="text-[#fff] font-medium">
                  {isSaved ? "Game Saved" : "Save Game"}
                </span>
              </div>
            )}
          </button>
          <MobileTooltip
            content={[
              `The game will be saved in the "Other Games" category of the
                  Game History. If you would like to Analyze this Game, please
                  visit your Game History.`,
            ]}
            side="left"
          >
            <Info
              color="#221AE9"
              className="h-[24] w-[24] text-gray-500 hover:text-gray-700"
            />
          </MobileTooltip>
        </div>
      </TooltipProvider>
    );
  };
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col w-full rounded-[8px] sm:border-t border-t-[#DEDEDE] gap-3 px-5 sm:p-4"
    >
      <div className="md:hidden xl:block">
        {username.length > 0 && renderButtonSave()}
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

        <div className="hidden md:block xl:hidden md:w-2/4">
          {username.length > 0 && renderButtonSave()}
        </div>
      </div>
    </motion.div>
  );
};
