"use client";

import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import pgnParser from "pgn-parser";
import { getStockfishService } from "@/lib/stockfish/stockfish-service";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  SkipBackIcon,
  SkipForwardIcon,
  Watch,
} from "lucide-react";
import Board from "./3DBoard";

const AnalysisResult: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [currentFen, setCurrentFen] = useState(game.fen());
  const [bestMove, setBestMove] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<number | null>(null);

  const fetchStockfishData = async (fen: string) => {
    const stockfishService = getStockfishService();

    try {
      await stockfishService.waitReady();

      const bestMove = await stockfishService.getBestMove(fen, 20, 0.1);
      setBestMove(bestMove);

      const evaluation = await stockfishService.getEvaluation(fen, 20);
      setEvaluation(evaluation);
    } catch (error) {
      console.error("Error using StockfishService:", error);
    } finally {
      stockfishService.destroy();
    }
  };

  useEffect(() => {
    fetchStockfishData(currentFen);
  }, [currentFen]);

  useEffect(() => {
    console.log("Best move:", bestMove);
    console.log("Evaluation:", evaluation);
  }, [bestMove, evaluation]);

  return (
    <div className="flex justify-center gap-4 bg-white px-4">
      <div className="flex flex-col gap-4">
        <div className="md:hidden">
          <h2 className="text-md pt-4 text-center font-bold">
            Analysis Result from{" "}
            <span className="text-[#4E7838]">Chess.com</span>
          </h2>
        </div>
        <div className="border border-input p-1 rounded-md flex flex-row justify-between items-center gap-2">
          <div className="flex flex-row gap-2">
            {/* <Image 
            alt="avatar"
            src={"/images/icons/"}/> */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <span className="text-xs font-medium text-[#00B427]">
                  Player name
                </span>
                <Image
                  src={"/icons/switzerland-flag.png"}
                  alt="flag"
                  width={1000}
                  height={1000}
                  className="w-5 h-3"
                />
              </div>
              <div className="flex flex-row gap-1">
                <Image
                  src={"/icons/pawn-icon-alt-black.png"}
                  alt="pawn"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
                <Image
                  src={"/icons/bishop-icon-alt-black.png"}
                  alt="bishop"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
                
                <Image
                  src={"/icons/king-icon-alt-black.png"}
                  alt="king"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
              </div>
            </div>
          </div>
          <div className="border border-input rounded-md p-2 flex flex-row gap-2">
            <Watch size={16} />
            <span className="text-xs font-medium">7:00</span>
          </div>
        </div>
        <Chessboard position={game.fen()} boardWidth={358} />
        {/* Group Button */}
        <div className="flex flex-row justify-around gap-4">
          <button className="w-1/5 flex justify-center border border-primary rounded-sm p-1 ">
            <SkipBackIcon fill="black" size={16} color="black" />
          </button>

          <button className="w-1/5 flex justify-center border border-primary rounded-sm p-1 ">
            <ChevronLeft size={16} color="black" />
          </button>
          <button className="w-1/5 flex justify-center border border-primary rounded-sm p-1 ">
            <Play size={16} fill="black" color="black" />
          </button>

          <button className="w-1/5 flex justify-center border border-primary rounded-sm p-1 ">
            <ChevronRight size={16} color="black" />
          </button>
          <button className="w-1/5 flex justify-center border border-primary rounded-sm p-1 ">
            <SkipForwardIcon fill="black" size={16} color="black" />
          </button>
        </div>
        <div className="border border-input p-1 rounded-md flex flex-row justify-between items-center gap-2">
          <div className="flex flex-row gap-2">
            {/* <Image 
            alt="avatar"
            src={"/images/icons/"}/> */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <span className="text-xs font-medium text-[#00B427]">
                  Player name
                </span>
                <Image
                  src={"/icons/switzerland-flag.png"}
                  alt="flag"
                  width={1000}
                  height={1000}
                  className="w-4 h-3"
                />
              </div>
              
              <div className="flex flex-row gap-1">
                <Image
                  src={"/icons/pawn-icon-alt-white.png"}
                  alt="pawn"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
                <Image
                  src={"/icons/rook-icon-alt-white.png"}
                  alt="rook"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
                
                <Image
                  src={"/icons/queen-icon-alt-white.png"}
                  alt="queen"
                  width={1000}
                  height={1000}
                  className="w-3 h-4"
                />
              </div>
            </div>
          </div>
          <div className="border border-input rounded-md p-2 flex flex-row gap-2">
            <Watch size={16} />
            <span className="text-xs font-medium">7:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
