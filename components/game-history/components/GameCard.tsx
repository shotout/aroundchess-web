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

interface GameCardProps {
  gameData: Game;
  onAnalyze: (game: Game) => void;
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
  onAnalyze,
  isNewlyImported = false,
}) => {
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);
  const router = useRouter();
  const { getJobByGameId } = useBackgroundAnalysisStore();
  const {
    setPgn,
    setDataAnalysis,
    setDataGamesImport,
    setIsFromGameHistory,
  } = usePgnStore();
  const { sessionId } = useProfileStore();

  const getButtonContent = () => {
    const job = getJobByGameId(gameData.id);

    if (gameData.isAnalysis || (job && job.status === "completed")) {
      return {
        text: "View Results",
        icon: <CheckCircle className="h-4 w-4 mr-2" />,
        className: "bg-green-600 hover:bg-green-700",
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
        case "processing": {
          const progressText =
            job.progress > 0 ? `In Progress ${job.progress}%` : "In Progress";
          return {
            text: progressText,
            icon: <Loader2 className="h-4 w-4 mr-2 animate-spin" />,
            className: "bg-yellow-500 hover:bg-yellow-600",
            onClick: () => {},
            disabled: true,
          };
        }
        case "finalizing":
          return {
            text: "Finalizing...",
            icon: <Loader2 className="h-4 w-4 mr-2 animate-spin" />,
            className: "bg-blue-500 hover:bg-blue-600",
            onClick: () => {},
            disabled: true,
          };
        case "failed":
          return {
            text: "Retry",
            icon: <AlertCircle className="h-4 w-4 mr-2" />,
            className: "bg-red-600 hover:bg-red-700",
            onClick: () => setIsAnalyzeOpen(true),
            disabled: false,
          };
      }
    }

    return {
      text: "Analyze",
      icon: <ChartNoAxesColumn className="h-4 w-4 mr-2" />,
      className: "btn-primary",
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
      { label: "Moves", value: gameData.moves },
      { label: "Source", value: gameData.source },
    ],
  ];

  return (
    <>
      <AnalyzeGameHistory
        open={isAnalyzeOpen}
        onOpenChange={setIsAnalyzeOpen}
        game={gameData}
      />
      <div
        className={`p-4 border md:rounded-md relative ${
          isNewlyImported ? "border-green-500 bg-green-50" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-4 text-xs">
          <div className="text-gray-500">{gameData.date}</div>
          <div className={`font-semibold ${gameData.resultColor}`}>
            {gameData.result}
          </div>
        </div>

        <div className="space-y-4 mb-4">
          {infoRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2">
              {row.map((item, itemIndex) => (
                <div key={itemIndex} className="text-xs min-w-0">
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
              <h1 className="text-xs">{buttonContent.text}</h1>
            </Button>
          );
        })()}

        {isNewlyImported && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
            New
          </span>
        )}
      </div>
    </>
  );
};

export default GameCard;