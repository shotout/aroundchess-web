"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useComputerChessStore } from '../store/computerChessStore'

interface ComputerResignDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ComputerResignDialog({ isOpen, onClose }: ComputerResignDialogProps) {
  const { playerColor } = useComputerChessStore((state) => state)

  const handleResign = () => {
    useComputerChessStore.setState(state => ({
      ...state,
      winner: playerColor === 'white' ? 'black' : 'white',
      isCheckMate: "noCheckMate",
      gameResult: {
        id: crypto.randomUUID(),
        winner: playerColor === 'white' ? 'black' : 'white',
        winnerName: 'Computer',
        method: 'resignation',
        date: new Date().toISOString(),
        moveCount: state.moves.length,
        duration: 0
      }
    }))
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resign Game</DialogTitle>
          <DialogDescription>
            Are you sure you want to resign? This will count as a loss.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleResign}
          >
            Resign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 