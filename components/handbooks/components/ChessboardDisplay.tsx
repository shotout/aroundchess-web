import Simple2DChess from "./Simple2DChess";

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
        <Simple2DChess
          id={`board-${slug}`}
          keys={`board-${slug}`}
          position={fenPosition}
          arePiecesDraggable={true}
        />
      </div>
    </div>
  );
};

export default ChessboardDisplay;
