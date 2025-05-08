import {
    playCaptureSound,
    playCastlingSound,
    playCheckmateSound,
    playCheckSound,
    playMoveSound,
    playPromoteSound
} from "@/components/playground/src/utils/playSound";
import { Chess } from "chess.js";
import { analyzeMove } from "./chess-conditions";

export const playSound = (chess: Chess, move: any) => {
  const analysis = analyzeMove(chess, move);
  
  if (analysis?.captured) {
    playCaptureSound();
    console.log("Captured!");
  } else {
    playMoveSound();
  }

  if (analysis?.castling) {
    playCastlingSound();
    console.log("Castling");
  }
  if (analysis?.check) {
    playCheckSound();
    console.log("The move puts the opponent in check!");
  }
  if (analysis?.promotion) {
    playPromoteSound();
    console.log("Promote!");
  }
  if (analysis?.checkmate) {
    playCheckmateSound();
    console.log("Checkmate! Game over.");
  }
};
