"use client";

import { useChessStore } from "../store/useChessStore";
import { useThemeStore } from "../store/playground/theme-store";
import { Button } from "../../src/Components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export function ChooseColor() {
  const { computer, updateComputer } = useChessStore((state) => ({
    computer: state.computer,
    updateComputer: state.updateComputer
  }));
  const { pieceTheme } = useThemeStore((state) => state);

  if (computer !== null) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
      >
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Choose Your Side</h2>
            <p className="text-gray-600 text-sm">Select which color you want to play as</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={`/${pieceTheme}/white/P.png`}
                  alt="White Pawn"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    console.error(`Failed to load piece image: ${pieceTheme}/white/P.png`);
                    e.currentTarget.src = `/default/white/P.png`;
                  }}
                />
                <Button 
                  onClick={() => updateComputer("black")}
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 py-2"
                >
                  Play as White
                </Button>
                <span className="text-sm text-gray-600">First to move</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Image
                  src={`/${pieceTheme}/black/P.png`}
                  alt="Black Pawn"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    console.error(`Failed to load piece image: ${pieceTheme}/black/P.png`);
                    e.currentTarget.src = `/default/black/P.png`;
                  }}
                />
                <Button 
                  onClick={() => updateComputer("white")}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2"
                >
                  Play as Black
                </Button>
                <span className="text-sm text-gray-600">Second to move</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-3 text-center">
          <p className="text-sm text-gray-500">
            You can change sides anytime during the game
          </p>
        </div>
      </motion.div>
    </div>
  );
}
