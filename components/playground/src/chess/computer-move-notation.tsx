'use client'

import React, { useState, useEffect } from 'react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useComputerChessStore } from "../store/computerChessStore"
import { CurrentPlayers } from "./current-players"

export function ComputerMoveNotation() {
  const moves = useComputerChessStore((state) => state.moves)
  const currentPlayer = useComputerChessStore((state) => state.currentPlayer)
  const [whiteName, setWhiteName] = useState("White")
  const [blackName, setBlackName] = useState("Computer")

  useEffect(() => {
    const loadNames = () => {
      const savedWhiteName = localStorage.getItem("computerWhitePlayerName")
      if (savedWhiteName) setWhiteName(savedWhiteName)
    }

    loadNames()

    const handleNameChange = (e: CustomEvent<{ color: 'white' | 'black'; name: string }>) => {
      const { color, name } = e.detail
      if (color === 'white') {
        setWhiteName(name)
      }
    }

    window.addEventListener('computerPlayerNameChange', handleNameChange as EventListener)
    window.addEventListener('storage', (e) => {
      if (e.key === "computerWhitePlayerName") {
        loadNames()
      }
    })

    return () => {
      window.removeEventListener('computerPlayerNameChange', handleNameChange as EventListener)
      window.removeEventListener('storage', loadNames)
    }
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col w-full max-w-md">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Information</h3>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[14px] --sm text-gray-600">Current Turn</span>
            <span className="text-[14px] --sm font-medium text-blue-600">{currentPlayer === 'white' ? 'White' : 'Black'}</span>
          </div>
        </div>

        <div>
          <h4 className="text-[14px] --sm font-medium text-gray-900 mb-4">Move History</h4>
          <div className={`relative ${moves.length > 8 ? 'h-[200px]' : ''}`}>
            <ScrollArea className="h-full">
              <div className="h-full">
                {moves.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-[14px] --sm text-gray-500">No moves yet</p>
                    <p className="text-[14px] --xs text-gray-400 mt-1">Make your first move to start the game</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-[32px_1fr_1fr] gap-x-8 gap-y-2 pr-4">
                    <div className="text-[14px] --sm font-medium text-gray-400 sticky top-0 bg-white py-2">#</div>
                    <div className="text-[14px] --sm font-medium text-gray-400 sticky top-0 bg-white py-2">{whiteName}</div>
                    <div className="text-[14px] --sm font-medium text-gray-400 sticky top-0 bg-white py-2">{blackName}</div>
                    {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => {
                      const whiteMove = moves[i * 2];
                      const blackMove = moves[i * 2 + 1];
                      return (
                        <React.Fragment key={i}>
                          <div className="text-[14px] --sm text-gray-500">{i + 1}.</div>
                          <div className="text-[14px] --sm text-gray-900">
                            {whiteMove && <span>{whiteMove}</span>}
                          </div>
                          <div className="text-[14px] --sm text-gray-900">
                            {blackMove && <span>{blackMove}</span>}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
