import { fadeInUp, motion } from "@/utils/motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Eye, Plus } from "lucide-react";
import Image from "next/image";
import { useTutorial } from "@/components/TutorialProvider";
import { usePgnStore } from "@/app/store/zustandStore";

interface ButtonFinishProps {
  handleAnalyzeGame: () => void;
  handleNewGame: () => void;
  handleRematch: () => void;
  handleShare: () => void;
  handleDownload: () => void;
  handleSave: () => void;
  isSaving?: boolean;
  pgn: string;
  isSaved: boolean;
  hasAnalysis: boolean;
  onAnalyzeClick: () => void;
  onShowAnalysisClick: () => void;
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
  hasAnalysis,
  onAnalyzeClick,
  onShowAnalysisClick,
}: ButtonFinishProps) => {
  const { username } = usePgnStore();
  const { isTutorialPlay } = useTutorial();

  const renderButtonSave = () => {
    return (
      <TooltipProvider>
        <div className="flex flex-row items-center gap-2">
          {hasAnalysis ? (
            // Show "Show Analysis" button when analysis is completed
            <button
              type="button"
              onClick={onShowAnalysisClick}
              className="flex items-center justify-center font-medium text-[15px] gap-[8px] w-full md:w-1/4 xl:w-full rounded-full h-[40px] border-2 border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200"
            >
              <Eye className="h-4 w-4" />
              Show Analysis
            </button>
          ) : (
            // Show "Analyze Now" button when no analysis exists
            <button
              type="button"
              onClick={() => {
                console.log("🔘 Analyze Now button clicked in ButtonFinish");
                onAnalyzeClick();
              }}
              className="flex items-center justify-center font-medium text-[15px] gap-[8px] w-full md:w-1/4 xl:w-full rounded-full h-[40px] border-[3px] border-[#19A23C] bg-[#34C759] z-1 shadow-[0px_0px_1px_2px_rgba(52,199,89,.2] relative before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:inset-2 before:shadow-[0px_0px_0px_2px_#6AFB8F] before:z-5 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-10 after:rounded-full after:inset-2 after:shadow-[0px_2px_2px_0px_#0A6D23]"
              data-tutorial="play-vs-ai-step-3"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.3327V6.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13.3327V2.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 13.332V9.33203" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Analyze Now
            </button>
          )}
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
        {(username.length > 0 || isTutorialPlay) && renderButtonSave()}
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
          {(username.length > 0 || isTutorialPlay) && renderButtonSave()}
        </div>
      </div>
    </motion.div>
  );
};
