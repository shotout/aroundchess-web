"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useChessStore } from "../store/playground/chess-store"
import { useEffect, useState } from "react"

export function GameResults() {
  const gameResults = useChessStore((state) => state.gameResults)
  const [whiteName, setWhiteName] = useState("White")
  const [blackName, setBlackName] = useState("Black")

  useEffect(() => {
    const loadNames = () => {
      const savedWhiteName = localStorage.getItem("whitePlayerName")
      const savedBlackName = localStorage.getItem("blackPlayerName")
      if (savedWhiteName) setWhiteName(savedWhiteName)
      if (savedBlackName) setBlackName(savedBlackName)
    }

    loadNames()

    // Handle custom name change events
    const handleNameChange = (e: CustomEvent<{ color: 'white' | 'black'; name: string }>) => {
      const { color, name } = e.detail
      if (color === 'white') {
        setWhiteName(name)
      } else {
        setBlackName(name)
      }
    }

    // Listen for both storage and custom events
    window.addEventListener('playerNameChange', handleNameChange as EventListener)
    window.addEventListener('storage', (e) => {
      if (e.key === "whitePlayerName" || e.key === "blackPlayerName") {
        loadNames()
      }
    })

    return () => {
      window.removeEventListener('playerNameChange', handleNameChange as EventListener)
      window.removeEventListener('storage', loadNames)
    }
  }, [])

  if (!gameResults || gameResults.length === 0) {
    return (
      <div className="p-4 text-gray-500 italic text-[14px] --sm">
        No games completed yet
      </div>
    )
  }

  const getWinnerName = (winner: string) => {
    if (winner === 'draw') return 'Draw'
    return winner === 'white' ? whiteName : blackName
  }

  return (
    <ScrollArea className="h-full w-full rounded-md">
      <div className="space-y-4 p-4">
        {gameResults.slice().reverse().map((result, index) => {
          const gameNumber = gameResults.length - index;
          return (
            <div key={result.id} className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] --sm font-medium">Game {gameNumber}</span>
                <span className="text-[14px] --xs text-gray-500">{new Date(result.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-[14px] --xs ${
                  result.winner === 'white' 
                    ? 'bg-blue-100 text-blue-700' 
                    : result.winner === 'black'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {result.winner === 'draw' ? 'Draw' : `${getWinnerName(result.winner)} won`}
                </div>
                <div className="text-[14px] --xs text-gray-600">
                  by {result.method}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  )
}