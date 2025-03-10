"use client"

import { useComputerChessStore } from "../store/computerChessStore"
import useStore from "../lib/hooks/useStore"
import { EliminatedPieces } from "./eliminated-pieces"
import { cn } from "@/lib/utils"
import { PersonAvatar } from "./person-avatar"

export function ComputerWhitePlayer() {
  const store = useStore(useComputerChessStore, (state) => state);
  if (!store) return null;
  
  const { currentPlayer, targetELO, opponentName, computer, selectedCharacter } = store;
  const isComputerWhite = computer === 'white';
  
  console.log('ComputerWhitePlayer - Character Data:', {
    selectedCharacter,
    opponentName,
    isComputerWhite,
    computer
  });

  return (
    <div className={cn(
      "bg-gray-800/20 dark:bg-white/30 rounded-lg h-12 w-full flex px-4 items-center justify-between",
      currentPlayer === "white" ? "opacity-100" : "opacity-50"
    )}>
      <div className="flex items-center gap-3">
        {isComputerWhite ? (
          <>
            <div className="w-8 h-8 flex-shrink-0">
              <PersonAvatar 
                seed={selectedCharacter?.avatarNumber || 1}
                gender={selectedCharacter?.gender || 'male'}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{selectedCharacter?.name || opponentName}</span>
              <span className="text-xs text-muted-foreground">ELO {targetELO}</span>
            </div>
          </>
        ) : (
          <>
            <span className="inline-block w-4 h-4 bg-white border border-gray-300 rounded-full" />
            <span className="text-sm font-medium">You</span>
          </>
        )}
      </div>
      <div>
        <EliminatedPieces color="white" pieces={store.eliminatedPieces.white} />
      </div>
    </div>
  );
}