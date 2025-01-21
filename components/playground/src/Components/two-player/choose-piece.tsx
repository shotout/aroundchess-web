"use client";

import { useChessStore } from "../../store/playground/chess-store";
import { useThemeStore } from "../../store/playground/theme-store";
import { PieceType } from "../../types/chess";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ReactNode } from "react";

export function ChoosePiece() {
  const { pieceTheme } = useThemeStore();
  const { currentPlayer, canPromotePawn, promotePawn } = useChessStore(
    (state) => state
  );

  if (!canPromotePawn) return null;

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a piece to promote your pawn to</DialogTitle>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 justify-center items-center">
              {(["Q", "R", "B", "N"] as const).map((piece): ReactNode => {
                const pieceImage = currentPlayer === "black" ? piece.toLowerCase() : piece;
                return (
                  <button key={piece} className="btn">
                    <Image
                      src={`/${pieceTheme}/${currentPlayer}/${pieceImage}.png`}
                      alt={piece}
                      width={64}
                      height={64}
                      className="mt-5 hover:scale-110 transform transition-transform hover:bg-gray-200 rounded-lg"
                      priority
                      onClick={() => {
                        if (canPromotePawn && promotePawn) {
                          promotePawn(
                            canPromotePawn.row,
                            canPromotePawn.col,
                            pieceImage as PieceType
                          );
                        }
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
