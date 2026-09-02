'use client'

import { useEffect, useState } from 'react'
import { useChessStore } from '../store/playground/chess-store'

type PlayerNameChangeEvent = CustomEvent<{ color: 'white' | 'black'; name: string }>

export function CurrentPlayers() {
  const currentPlayer = useChessStore((state) => state.currentPlayer)
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
    const handleNameChange = (e: PlayerNameChangeEvent) => {
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

  const currentName = currentPlayer === 'white' ? whiteName : blackName

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
        <span className="text-[14px] --sm font-medium text-gray-600">Current Turn</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${currentPlayer === 'white' ? 'bg-white border border-gray-300' : 'bg-gray-900'}`} />
          <span className="text-[14px] --sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {currentName}
          </span>
        </div>
      </div>
    </div>
  )
}
