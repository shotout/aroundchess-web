"use client"

import Image from "next/image"
import { useThemeStore } from "../store/playground/theme-store"

interface ComputerEliminatedPiecesProps {
  color: "white" | "black"
  pieces: string[]
}

// Points value for each piece type
const PIECE_VALUES: { [key: string]: number } = {
  'p': 1,  // pawn
  'n': 3,  // knight
  'b': 3,  // bishop
  'r': 5,  // rook
  'q': 9,  // queen
  'k': 0   // king (not typically counted in material)
};

export function ComputerEliminatedPieces({ color, pieces }: ComputerEliminatedPiecesProps) {
  const { pieceTheme } = useThemeStore()

  // Group identical pieces and count them
  const groupedPieces = pieces.reduce((acc, piece) => {
    if (piece) {
      acc[piece] = (acc[piece] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate total points
  const totalPoints = pieces.reduce((total, piece) => {
    const pieceType = piece.toLowerCase();
    return total + (PIECE_VALUES[pieceType] || 0);
  }, 0);

  // Sort pieces by value (highest to lowest)
  const sortedPieces = Object.entries(groupedPieces).sort((a, b) => {
    const aValue = PIECE_VALUES[a[0].toLowerCase()] || 0;
    const bValue = PIECE_VALUES[b[0].toLowerCase()] || 0;
    return bValue - aValue;
  });

  return (
    <div className={`
      p-2.5 rounded-xl
      ${color === 'white'
        ? 'bg-gradient-to-br from-blue-50/90 to-indigo-50/90'
        : 'bg-gradient-to-br from-gray-50/90 to-slate-50/90'
      }
      backdrop-blur-md shadow-xl
      border border-white/40
      transition-all duration-200
      group
      hover:shadow-lg hover:border-white/60
      hover:from-opacity-100 hover:to-opacity-100
    `}>
      <div className="flex items-center gap-3">
        {/* Captured pieces display */}
        <div className="flex items-center gap-1.5 min-h-[2rem]">
          {sortedPieces.map(([piece, count], index) => (
            <div
              key={index}
              className="relative group/piece"
            >
              <div className={`
                relative flex items-center justify-center 
                w-8 h-8 rounded-lg 
                bg-gradient-to-br 
                ${color === 'white' 
                  ? 'from-blue-100/80 to-indigo-100/80 hover:from-blue-200/80 hover:to-indigo-200/80' 
                  : 'from-gray-100/80 to-slate-100/80 hover:from-gray-200/80 hover:to-slate-200/80'
                }
                backdrop-blur-sm shadow-md 
                border border-white/40 hover:border-white/60 
                transition-all duration-200
                transform hover:scale-105
              `}>
                <Image
                  /* Show opposite color pieces with correct case (uppercase for white, lowercase for black) */
                  src={`/${pieceTheme}/${color}/${piece.toUpperCase()}.png`}
                  alt={piece}
                  width={24}
                  height={24}
                  className="drop-shadow-md"
                  priority
                  unoptimized
                />
                {count > 1 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-[10px] font-semibold rounded-full bg-indigo-500 text-white shadow-sm">
                    {count}
                  </span>
                )}
              </div>
              
              {/* Tooltip showing piece value */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/piece:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className="px-2 py-1 text-[14px] --xs font-medium text-white bg-gray-800/90 rounded-md shadow-lg whitespace-nowrap">
                  {PIECE_VALUES[piece.toLowerCase()]} points
                </div>
              </div>
            </div>
          ))}
          {sortedPieces.length === 0 && (
            <div className="text-[14px] --sm text-gray-400 italic px-2">
              No pieces captured
            </div>
          )}
        </div>

        {/* Total points display */}
        {totalPoints > 0 && (
          <div className={`
            px-2.5 py-1 rounded-lg text-[14px] --sm font-semibold
            ${color === 'white' 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
              : 'bg-gradient-to-br from-gray-700 to-slate-800 text-white'
            }
            shadow-md border border-white/20
          `}>
            +{totalPoints}
          </div>
        )}
      </div>
    </div>
  )
}
