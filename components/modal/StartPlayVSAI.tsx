"use client";

import { usePgnStore } from "@/app/store/zustandStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useEffect, useState } from "react";

export function StartPlayVSAI() {
  const {
    setPgn,
    setIsLoading,
    setError,
    isLoading,
    dataAnalysis,
    setDataAnalysis,
    setDataGamesImport,
  } = usePgnStore();
  const [selectedColor, setSelectedColor] = useState<string>("white");
  const [selectedOpponent, setSelectedOpponent] = useState<number>(0);
  const [selectedElo, setSelectedElo] = useState<number>(200);
  const [difficulty, setDifficulty] = useState<string>("beginner");

  const difficulties = [
    {
      icon: "/images/play-vs-ai/beginner.png",
      label: "Beginner",
      range: "250 - 850 ELO",
      key: "beginner",
    },
    {
      icon: "/images/play-vs-ai/intermediate.png",
      label: "Intermediate",
      range: "900 - 1400 ELO",
      key: "intermediate",
    },
    {
      icon: "/images/play-vs-ai/advanced.png",
      label: "Advanced",
      range: "1500 - 2100 ELO",
      key: "advanced",
    },
    {
      icon: "/images/play-vs-ai/master.png",
      label: "Master",
      range: "2200 - 2450 ELO",
      key: "master",
    },
  ];

  const opponents = [
    {
      id: 0,
      name: "Thomas De",
      elo: 250,
      img: "/images/play-vs-ai/thomas.png",
    },
    { id: 1, name: "Sofia", elo: 250, img: "/images/play-vs-ai/sofia.png" },
    { id: 2, name: "Pierre", elo: 400, img: "/images/play-vs-ai/pierre.png" },
    { id: 30, name: "Lieke", elo: 400, img: "/images/play-vs-ai/lieke.png" },
    { id: 3, name: "Ana Es", elo: 400, img: "/images/play-vs-ai/ana.png" },
    { id: 4, name: "Carlos", elo: 500, img: "/images/play-vs-ai/carlos.png" },
    { id: 5, name: "Lana del", elo: 500, img: "/images/play-vs-ai/lana.png" },
    { id: 6, name: "Dimitri", elo: 500, img: "/images/play-vs-ai/dimitri.png" },
    { id: 7, name: "Marco", elo: 600, img: "/images/play-vs-ai/marco.png" },
    { id: 8, name: "Marie", elo: 600, img: "/images/play-vs-ai/marie.png" },
    { id: 9, name: "Elena", elo: 600, img: "/images/play-vs-ai/elena.png" },
    { id: 10, name: "Viktor", elo: 700, img: "/images/play-vs-ai/viktor.png" },
    { id: 11, name: "Delia", elo: 700, img: "/images/play-vs-ai/delia.png" },
    { id: 12, name: "Hans", elo: 700, img: "/images/play-vs-ai/hans.png" },
    { id: 13, name: "Igor", elo: 800, img: "/images/play-vs-ai/igor.png" },
    { id: 14, name: "Amel", elo: 800, img: "/images/play-vs-ai/amel.png" },
    { id: 15, name: "Lisa", elo: 800, img: "/images/play-vs-ai/lisa.png" },
    {
      id: 16,
      name: "Andreas",
      elo: 850,
      img: "/images/play-vs-ai/andreas.png",
    },
    { id: 17, name: "Astrid", elo: 850, img: "/images/play-vs-ai/astrid.png" },
    { id: 18, name: "Ingrid", elo: 850, img: "/images/play-vs-ai/ingrid.png" },
  ];
  const [open, setOpen] = useState(false);
  useEffect(() => {}, []);
  const handlePlayNow = () => {
    let index = opponents.findIndex((o) => o.id == selectedOpponent);
    let ELO =
      opponents[index].elo +
      difficulties.findIndex((d) => d.key == difficulty) * 650;
      let opponentData = opponents[index]
      opponentData.elo = ELO
    let body = {
      color: selectedColor,
      difficulty: difficulty,
      opponent:opponentData ,
    };
    console.log(body);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full px-4 py-2 btn-primary rounded-full">
          Start Now
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-sm sm:min-w-[640px] md:max-w-xl lg:max-w-[902px] xl:max-w-[1141px] bg-white">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>
            <h2 className="text-[18px] font-semibold text-center">
              Choose Your Color
            </h2>
          </DialogTitle>
          <DialogDescription className="text-black font-normal text-center text-[14px] sm:text-xs">
            Select which color you want to play as. The computer will play as
            the opposite color.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex flex-col justify-center items-center bg-white">
          <div className="flex flex-row items-center justify-center gap-3 border-b-2 border-b-input pb-2">
            {[
              { color: "white", icon: "/images/play-vs-ai/white-king.png" },
              { color: "black", icon: "/images/play-vs-ai/black-king.png" },
            ].map(({ color, icon }) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`relative w-1/2 sm:min-w-1/2 md:min-w-1/2 h-[174px] shadow-md px-2 py-3 gap-2 border rounded-lg text-lg font-normal flex flex-col justify-center items-center ${
                  selectedColor === color ? "border-2 border-[#3871EC]" : ""
                }`}
              >
                <Image
                  src={icon}
                  alt={color}
                  width={1000}
                  height={1000}
                  className="w-[79px] h-[80px] object-contain"
                />

                <div
                  className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                    selectedColor === color
                      ? `bg-[#221AE9] shadow-[#3871EC] shadow-md`
                      : `border-input border-2`
                  } `}
                />
                <span className="capitalize text-sm">{color}</span>
              </button>
            ))}
          </div>
          <h2 className="text-[24px] font-semibold text-center mt-2">
            Choose your Opponent
          </h2>
          <div className="flex max-w-xs sm:max-w-lg md:max-w-full overflow-x-scroll sm:overflow-hidden gap-2 mt-4 py-2 px-1">
            {difficulties.map((diff) => (
              <button
                key={diff.key}
                onClick={() => setDifficulty(diff.key)}
                className={`flex flex-col items-center justify-center px-1 py-1 min-w-[120px] md:min-w-[25%] rounded-[6px] gap-1 ${
                  difficulty === diff.key
                    ? "text-[#221AE9] shadow-md border border-input"
                    : ""
                }`}
              >
                <div className="flex flex-row items-center justify-center gap-1">
                  <Image
                    src={diff.icon}
                    alt={diff.icon}
                    width={1000}
                    height={1000}
                    className="w-[22px] h-[15px] object-contain"
                  />
                  <span
                    className={`text-xs  ${
                      difficulty === diff.key ? "font-semibold" : ""
                    } `}
                  >
                    {diff.label} <br />{" "}
                  </span>
                </div>
                <span className={`text-[11px] font-normal `}>{diff.range}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center max-h-[423px] overflow-y-scroll grid grid-cols-3 sm:grid-cols-6 gap-2 my-4 border border-input shadow-md rounded-sm p-4">
            {opponents.map((opponent) => {
              let ELO =
                opponent.elo +
                difficulties.findIndex((d) => d.key == difficulty) * 650;
              return (
                <button
                  key={opponent.name}
                  onClick={() => {
                    setSelectedOpponent(opponent.id)
                  }}
                  className={`flex flex-col items-center max-w-[82px] p-1 rounded-sm gap-1 ${
                    selectedOpponent === opponent.id
                      ? "border border-[#221AE9] text-[#221AE9] font-bold"
                      : ""
                  }`}
                >
                  <Image
                    src={opponent.img}
                    alt={opponent.name}
                    width={1000}
                    height={1000}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="text-xs">{opponent.name}</span>
                  <span className="text-xs font-normal">ELO {ELO}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <button
          onClick={handlePlayNow}
          className="w-full rounded-full h-[48px] btn-primary"
        >
          Play Now
        </button>
      </DialogContent>
    </Dialog>
  );
}
