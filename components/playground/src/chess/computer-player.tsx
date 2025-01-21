"use client"

import { useComputerChessStore } from "../store/computerChessStore"
import { cn } from "@/lib/utils"
import { Computer } from "lucide-react"

export function ComputerPlayer() {
  const currentPlayer = useComputerChessStore((state) => state.currentPlayer)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Computer className="w-5 h-5 text-blue-600" />
        <span className={cn(
          "font-medium",
          currentPlayer === "black" ? "text-blue-600" : "text-gray-500"
        )}>
          Computer
        </span>
      </div>
    </div>
  )
}

export function HumanPlayer() {
  const currentPlayer = useComputerChessStore((state) => state.currentPlayer)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
      </div>
    </div>
  )
}
