'use client'

import React, { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChessStore } from "../store/playground/chess-store"

export function MoveNotation() {
  const moves = useChessStore((state) => state.moves)
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

  return (
    <div className="bg-white/90 rounded-xl backdrop-blur-sm border border-gray-200/50 shadow-lg min-h-[300px] max-h-[calc(100vh-24rem)] flex flex-col w-full max-w-md">
      <div className="flex items-center gap-2 p-4 border-b border-gray-200/50">
        <div className="text-sm font-medium text-gray-800">Move History</div>
      </div>
      <ScrollArea className={moves.length > 11 ? "h-[290px]" : "h-full"}>
        <div className="p-4">
          {moves.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <p className="text-sm italic">No moves yet</p>
              <p className="text-xs mt-1">Make your first move to start the game</p>
            </div>
          ) : (
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-2">
              <div className="text-sm font-medium text-gray-400 sticky top-0 bg-white/90 py-2">#</div>
              <div className="text-sm font-medium text-gray-400 sticky top-0 bg-white/90 py-2">{whiteName}</div>
              <div className="text-sm font-medium text-gray-400 sticky top-0 bg-white/90 py-2">{blackName}</div>
              {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
                const whiteMove = moves[i * 2];
                const blackMove = moves[i * 2 + 1];
                return (
                  <React.Fragment key={i}>
                    <div className="text-sm text-gray-500 font-mono">{i + 1}.</div>
                    <div className="text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                      {whiteMove && (
                        <span className="font-mono">
                          {whiteMove}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                      {blackMove && (
                        <span className="font-mono">
                          {blackMove}
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}