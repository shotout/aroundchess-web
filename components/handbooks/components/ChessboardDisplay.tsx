import { Chessboard } from "react-chessboard";

interface ChessboardDisplayProps {
  slug: string;
  fenPosition: string;
}

const ChessboardDisplay: React.FC<ChessboardDisplayProps> = ({
  slug,
  fenPosition,
}) => {
  return (
    <div className="rounded-lg p-2">
      <div className="w-full max-w-md mx-auto">
        <Chessboard
          id={`board-${slug}`}
          position={fenPosition}
          customDarkSquareStyle={{
            backgroundColor: "#9E7555",
          }}
          customLightSquareStyle={{
            backgroundColor: "#F0DFC7",
          }}
        />
      </div>
    </div>
  );
};

export default ChessboardDisplay;
