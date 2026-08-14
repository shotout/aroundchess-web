"use client"

import Image from "next/image"
import { useThemeStore } from "../store/playground/theme-store"

interface EliminatedPiecesProps {
  color: "white" | "black"
  pieces: string[]
}

export function EliminatedPieces({ color, pieces }: EliminatedPiecesProps) {
  const { pieceTheme } = useThemeStore()

  const groupedPieces = pieces.reduce((acc, piece) => {
    if (piece) {
      acc[piece] = (acc[piece] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex items-center gap-2">
      {Object.entries(groupedPieces).map(([piece, count], index) => (
        <div
          key={index}
          className="relative group"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-white/10 to-gray-500/10 backdrop-blur-sm shadow-sm border border-white/20 hover:border-white/40 transition-all duration-200">
            <Image
              src={`/${pieceTheme}/${color}/${piece}.png`}
              alt={piece}
              width={22}
              height={22}
              className="drop-shadow-md transform group-hover:scale-105 transition-transform duration-200"
            />
            {count > 1 && (
              <div className="absolute -right-1.5 -bottom-1 bg-gradient-to-br from-blue-500 to-indigo-600 text-[14px] --10px font-bold text-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform duration-200">
                {count}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}