"use client"

import { Computer } from "lucide-react"
import { useComputerChessStore } from "../store/computerChessStore"
import { cn } from "@/lib/utils"

export function ComputerHeader() {
  const currentPlayer = useComputerChessStore((state) => state.currentPlayer)

  return (
    <div className="bg-white/90 rounded-xl backdrop-blur-sm shadow-lg border border-blue-100/50 mb-4">
      <div className="flex items-center gap-2 p-4">
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
