"use client"

import { Button } from "@/components/ui/button"
import { useChessStore } from "../store/useChessStore"
import { ArrowLeft, Undo2, Redo2, RotateCcw } from "lucide-react"
import Link from "next/link"

export function Controls() {
  const { undoMove, redoMove } = useChessStore()
  const resetGame = () => {
    window.location.reload()
  }

  return (
    <div className="flex justify-center gap-2">
      <Link href="/">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={undoMove}>
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={redoMove}>
        <Redo2 className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={resetGame}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
} 