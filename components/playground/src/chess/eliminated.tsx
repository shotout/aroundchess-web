"use client"

import { useChessStore } from "../store/playground/chess-store"
import { useThemeStore } from "../store/playground/theme-store"
import Image from "next/image"

const calculatePoints = (piece: string) => {
  const values: { [key: string]: number } = {
    'Q': 9, 'q': 9,
    'R': 5, 'r': 5,
    'B': 3, 'b': 3,
    'N': 3, 'n': 3,
    'P': 1, 'p': 1
  }
  return values[piece] || 0
}

// Shows black pieces captured by white
export function WhiteEliminatedPieces() {
  const eliminatedPieces = useChessStore((state) => state.eliminatedPieces.white)
  const { pieceTheme } = useThemeStore()

  if (!eliminatedPieces?.length) return null

  const groupedPieces = eliminatedPieces.reduce((acc, piece) => {
    acc[piece] = (acc[piece] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalPoints = Object.entries(groupedPieces)
    .reduce((sum, [piece, count]) => sum + calculatePoints(piece) * count, 0)

  return (
    <div className="bg-white/90 rounded-lg p-2 backdrop-blur-sm border border-gray-200/50 shadow-sm">
      <div className="flex flex-wrap gap-1 items-center min-h-[32px]">
        {Object.entries(groupedPieces).map(([piece, count], index) => (
          <div key={index} className="relative group">
            <div className="w-6 h-6 hover:scale-110 transition-transform">
              <Image
                src={`/${pieceTheme}/black/${piece.toUpperCase()}.png`} // Always show black pieces
                alt={piece}
                width={24}
                height={24}
                className="w-full h-full"
                priority
              />
              {count > 1 && (
                <span className="absolute -bottom-1 -right-1 bg-gray-800/80 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-medium bg-gray-800/80 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {calculatePoints(piece)} pts
            </div>
          </div>
        ))}
      </div>
      {totalPoints > 0 && (
        <div className="mt-1 text-[14px] --10px text-gray-600 font-medium text-center">
          {totalPoints} pts
        </div>
      )}
    </div>
  )
}

// Shows white pieces captured by black
export function BlackEliminatedPieces() {
  const eliminatedPieces = useChessStore((state) => state.eliminatedPieces.black)
  const { pieceTheme } = useThemeStore()

  if (!eliminatedPieces?.length) return null

  const groupedPieces = eliminatedPieces.reduce((acc, piece) => {
    acc[piece] = (acc[piece] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalPoints = Object.entries(groupedPieces)
    .reduce((sum, [piece, count]) => sum + calculatePoints(piece) * count, 0)

  return (
    <div className="bg-white/90 rounded-lg p-2 backdrop-blur-sm border border-gray-200/50 shadow-sm">
      <div className="flex flex-wrap gap-1 items-center min-h-[32px]">
        {Object.entries(groupedPieces).map(([piece, count], index) => (
          <div key={index} className="relative group">
            <div className="w-6 h-6 hover:scale-110 transition-transform">
              <Image
                src={`/${pieceTheme}/white/${piece}.png`} // Always show white pieces
                alt={piece}
                width={24}
                height={24}
                className="w-full h-full"
                priority
              />
              {count > 1 && (
                <span className="absolute -bottom-1 -right-1 bg-gray-800/80 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-medium bg-gray-800/80 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {calculatePoints(piece)} pts
            </div>
          </div>
        ))}
      </div>
      {totalPoints > 0 && (
        <div className="mt-1 text-[14px] --10px text-gray-600 font-medium text-center">
          {totalPoints} pts
        </div>
      )}
    </div>
  )
} 