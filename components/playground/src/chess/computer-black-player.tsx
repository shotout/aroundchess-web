"use client"

import { useComputerChessStore } from "../store/computerChessStore"
import useStore from "../lib/hooks/useStore"
import { EliminatedPieces } from "./eliminated-pieces"
import { cn } from "@/lib/utils"
import { PersonAvatar } from "./person-avatar"

export function ComputerBlackPlayer() {
  const store = useStore(useComputerChessStore, (state) => state);
  if (!store) return null;
  
  const { currentPlayer, targetELO, opponentName, computer, selectedCharacter } = store;
  const isComputerBlack = computer === 'black';
  
  console.log('ComputerBlackPlayer - Character Data:', {
    selectedCharacter,
    opponentName,
    isComputerBlack,
    computer
  });

  return (
    <div className={cn(
      "bg-gray-800/20 dark:bg-white/30 rounded-lg h-12 w-full flex px-4 items-center justify-between",
      currentPlayer === "black" ? "opacity-100" : "opacity-50"
    )}>
      <div className="flex items-center gap-3">
        {isComputerBlack ? (
          <>
            <div className="w-8 h-8 flex-shrink-0">
              <PersonAvatar 
                seed={selectedCharacter?.avatarNumber || 1}
                gender={selectedCharacter?.gender || 'male'}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] --sm font-medium">{selectedCharacter?.name || opponentName}</span>
              <span className="text-[14px] --xs text-muted-foreground">ELO {targetELO}</span>
            </div>
          </>
        ) : (
          <>
            <span className="inline-block w-4 h-4 bg-white border border-gray-300 rounded-full" />
            <span className="text-[14px] --sm font-medium">You</span>
          </>
        )}
      </div>
      <div>
        <EliminatedPieces color="black" pieces={store.eliminatedPieces.black} />
      </div>
    </div>
  );
}