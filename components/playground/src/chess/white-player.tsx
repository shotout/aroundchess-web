"use client"

import { useChessStore } from "../store/playground/chess-store"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function WhitePlayer() {
  const currentPlayer = useChessStore((state) => state.currentPlayer)
  const [isEditing, setIsEditing] = useState(false)
  const [playerName, setPlayerName] = useState("White")
  const [tempName, setTempName] = useState(playerName)

  // Load saved name on mount
  useEffect(() => {
    const savedName = localStorage.getItem("whitePlayerName")
    if (savedName) {
      setPlayerName(savedName)
      setTempName(savedName)
    }
  }, [])

  const handleSave = () => {
    setPlayerName(tempName)
    localStorage.setItem("whitePlayerName", tempName)
    // Dispatch custom event for name change
    window.dispatchEvent(new CustomEvent('playerNameChange', { 
      detail: { color: 'white', name: tempName }
    }))
    setIsEditing(false)
  }

  return (
    <div className={cn(
      "flex items-center justify-between w-full",
      currentPlayer === "white" ? "bg-blue-50 p-2 rounded-lg" : ""
    )}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-white border border-gray-300" />
        <span className="text-[14px] --sm font-medium">{playerName}</span>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Pencil className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit White Player Name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter player name"
              className="col-span-3"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}