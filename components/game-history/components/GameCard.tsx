import React from "react";
import { ChartNoAxesColumn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Game } from "@/components/game-history/types/GameHistoryTypes";

interface GameCardProps {
  gameData: Game;
  onAnalyze: (game: Game) => void;
  isNewlyImported?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  gameData,
  onAnalyze,
  isNewlyImported = false,
}) => {
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
    <div
      className={`p-4 border md:rounded-md  ${
        isNewlyImported ? "border-green-500 bg-green-50" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4 text-xs">
        <div className="text-gray-500">{gameData.date}</div>
        <div className={`font-semibold ${gameData.resultColor}`}>
          {gameData.result} ({gameData.eloChange} ELO RATING)
        </div>
      </div>

      {/* Game info sections rendered from the grouped data */}
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

      {/* Analysis button with click handler */}
      <Button
        className="w-full p-[10px] rounded-3xl btn-primary h-[36px]"
        onClick={() => onAnalyze(gameData)}
      >
        <ChartNoAxesColumn className="h-4 w-4 mr-2" />
        <h1 className="text-xs">Analyze</h1>
      </Button>

      {/* New badge for newly imported games */}
      {isNewlyImported && (
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
          New
        </span>
      )}
    </div>
  );
};

export default GameCard;
