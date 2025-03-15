import { ChartNoAxesColumn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Chess Game Card Component
interface GameData {
  id: number;
  date: string;
  opponent: string;
  result: string;
  resultColor: string;
  eloChange: string;
  rating: string;
  opening: string;
  moves: string;
  timeControl: string;
  source: string;
  gameType: string;
  color: string;
  gameFormat: string;
  pgn: string; // Make sure PGN is included in the interface
}

interface GamesTabCardProps {
  gameData: GameData;
  onAnalyze?: (game: GameData) => void; // Add onAnalyze prop
}

const GamesTabCard = ({ gameData, onAnalyze }: GamesTabCardProps) => {
  // Data grouped into rows for better symmetry and organization
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

  // Handler for analyze button click
  const handleAnalyzeClick = () => {
    if (onAnalyze) {
      onAnalyze(gameData);
    }
  };

  return (
    <Card className="p-4 border rounded-lg shadow-lg">
      {/* Header section with date and result */}
      <div className="flex justify-between items-center mb-4 text-xs">
        <div className="text-gray-500">{gameData.date}</div>
        <div className={`font-semibold ${gameData.resultColor}`}>
          {gameData.result} {gameData.eloChange}
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
        onClick={handleAnalyzeClick}
      >
        <ChartNoAxesColumn className="h-4 w-4 mr-2" />
        <h1 className="text-xs">Analyze</h1>
      </Button>
    </Card>
  );
};

export default GamesTabCard;
