import { usePgnStore } from "@/app/store/zustandStore";
import { AnalyzeGameHistory } from "@/components/game-history/components/AnalyzeGameHistory";
import ChooseAnalysisMode from "@/components/game-history/components/ChooseAnalysisMode";
import GameAnalysis from "@/components/game-history/components/GameAnalysis";
import ProcessingAnalysisMode from "@/components/game-history/components/ProcessingAnalysisMode";
import { fadeInUp, motion } from "@/utils/motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Eye, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { createPgnHash } from "@/utils/crypto-utils";
import { useProfileStore } from "@/app/store/profile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
}

interface LastAnalysisResponse {
  success: boolean;
  message: string;
  data?: any;
  statusCode: number;
}

const endpoint = process.env.BASE_URL;

const fetchLastAnalysis = async (
  pgnHash: string,
  sessionId: string
): Promise<LastAnalysisResponse | null> => {
  try {
    const response = await fetch(
      `${endpoint}/v2/analyze/last-analysis/${pgnHash}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch analysis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching last analysis:", error);
    return null;
  }
};

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
}: ButtonFinishProps) => {
  const router = useRouter();
  const { username, setPgn, setDataAnalysis, setDataGamesImport, setIsFromGameHistory } = usePgnStore();
  const { getJobByGameId } = useBackgroundAnalysisStore();
  const { sessionId } = useProfileStore();

  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [isChooseAnalysisModeOpen, setIsChooseAnalysisModeOpen] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [shortAnalysisData, setShortAnalysisData] = useState<any>(null);
  const [processingAnalysisModeOpen, setProcessingAnalysisModeOpen] = useState(false);
  const [gameAnalysisOpen, setGameAnalysisOpen] = useState(false);
  const [v3AnalysisResult, setV3AnalysisResult] = useState<any>(null);

  // Create game object from PGN with stable ID using useMemo
  const gameFromPgn = useMemo(() => {
    // Create a unique hash from the full PGN to ensure each game has a unique ID
    const pgnHash = createPgnHash(pgn);
    const gameId = `play-vs-ai-${pgnHash}`;

    return {
      id: gameId,
      pgn: pgn,
      username: username || "Unknown",
      opponent: "AI",
      date: new Date().toLocaleDateString(),
      timeControl: "N/A",
      result: "Game Finished",
      rating: "N/A",
      timeClass: "Play vs AI",
      moves: "N/A",
      opening: "N/A",
      source: "Play vs AI",
    };
  }, [pgn, username]);

  // Check if analysis exists for this game
  useEffect(() => {
    const checkAnalysis = () => {
      const job = getJobByGameId(gameFromPgn.id);

      // Ensure the job is completed, has a result, AND the PGN matches this game
      const hasCompletedAnalysis =
        job?.status === "completed" &&
        !!job.result &&
        job.pgn === gameFromPgn.pgn;

      if (hasCompletedAnalysis && !hasAnalysis) {
        console.log("✅ Analysis completed detected!");
        console.log("📊 Job:", job);
        console.log("🎮 Game ID:", gameFromPgn.id);
        console.log("📋 PGN match:", job.pgn === gameFromPgn.pgn);
      }

      if (job && !hasCompletedAnalysis) {
        console.log("⏳ Job found but not ready:", {
          status: job.status,
          hasResult: !!job.result,
          pgnMatch: job.pgn === gameFromPgn.pgn,
        });
      }

      setHasAnalysis(hasCompletedAnalysis);
    };

    checkAnalysis();
    // Poll every second to check for completed analysis
    const interval = setInterval(checkAnalysis, 1000);

    return () => clearInterval(interval);
  }, [gameFromPgn.id, gameFromPgn.pgn, getJobByGameId, hasAnalysis]);

  // Handle "Show Analysis" click
  const handleShowAnalysis = async () => {
    console.log("🔍 ButtonFinish: handleShowAnalysis called");
    console.log("🎮 Game ID:", gameFromPgn.id);
    console.log("📋 PGN:", gameFromPgn.pgn?.substring(0, 100));

    toast.info("Loading analysis...");

    try {
      const job = getJobByGameId(gameFromPgn.id);
      console.log("💼 Job data:", job);

      const pgnHash = createPgnHash(gameFromPgn.pgn);
      console.log("🔑 PGN Hash:", pgnHash);

      const lastAnalysis = await fetchLastAnalysis(pgnHash, sessionId);
      console.log("📊 Last analysis response:", lastAnalysis);

      if (lastAnalysis?.success && lastAnalysis.data) {
        console.log("✅ Using server analysis data");
        console.log("📈 Analysis data keys:", Object.keys(lastAnalysis.data));

        setPgn(gameFromPgn.pgn);
        setDataGamesImport(gameFromPgn);
        setDataAnalysis(lastAnalysis.data);
        setIsFromGameHistory(true);

        console.log("🚀 Navigating to /analysis with server data");
        toast.success("Opening analysis...");
        router.push("/analysis");
      } else {
        console.log("⚠️ Server analysis not available, trying job result");
        if (job && job.result) {
          console.log("✅ Using job result data");
          console.log("📈 Job result keys:", Object.keys(job.result));

          setPgn(gameFromPgn.pgn);
          setDataGamesImport(gameFromPgn);
          setDataAnalysis(job.result);
          setIsFromGameHistory(true);

          console.log("🚀 Navigating to /analysis with job data");
          toast.success("Opening analysis...");
          router.push("/analysis");
        } else {
          console.error("❌ No analysis found for this game");
          console.log("Falling back to analyze dialog");
          toast.error("No analysis data found. Please analyze the game first.");
          setIsAnalyzeOpen(true);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching analysis:", error);
      const job = getJobByGameId(gameFromPgn.id);
      console.log("🔄 Attempting fallback with job:", job);

      if (job && job.result) {
        console.log("✅ Using fallback job result");
        setPgn(gameFromPgn.pgn);
        setDataGamesImport(gameFromPgn);
        setDataAnalysis(job.result);
        setIsFromGameHistory(true);

        console.log("🚀 Navigating to /analysis with fallback job data");
        toast.success("Opening analysis...");
        router.push("/analysis");
      } else {
        console.error("❌ No fallback data available");
        toast.error("Failed to load analysis. Please try again.");
      }
    }
  };

  const renderButtonSave = () => {
    return (
      <TooltipProvider>
        <div className="flex flex-row items-center gap-2">
          {hasAnalysis ? (
            // Show "Show Analysis" button when analysis is completed
            <button
              type="button"
              onClick={handleShowAnalysis}
              className="flex items-center justify-center font-medium text-[15px] gap-[8px] w-full md:w-1/4 xl:w-full rounded-full h-[40px] border-2 border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200"
            >
              <Eye className="h-4 w-4" />
              Show Analysis
            </button>
          ) : (
            // Show "Analyze Now" button when no analysis exists
            <button
              type="button"
              onClick={() => setIsAnalyzeOpen(true)}
              className="flex items-center justify-center font-medium text-[15px] gap-[8px] w-full md:w-1/4 xl:w-full rounded-full h-[40px] border-[3px] border-[#19A23C] bg-[#34C759] z-1 shadow-[0px_0px_1px_2px_rgba(52,199,89,.2] relative before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:inset-2 before:shadow-[0px_0px_0px_2px_#6AFB8F] before:z-5 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-10 after:rounded-full after:inset-2 after:shadow-[0px_2px_2px_0px_#0A6D23]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.3327V6.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13.3327V2.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 13.332V9.33203" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Analyze Now
            </button>
          )}

          <AnalyzeGameHistory
            open={isAnalyzeOpen}
            onOpenChange={setIsAnalyzeOpen}
            game={gameFromPgn}
            onAnalysisStarted={() => {
              // Open ChooseAnalysisMode when analysis starts
              setIsChooseAnalysisModeOpen(true);
            }}
            onShortAnalysisReceived={(data) => {
              console.log("📥 ButtonFinish received short-analysis data:", data);
              setShortAnalysisData(data);
            }}
          />
          <ChooseAnalysisMode
            open={isChooseAnalysisModeOpen}
            onOpenChange={setIsChooseAnalysisModeOpen}
            game={gameFromPgn}
            shortAnalysisData={shortAnalysisData}
            onOpenProcessingMode={() => {
              console.log("🔄 Opening ProcessingAnalysisMode from ButtonFinish");
              setProcessingAnalysisModeOpen(true);
            }}
          />
          <ProcessingAnalysisMode
            open={processingAnalysisModeOpen}
            onOpenChange={setProcessingAnalysisModeOpen}
            game={gameFromPgn}
            onOpenGameAnalysis={(v3Result) => {
              console.log("🎯 Opening GameAnalysis from ButtonFinish");
              console.log("📦 Received v3Result from ProcessingAnalysisMode:", v3Result);
              setV3AnalysisResult(v3Result);
              setGameAnalysisOpen(true);
            }}
          />
          <GameAnalysis
            open={gameAnalysisOpen}
            onOpenChange={setGameAnalysisOpen}
            v3Result={v3AnalysisResult}
          />

          {/* <button
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={` w-full md:w-1/4 xl:w-full rounded-full h-[40px] border border-[#C0CED4] ${
              isSaved ? "bg-green-600":"btn-primary"
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
          </button> */}
          {/* <MobileTooltip
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
          </MobileTooltip> */}
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
        {/* {renderAnalyzeButton("w-full")} */}
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
          {/* {renderAnalyzeButton("w-full")} */}
          {username.length > 0 && renderButtonSave()}
        </div>
      </div>
    </motion.div>
  );
};
