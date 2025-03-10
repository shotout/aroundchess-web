"use client"

import Image from "next/image"
import { useThemeStore } from "../store/playground/theme-store"
import { useRef } from "react"
import { MovingPiece, Player, PieceType } from "../types/chess"
import { cn } from "../lib/utils"

interface ChessPieceProps {
  type: PieceType | null;
  position: { row: number; col: number }
  lastMove: { fromRow: number; fromCol: number; toRow: number; toCol: number } | null
  currentPlayer: Player
  highlight: boolean
  setSelectedPiece: (piece: { row: number; col: number } | null) => void
  movingPiece: MovingPiece | null
  isInCheck?: boolean
}

export function ChessPiece({
  type,
  position,
  lastMove,
  currentPlayer,
  highlight,
  setSelectedPiece,
  movingPiece,
  isInCheck = false,
}: ChessPieceProps) {
  const { pieceTheme } = useThemeStore()
  const pieceRef = useRef<HTMLDivElement>(null)

  if (!type || typeof type !== 'string') return null

  const color = type === type.toUpperCase() ? "white" : "black"
  const isCurrentPlayersPiece = 
    (currentPlayer === "white" && type === type.toUpperCase()) ||
    (currentPlayer === "black" && type === type.toLowerCase())

  const pieceImage = `/${pieceTheme}/${color}/${pieceTheme === "default" ? type.toUpperCase() : color === "white" ? type.toUpperCase() : type.toLowerCase()}.png`

  const translateX =
    lastMove?.toCol !== undefined ? (lastMove.toCol - position.col) * 100 : 0
  const translateY =
    lastMove?.toRow !== undefined ? (lastMove.toRow - position.row) * 100 : 0

  const isMoving = 
    movingPiece?.fromRow === position.row && 
    movingPiece?.fromCol === position.col

  return (
    <div
      ref={pieceRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center",
        isCurrentPlayersPiece ? "cursor-grab active:cursor-grabbing" : "cursor-default",
        {
          "z-10": highlight || isInCheck,
          "animate-pulse": isInCheck,
        }
      )}
      draggable={isCurrentPlayersPiece}
      onDragStart={(e) => {
        if (!isCurrentPlayersPiece) {
          e.preventDefault()
          return
        }
        e.dataTransfer.setData("text/plain", `${position.row},${position.col}`)
        e.dataTransfer.effectAllowed = "move"
        setSelectedPiece(position)
      }}
      onDragEnd={() => {
        if (pieceRef.current) {
          pieceRef.current.style.opacity = '1'
        }
        setSelectedPiece(null)
      }}
      onClick={() => {
        if (!isCurrentPlayersPiece) return
        setSelectedPiece(position)
      }}
      style={{
        transition: isMoving ? "transform 0.3s ease" : "none",
        transform: isMoving ? `translate(${translateX}%, ${translateY}%)` : "none",
      }}
    >
      <Image
        src={pieceImage}
        alt={`${color} ${type}`}
        width={64}
        height={64}
        className={cn(
          "w-[95%] h-[95%] select-none pointer-events-none",
          {
            "drop-shadow-lg scale-110": highlight,
            "drop-shadow-lg": isInCheck
          }
        )}
        priority
        unoptimized
      />
    </div>
  )
}