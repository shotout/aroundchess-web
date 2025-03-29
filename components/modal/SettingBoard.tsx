"use client";

import { useRef, useState, useEffect, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, UploadCloud, Check, X, Edit, Settings } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { usePgnStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { proceedAnalysis } from "@/utils/stockfish-utils";
import { Chess } from "chess.js";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";

export function SettingBoard() {
  const router = useRouter();
  const boardsTwoD = [
    {
      id: "wood",
      name: "Default",
      img: "/images/play-vs-ai/default-board.png",
    },
    {
      id: "metallic",
      name: "Metallic",
      img: "/images/play-vs-ai/metallic-board.png",
    },
    {
      id: "plastic",
      name: "Plastic",
      img: "/images/play-vs-ai/plastic-board.png",
    },
    { id: "glass", name: "Glass", img: "/images/play-vs-ai/glass-board.png" },
  ];

  const piecesTwoD = [
    {
      id: "wood",
      name: "Wood",
      img: "/images/play-vs-ai/wood-pieces.png",
    },
    {
      id: "metallic",
      name: "Metallic",
      img: "/images/play-vs-ai/metallic-pieces.png",
    },
    {
      id: "plastic",
      name: "Plastic",
      img: "/images/play-vs-ai/plastic-pieces.png",
    },
    { id: "glass", name: "Glass", img: "/images/play-vs-ai/glass-pieces.png" },
  ];

  const boardsThreeD = [
    {
      id: "wood",
      name: "Default",
      img: "/images/play-vs-ai/3d-wood-board.png",
    },
    {
      id: "metallic",
      name: "Metallic",
      img: "/images/play-vs-ai/3d-metallic-board.png",
    },
    {
      id: "plastic",
      name: "Plastic",
      img: "/images/play-vs-ai/3d-plastic-board.png",
    },
    {
      id: "glass",
      name: "Glass",
      img: "/images/play-vs-ai/3d-glass-board.png",
    },
  ];

  const piecesThreeD = [
    {
      id: "wood",
      name: "Wood",
      img: "/images/play-vs-ai/3d-pieces-wood.png",
    },
    {
      id: "metallic",
      name: "Metallic",
      img: "/images/play-vs-ai/3d-pieces-metallic.png",
    },
    {
      id: "plastic",
      name: "Plastic",
      img: "/images/play-vs-ai/3d-pieces-plastic.png",
    },
    {
      id: "glass",
      name: "Glass",
      img: "/images/play-vs-ai/3d-pieces-glass.png",
    },
  ];
  const {
    StyleChoosed,
    setStyleChoosed,
    BoardChoosed,
    setBoardChoosed,
    PieceChoosed,
    setPieceChoosed,
  } = useChessBoardThemeStore();
  const [open, setOpen] = useState<boolean>(false);
  const [tabSelected, setTabSelected] = useState<string>("2d");
  const [boardSelected, setBoardSelected] = useState<string>("wood");
  const [pieceSelected, setPieceSelected] = useState<string>("wood");
  useEffect(() => {}, []);
  const handleSelectTab = (value: string) => {
    setTabSelected(value);
  };
  const handleSave = () => {
    setStyleChoosed(tabSelected);
    setBoardChoosed(boardSelected);
    setPieceChoosed(pieceSelected);
    setOpen(false)
  };

  const content = (boards: any, pieces: any, style: string) => {
    return (
      <div className="space-y-2">
        <div className="flex flex-row items-center gap-2 my-4">
          <Image
            src={"/images/play-vs-ai/checkerboard.png"}
            alt="board"
            width={1000}
            height={1000}
            className="w-[18px] h-[18px]"
          />
          <span className="font-medium text-[18px] text-[#121212]">
            Select your Board Theme
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {boards.map((board: any, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setBoardSelected(board.id);
                }}
                className={`cursor-pointer flex flex-col items-center justify-center p-[12px] rounded-[8px] gap-2 w-full border ${
                  boardSelected == board.id
                    ? `bg-[#221AE908] border-[#221AE9]`
                    : `bg-white border-[#D8DCE0] `
                }`}
              >
                <Image
                  src={board.img}
                  alt="board"
                  width={1000}
                  height={1000}
                  className="w-[60px] h-[60px] object-contain"
                />
                <span className="font-normal text-[12px] text-[#121212]">
                  {board.name}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-row items-center gap-2 my-4">
          <Image
            src={"/images/play-vs-ai/knight-icon.png"}
            alt="board"
            width={1000}
            height={1000}
            className="w-[16px] h-[20px]"
          />
          <span className="font-medium text-[18px] text-[#121212]">
            Select your Piece Theme
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2">
          {pieces.map((piece: any, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setPieceSelected(piece.id);
                }}
                className={`cursor-pointer flex flex-col items-center justify-center p-[12px] rounded-[8px] gap-2 w-full border ${
                  pieceSelected == piece.id
                    ? `bg-[#221AE908] border-[#221AE9]`
                    : `bg-white border-[#D8DCE0] `
                }`}
              >
                <Image
                  src={piece.img}
                  alt="board"
                  width={1000}
                  height={1000}
                  className="w-[112px] h-[64px] object-contain"
                />
                <span className="font-normal text-[12px] text-[#121212]">
                  {piece.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Image
          src={"/images/play-vs-ai/setting.png"}
          alt="icon"
          width={1000}
          height={1000}
          className="w-[20px] h-[20px] object-contain"
        />
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-sm sm:max-w-[640px] md:max-w-xl">
        <DialogHeader className="gap-2 mb-2 flex flex-col items-center justify-center">
          <DialogTitle className="font-semibold text-[24px]">Game Settings</DialogTitle>
          <DialogDescription className="text-black font-normal text-[20px]">
            Customize your game experience and preferences
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex flex-col overflow-auto md:max-w-lg max-h-[900px] md:max-h-screen gap-4 ">
          <div className="w-full py-[8px] bg-[#F9FAFC] border border-[#f4f4f4] rounded-[12px]">
            <div className="w-full shadow-lg flex flex-row items-center justify-center gap-2 bg-[#F9FAFC] border border-[#F4F4F4] rounded-[12px] p-[8px]">
              <Edit className="text-[#221AE9]" size={16} />
              <span className="text-[#221AE9] font-bold text-[14px]">
                Theme
              </span>
            </div>
          </div>
          <div className="w-full p-[8px] bg-[#F9FAFC] border border-[#f4f4f4] rounded-[12px]">
            <Tabs defaultValue="auto" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 gap-4 text-black">
                <TabsTrigger
                  onClick={() => handleSelectTab("2d")}
                  value="2d"
                  style={{
                    background: tabSelected == "2d" ? "#D7E3FB" : "#fff",
                  }}
                  className={`rounded-[8px] border h-[32px] ${
                    tabSelected == "2d"
                      ? `bg-[#D7E3FB] border-[#221AE9]`
                      : `border-[#D8DCE0]`
                  }`}
                >
                  <span className={`font-medium text-[18px]`}>2D Style</span>
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => handleSelectTab("3d")}
                  value="3d"
                  style={{
                    background: tabSelected == "3d" ? "#D7E3FB" : "#fff",
                  }}
                  className={`rounded-[8px] border h-[32px] ${
                    tabSelected == "3d"
                      ? `bg-[#D7E3FB] border-[#221AE9]`
                      : `border-[#D8DCE0]`
                  }`}
                >
                  <span className={`font-medium text-[18px]`}>3D Style</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="2d" className="space-y-4">
                {content(boardsTwoD, piecesTwoD, "2d")}
              </TabsContent>

              <TabsContent value="3d" className="space-y-4">
                {content(boardsThreeD, piecesThreeD, "3d")}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <button
          onClick={handleSave}
          className={`btn-primary w-full text-sm rounded-full py-2 my-4 h-[48px]  `}
        >
          Save
        </button>
      </DialogContent>
    </Dialog>
  );
}
