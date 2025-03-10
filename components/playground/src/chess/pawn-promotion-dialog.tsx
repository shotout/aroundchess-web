import { useComputerChessStore } from '../store/computerChessStore';
import { PieceType } from '../types/chess';
import { useThemeStore } from '../store/playground/theme-store';

export const PawnPromotionDialog = () => {
  const { canPromotePawn, currentPlayer, promotePawn } = useComputerChessStore();
  const { pieceTheme } = useThemeStore();

  if (!canPromotePawn) return null;

  const pieces: PieceType[] = currentPlayer === 'white' 
    ? ['Q', 'R', 'B', 'N'] 
    : ['q', 'r', 'b', 'n'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Choose a piece to promote to:</h3>
        <div className="flex gap-4">
          {pieces.map((piece) => {
            const color = currentPlayer;
            const pieceImage = `/${pieceTheme}/${color}/${piece.toUpperCase()}.png`;
            
            return (
              <button
                key={piece}
                className="w-16 h-16 flex items-center justify-center border rounded hover:bg-gray-100"
                onClick={() => promotePawn(canPromotePawn.row, canPromotePawn.col, piece)}
              >
                <img 
                  src={pieceImage}
                  alt={piece} 
                  className="w-12 h-12"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
