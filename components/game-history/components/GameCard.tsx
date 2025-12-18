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

const fetchLastAnalysisV2 = async (
  pgnHash: string,
  sessionId: string
): Promise<LastAnalysisResponse | null> => {
  try {
    const response = await fetch(
      `${endpoint}/v2/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch v2 analysis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching v2 last analysis:", error);
    return null;
  }
};

const fetchLastAnalysisV3 = async (
  pgnHash: string,
  sessionId: string
): Promise<LastAnalysisResponse | null> => {
  try {
    const response = await fetch(
      `${endpoint}/v3/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch v3 analysis: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching v3 last analysis:", error);
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
  const [v2AnalysisData, setV2AnalysisData] = useState<any>(null);
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
            console.log("📤 [GameCard - View Analysis] Fetching v2 and v3 last-analysis");

            const pgnHash = createPgnHash(gameData.pgn);
            console.log("📤 [GameCard - View Analysis] PGN Hash:", pgnHash);

            // Fetch from both v2 and v3 endpoints in parallel
            const [v2Analysis, v3Analysis] = await Promise.all([
              fetchLastAnalysisV2(pgnHash, sessionId),
              fetchLastAnalysisV3(pgnHash, sessionId)
            ]);

            console.log("📥 [GameCard - View Analysis] V2 Response:", v2Analysis);
            console.log("📥 [GameCard - View Analysis] V3 Response:", v3Analysis);

            // Store both v2 and v3 results
            setV2AnalysisData(v2Analysis);
            setShortAnalysisData(v3Analysis);

            if (v3Analysis?.success && v3Analysis.data) {
              console.log("✅ [GameCard - View Analysis] V3 Analysis found, opening ChooseAnalysisMode");

              // Open ChooseAnalysisMode dialog with both v2 and v3 data
              setIsChooseAnalysisModeOpen(true);
            } else {
              console.log("⚠️ [GameCard - View Analysis] No v3 analysis found in response");

              if (job && job.result) {
                console.log("📦 [GameCard - View Analysis] Using job result as fallback");
                setShortAnalysisData({ data: job.result });
                setIsChooseAnalysisModeOpen(true);
              } else {
                console.error("❌ [GameCard - View Analysis] No analysis found for this game");
                setIsAnalyzeOpen(true);
              }
            }
          } catch (error) {
            console.error("❌ [GameCard - View Analysis] Error fetching analysis:", error);

            // Fallback to job result if available
            if (job && job.result) {
              console.log("📦 [GameCard - View Analysis] Using job result as error fallback");
              setShortAnalysisData({ data: job.result });
              setIsChooseAnalysisModeOpen(true);
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
          // Show "View Analysis" button (green) to indicate analysis is in progress
          return {
            text: "View Analysis",
            icon: <CheckCircle className="h-4 w-4 mr-2" />,
            className:
              "border border-white bg-gradient-to-b from-[#0AD847] to-[#018F34] hover:[#018F34] hover:to-[#018F34] text-white shadow-sm ring-1 ring-green-200",
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
        v2AnalysisData={v2AnalysisData}
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
        className={`px-[16px] py-[8px] md:p-4 border-t border-b mx-[-16px] md:rounded-md relative ${
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
