import React, { useState } from "react";
import {
  ChartNoAxesColumn,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Game } from "@/components/game-history/types/GameHistoryTypes";
import { AnalyzeGameHistory } from "./AnalyzeGameHistory";
import { useRouter } from "next/navigation";
import { usePgnStore } from "@/app/store/zustandStore";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { createPgnHash } from "@/utils/crypto-utils";
import { useProfileStore } from "@/app/store/profile";
import { useTutorial } from "@/components/TutorialProvider";
import ChooseAnalysisMode from "./ChooseAnalysisMode";
import ProcessingAnalysisMode from "./ProcessingAnalysisMode";
import GameAnalysis from "./GameAnalysis";

interface GameCardProps {
  gameData: Game;
  isNewlyImported?: boolean;
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

const GameCard: React.FC<GameCardProps> = ({
  gameData,
  isNewlyImported = false,
}) => {
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const [isChooseAnalysisModeOpen, setIsChooseAnalysisModeOpen] = useState(false);
  const [shortAnalysisData, setShortAnalysisData] = useState<any>(null);
  const [processingAnalysisModeOpen, setProcessingAnalysisModeOpen] = useState(false);
  const [gameAnalysisOpen, setGameAnalysisOpen] = useState(false);
  const [v3AnalysisResult, setV3AnalysisResult] = useState<any>(null);
  const router = useRouter();
  const { isTutorialPlay, stepFocused } = useTutorial();
  const { getJobByGameId } = useBackgroundAnalysisStore();
  const { setPgn, setDataAnalysis, setDataGamesImport, setIsFromGameHistory } =
    usePgnStore();
  const { sessionId } = useProfileStore();

  const displayMoves = (moves: number | string) => {
    if (!moves || moves === "N/A") {
      return "N/A";
    }

    const numMoves = typeof moves === "string" ? parseInt(moves) : moves;

    return numMoves.toString();
  };

  const getButtonContent = () => {
    const job = getJobByGameId(gameData.id);
    if (isTutorialPlay && stepFocused == 3 && isNewlyImported) {
      return {
        text: "In progress 40%",
        icon: <Loader2 className="h-4 w-4 mr-2 animate-spin" />,
        className:
          "border border-[#FFE057] bg-gradient-to-b from-[#EEC602] to-[#EE9402] hover:[#EE9402] hover:to-[#EE9402] text-white shadow-sm ring-1 ring-yellow-200",
        onClick: () => {},
        disabled: true,
      };
    } else if (isTutorialPlay && stepFocused == 5 && isNewlyImported) {
      return {
        text: "View Analysis",
        icon: <CheckCircle className="h-4 w-4 mr-2" />,
        className:
          "border border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200",
        onClick: async () => {
          null;
        },
        disabled: true,
      };
    } else if (gameData.isAnalysis || (job && job.status === "completed")) {
      return {
        text: "View Analysis",
        icon: <CheckCircle className="h-4 w-4 mr-2" />,
        className:
          "border border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200",
        onClick: async () => {
          try {
            const pgnHash = createPgnHash(gameData.pgn);
            const lastAnalysis = await fetchLastAnalysis(pgnHash, sessionId);

            if (lastAnalysis?.success && lastAnalysis.data) {
              setPgn(gameData.pgn);
              setDataGamesImport(gameData);
              setDataAnalysis(lastAnalysis.data);
              setIsFromGameHistory(true);
              router.push("/analysis");
            } else {
              if (job && job.result) {
                setPgn(gameData.pgn);
                setDataGamesImport(gameData);
                setDataAnalysis(job.result);
                setIsFromGameHistory(true);
                router.push("/analysis");
              } else {
                console.error("No analysis found for this game");
                setIsAnalyzeOpen(true);
              }
            }
          } catch (error) {
            console.error("Error fetching analysis:", error);
            if (job && job.result) {
              setPgn(gameData.pgn);
              setDataGamesImport(gameData);
              setDataAnalysis(job.result);
              setIsFromGameHistory(true);
              router.push("/analysis");
            } else {
              setIsAnalyzeOpen(true);
            }
          }
        },
        disabled: false,
      };
    }

    if (job) {
      switch (job.status) {
        case "pending":
        case "processing":
        case "waiting":
        case "finalizing":
          // Show normal "Analyze" button but open ChooseAnalysisMode instead
          return {
            text: "Analyze",
            icon: <ChartNoAxesColumn className="h-4 w-4 mr-2" />,
            className:
              "border border-[#BDD0F9] bg-gradient-to-b from-blue-600 to-[#221AE9] hover:from-blue-700 hover:to-blue-800 text-white shadow-md",
            onClick: () => {
              // Open ChooseAnalysisMode to view progress
              setIsChooseAnalysisModeOpen(true);
            },
            disabled: false,
          };
        case "failed":
          return {
            text: "Retry",
            icon: <AlertCircle className="h-4 w-4 mr-2" />,
            className:
              "border border-white bg-red-600 hover:bg-red-700 border border-white text-white shadow-sm ring-1 ring-red-200",
            onClick: () => setIsAnalyzeOpen(true),
            disabled: false,
          };
      }
    }

    return {
      text: "Analyze",
      icon: <ChartNoAxesColumn className="h-4 w-4 mr-2" />,
      className:
        "border border-[#BDD0F9] bg-gradient-to-b from-blue-600 to-[#221AE9] hover:from-blue-700 hover:to-blue-800 text-white shadow-md",
      onClick: () => setIsAnalyzeOpen(true),
      disabled: false,
    };
  };

  const infoRows = [
    [
      { label: "Opponent", value: gameData.opponent },
      { label: "Rating", value: gameData.rating },
      { label: "Time Control", value: gameData.timeControl },
    ],
    [
      { label: "Opening", value: gameData.opening },
      { label: "Moves", value: displayMoves(gameData.moves) },
      { label: "Source", value: gameData.source },
    ],
  ];
  const btn = getButtonContent();

  return (
    <>
      <AnalyzeGameHistory
        open={isAnalyzeOpen}
        onOpenChange={setIsAnalyzeOpen}
        game={gameData}
        onAnalysisStarted={() => {
          // Open ChooseAnalysisMode when analysis starts
          setIsChooseAnalysisModeOpen(true);
        }}
        onShortAnalysisReceived={(data) => {
          console.log("📥 GameCard received short-analysis data:", data);
          setShortAnalysisData(data);
        }}
      />

      <ChooseAnalysisMode
        open={isChooseAnalysisModeOpen}
        onOpenChange={setIsChooseAnalysisModeOpen}
        game={gameData}
        shortAnalysisData={shortAnalysisData}
        onOpenProcessingMode={() => {
          console.log("🔄 Opening ProcessingAnalysisMode from GameCard");
          setProcessingAnalysisModeOpen(true);
        }}
      />

      <ProcessingAnalysisMode
        open={processingAnalysisModeOpen}
        onOpenChange={setProcessingAnalysisModeOpen}
        game={gameData}
        onOpenGameAnalysis={(v3Result) => {
          console.log("🎯 Opening GameAnalysis from GameCard");
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
      
      <div
        className={`p-4 border md:rounded-md relative ${
          (!gameData.hasViewedAnalysis && gameData.isAnalysis) ||
          isNewlyImported
            ? "bg-[#FFF6DB]"
            : ""
        }`}
        data-tutorial="1"
      >
        <div className="flex justify-between items-center mb-4 text-[14px] --xs">
          <div className="text-gray-500">{gameData.date}</div>
          <div className={`font-semibold ${gameData.resultColor}`}>
            {gameData.result}
          </div>
        </div>

        <div className="space-y-4 mb-4">
          {infoRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2">
              {row.map((item, itemIndex) => (
                <div key={itemIndex} className="text-[14px] --xs min-w-0">
                  <div className="flex flex-col gap-y-1">
                    <h3 className="text-gray-500">{item.label}</h3>
                    <div className="w-full overflow-hidden">
                      <p
                        className="font-bold truncate w-full block"
                        title={item.value}
                        style={{ maxWidth: "100%" }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {(() => {
          const buttonContent = getButtonContent();
          return (
            <Button
              className={`w-full p-[10px] rounded-3xl ${buttonContent.className} h-[36px] text-white`}
              onClick={buttonContent.onClick}
              disabled={buttonContent.disabled}
            >
              {buttonContent.icon}
              <h1 className="text-[14px] --xs">{buttonContent.text}</h1>
            </Button>
          );
        })()}

        {/* {isNewlyImported && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-[14px] --xs rounded-full">
            New
          </span>
        )} */}
      </div>
    </>
  );
};

export default GameCard;
