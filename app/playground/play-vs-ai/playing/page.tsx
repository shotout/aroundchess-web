"use client";
import WoodBoard from "@/components/chessboard/wood/WoodBoard";
import Navigation from "@/components/navigator/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chess } from "chess.js";
import { ArrowLeft, HistoryIcon, MoveRightIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function Playing() {
  const [game, setGame] = useState<Chess>(new Chess());

  const [selectedTab, setSelectedTab] = useState("current"); // Default size
  const [boardSize, setBoardSize] = useState(700); // Default size
  useEffect(() => {
    handleResize();
  }, []);
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const minPadding = 0;
    const maxSize = window.innerWidth >1024 ? window.innerWidth / 2.9 : 453;
    // const maxSize = window.innerWidth > 1300 ? 453 : window.innerWidth/1.5;
    console.log("Resizing board...", isPortrait, window.innerWidth);

    if (isPortrait) {
      // In portrait mode, use screen width as the primary constraint
      const availableWidth = width - minPadding * 2;
      // Use 85% of available width for mobile, 90% for tablets
      const sizeFactor = width <= 430 ? 0.85 : 0.9;
      setBoardSize(Math.min(maxSize, availableWidth * sizeFactor + 20));
      console.log(Math.min(maxSize, availableWidth * sizeFactor));
    } else {
      // In landscape, use height as the primary constraint
      const availableHeight = height - minPadding * 2;
      // Use 80% of available height
      setBoardSize(Math.min(maxSize, availableHeight * 0.8));
      console.log("size board...", Math.min(maxSize, availableHeight * 0.8));
    }
  };

  const handleSwitch = () => {};
  const handleSetting = () => {};
  const handleThreeD = () => {};
  const handleHint = () => {};
  const handleResign = () => {};
  const handleNewGame = () => {};

  const buttonBoard = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="xl:hidden flex flex-row self-end sm:self-center justify-end items-center gap-3"
      >
        <button onClick={handleSwitch}>
          <Image
            src={"/images/play-vs-ai/switch.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] rounded-full object-contain"
          />
        </button>
        <button onClick={handleSetting}>
          <Image
            src={"/images/play-vs-ai/setting.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] object-contain"
          />
        </button>
        <button onClick={handleThreeD}>
          <Image
            src={"/images/play-vs-ai/3d.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button>
      </div>
    );
  };
  const buttonBoardColumn = () => {
    return (
      <div
        style={{ width: boardSize }}
        className="hidden xl:flex max-w-[20px]  flex-col justify-start items-center gap-3"
      >
        <button onClick={handleSwitch}>
          <Image
            src={"/images/play-vs-ai/switch.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] rounded-full object-contain"
          />
        </button>
        <button onClick={handleSetting}>
          <Image
            src={"/images/play-vs-ai/setting.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[20px] h-[20px] object-contain"
          />
        </button>
        <button onClick={handleThreeD}>
          <Image
            src={"/images/play-vs-ai/3d.png"}
            alt="icon"
            width={1000}
            height={1000}
            className="w-[22px] h-[27px] object-contain"
          />
        </button>
      </div>
    );
  };
  return (
    <Navigation>
      <div className="flex flex-col xl:flex-row w-full bg-white p-2 sm:p-4 gap-4 lg:mt-8 xl:mt-0">
        <div className="flex flex-col w-full gap-4 ">
          <div className="xl:hidden flex flex-row items-center justify-between mb-2">
            <button>
              <ArrowLeft color="black" size={24} />
            </button>
            <div className="flex flex-1 flex-row justify-center items-center gap-2">
              <Image
                src={"/images/play-vs-ai/icon-play-vs-ai.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[22px] h-[21px] object-contain"
              />
              <span className="font-semibold text-[18px]">Play VS AI</span>
            </div>
            <div className="flex " />
          </div>

          <div className="rounded-[8px] min-h-[54px] bg-[#FAFDFF] border border-[#DEDEDE] p-4">
            <div className="flex items-center justify-center rounded-[6px] bg-white shadow-md border border-[#DEDEDE] px-4 py-2">
              <span className="text-xs font-normal">
                Current Turn:{" "}
                <span className="text-[14px] font-medium">White</span>
              </span>
            </div>
          </div>
          <div className="xl:border xl:border-[#DEDEDE] xl:p-4 xl:rounded-[16px]">
            <div className="flex flex-row min-h-[46px] items-center rounded-[8px] bg-white border border-[#DEDEDE] p-2 gap-2 xl:mb-2">
              <Image
                src={"/images/play-vs-ai/thomas.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[22px] h-[22px] rounded-full object-contain"
              />
              <span className="text-[16px] font-medium">You</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-3 ">
              {buttonBoard()}
              <WoodBoard boardWidth={boardSize} position={game.fen()} />
              <div className="flex flex-row flex-wrap items-center justify-center gap-2 xl:mb-2">
                <div className="flex flex-row items-center justify-center gap-1">
                  <div className="w-[14px] h-[14px] bg-[#B9CA43]" />
                  <span className="h-[14px] font-normal text-[11px]">
                    Previous Place
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                  <div className="w-[14px] h-[14px] bg-[#F5F682]" />
                  <span className="h-[14px] font-normal text-[11px]">
                    Current Place
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                  <div className="w-[14px] h-[14px] rounded-full bg-[#1C16C2]" />
                  <span className="h-[14px] font-normal text-[11px]">
                    Possible Move
                  </span>
                </div>
                <div className="flex flex-row items-center justify-center gap-1">
                  <MoveRightIcon color="#221AE950" size={16} />
                  <span className="h-[14px] font-normal text-[11px]">
                    Move Recommendation
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-row min-h-[46px] items-center rounded-[8px] bg-white border border-[#DEDEDE] p-2 gap-2">
              <Image
                src={"/images/play-vs-ai/thomas.png"}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[22px] h-[22px] object-contain"
              />
              <span className="text-[16px] font-medium">AI</span>
            </div>
          </div>
        </div>
        {buttonBoardColumn()}
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 min-h-[54px] rounded-[8px] bg-[#FAFDFF] border border-[#DEDEDE] p-2 gap-2">
            <TabsTrigger
              value="current"
              className={`gap-2 py-2 ${
                selectedTab == "current"
                  ? `shadow-md border border-[#DEDEDE]`
                  : ``
              }`}
              onClick={() => setSelectedTab("current")}
            >
              <Image
                src={`/images/play-vs-ai/chess-king-rook${
                  selectedTab == "current" ? `-active` : ``
                }.png`}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[19px] h-[19px] object-contain"
              />
              <span
                className={`text-[16px] font-semibold ${
                  selectedTab == "current" ? `text-[#221AE9]` : `text-black`
                }`}
              >
                Current Game
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className={`gap-2 py-2 ${
                selectedTab == "past" ? `shadow-md border border-[#DEDEDE]` : ``
              }`}
              onClick={() => setSelectedTab("past")}
            >
              <Image
                src={`/images/play-vs-ai/past-games${
                  selectedTab == "past" ? `-active` : ``
                }.png`}
                alt="icon"
                width={1000}
                height={1000}
                className="w-[18px] h-[18px] object-contain"
              />
              <span
                className={`text-[16px] font-semibold ${
                  selectedTab == "past" ? `text-[#221AE9]` : `text-black`
                }`}
              >
                Past Games
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="gap-2">
            <div className="flex flex-col items-center justify-center rounded-[16px] bg-white border border-[#DEDEDE] gap-2">
              <span className="font-semibold text-[16px] my-1">
                Movement Details
              </span>
              <div className="px-2 w-full xl:max-h-[70vh] xl:overflow-y-auto">
                <table className="w-full border-collapse rounded-[4px] border-[#BDD0F9]">
                  <thead>
                    <tr className="bg-[#D7E3FB]">
                      <th className="p-2 border font-normal text-xs">#</th>
                      <th className="p-2 border font-normal text-xs">
                        You (White)
                      </th>
                      <th className="p-2 border font-normal text-xs">
                        Computer (Black)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="p-2 border font-normal text-xs">1</td>
                      <td className="text-center align-middle p-2 border ">
                        <Image
                          src={"/images/play-vs-ai/pawn-white.png"}
                          alt="icon"
                          width={1000}
                          height={1000}
                          className="w-[8.37px] h-[16px] object-contain inline-block"
                        />
                        <span className="h-[16px] font-normal text-xs">
                          {" "}
                          b3
                        </span>
                      </td>
                      <td className="text-center align-middle p-2 border  ">
                        <Image
                          src={"/images/play-vs-ai/pawn-black.png"}
                          alt="icon"
                          width={1000}
                          height={1000}
                          className="w-[8.37px] h-[16px] object-contain inline-block"
                        />
                        <span className="h-[16px] font-normal text-xs">
                          {" "}
                          g5
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex w-full rounded-[8px] border-t border-t-[#DEDEDE] gap-2 p-2">
                <button
                  onClick={handleHint}
                  className="flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border border-[#221AE9] bg-[#221AE908] text-[#221AE9] rounded-[8px] hover:bg-blue-100 gap-1"
                >
                  <Image
                    src={"/images/play-vs-ai/hint.png"}
                    alt="icon"
                    width={1000}
                    height={1000}
                    className="w-[11px] h-[16px] object-contain "
                  />

                  <span className="font-medium text-xs mt-1 ">Hint</span>
                </button>
                <button
                  onClick={handleResign}
                  className="flex flex-row justify-center items-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1 "
                >
                  <Image
                    src={"/images/play-vs-ai/resign.png"}
                    alt="icon"
                    width={1000}
                    height={1000}
                    className="w-[11px] h-[16px] object-contain "
                  />

                  <span className="font-medium text-xs mt-1 ">Resign</span>
                </button>
                <button
                  onClick={handleNewGame}
                  className="flex flex-row items-center justify-center min-h-[40px] w-1/3 px-4 py-2 border border-[#DEDEDE] rounded-[8px] hover:bg-gray-100 gap-1"
                >
                  <Image
                    src={"/images/play-vs-ai/new-game.png"}
                    alt="icon"
                    width={1000}
                    height={1000}
                    className="w-[16px] h-[16px] object-contain"
                  />
                  <span className="font-medium text-xs mt-1">New Game</span>
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past" className="gap-2"></TabsContent>
        </Tabs>
      </div>
    </Navigation>
  );
}
