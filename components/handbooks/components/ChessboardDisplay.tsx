import Simple2DChess from "./Simple2DChess";
import { useEffect, useState } from "react";

interface ChessboardDisplayProps {
  slug: string;
  fenPosition: string;
}

const ChessboardDisplay: React.FC<ChessboardDisplayProps> = ({
  slug,
  fenPosition,
}) => {
  const [boardSize, setBoardSize] = useState<number | undefined>(1);
  const [mounted, _] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();

    window?.addEventListener("resize", handleResize);
    return () => window?.removeEventListener("resize", handleResize);
  }, [mounted]);

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >= 1280 ? window.innerWidth / 3.2 : 480;

    if (isPortrait) {
      const availableWidth = width - minPadding * 2;
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
    } else {
      const availableHeight = height - minPadding * 2;
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
    }
  };
  return (
    <div className="rounded-lg p-2">
      <div className="w-full max-w-md mx-auto flex justify-center">
        <Simple2DChess
          id={`board-${slug}`}
          keys={`board-${slug}`}
          position={fenPosition}
          arePiecesDraggable={true}
        />
        {/* <TwoDChessboard
          key={`board-${slug}`}
          position={fenPosition}
          arePiecesDraggable={true}
          arePiecesClickable
          boardWidth={boardSize ?? 0}
          onPromotionPieceSelect={function (
            piece?: PromotionPieceOption,
            promoteFromSquare?: Square,
            promoteToSquare?: Square
          ): boolean {
            throw new Error("Function not implemented.");
          }}
        /> */}
      </div>
    </div>
  );
};

export default ChessboardDisplay;
