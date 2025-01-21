'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useComputerChessStore } from "../store/computerChessStore"
import { cn } from "@/lib/utils"

export function ColorSelectionDialog() {
  const { isColorSelectionOpen, setColorSelectionOpen, setPlayerColor } = useComputerChessStore()

  const handleColorSelection = (color: 'white' | 'black') => {
    console.log('Setting player color:', color);
    setPlayerColor(color);
    setColorSelectionOpen(false);
  }

  return (
    <Dialog open={isColorSelectionOpen} onOpenChange={setColorSelectionOpen}>
      <DialogContent className={cn(
        "sm:max-w-md",
        "bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-800/95",
        "backdrop-blur-xl",
        "border border-slate-700",
        "shadow-2xl shadow-purple-500/10",
      )}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400">
            Choose Your Color
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select which color you want to play as. The computer will play as the opposite color.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-8 py-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className={cn(
                "w-36 h-36 p-0 relative group",
                "bg-gradient-to-br from-slate-50 to-white",
                "hover:from-white hover:to-slate-50",
                "border-2 border-slate-200",
                "shadow-lg shadow-white/20",
                "transition-all duration-300"
              )}
              onClick={() => handleColorSelection('white')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/50 group-hover:opacity-0 transition-opacity" />
              <img 
                src="/pieces/white/K.png" 
                alt="White King" 
                className="w-24 h-24 object-contain transform group-hover:scale-110 transition-transform duration-300 contrast-125 brightness-110" 
              />
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className={cn(
                "w-36 h-36 p-0 relative group",
                "bg-gradient-to-br from-slate-950 to-slate-900",
                "hover:from-slate-900 hover:to-slate-800",
                "border-2 border-slate-700",
                "shadow-lg shadow-black/30",
                "transition-all duration-300"
              )}
              onClick={() => handleColorSelection('black')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 group-hover:opacity-0 transition-opacity" />
              <img 
                src="/pieces/black/k.png" 
                alt="Black King" 
                className="w-24 h-24 object-contain transform group-hover:scale-110 transition-transform duration-300 contrast-125 brightness-150" 
              />
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
