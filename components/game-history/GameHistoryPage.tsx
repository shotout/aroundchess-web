"use client";

import Analytics from "@/components/game-history/Analytics";
import DialogButton from "@/components/game-history/DialogButton";
import GamesTab from "@/components/game-history/GamesTab";
import Performance from "@/components/game-history/Performance";
import Responsive from "@/components/game-history/Responsive";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Star,
  Target,
  Trophy,
  Swords,
  BarChart2,
  Download,
} from "lucide-react";
import React, { useState } from "react";

const Tabs = ["Games", "Analytics", "Performance"] as const;

const GameHistoryPage = () => {
  const [tab, setTab] = useState<string>("Games");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Responsive />
      <main className="w-full px-4 py-4 space-y-[16px]">
        {/* top menu */}
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-end gap-2">
            <h1 className="text-base font-bold">My Game History</h1>
            <div className="flex justify-center items-end h-full">
              <p className="text-xs text-gray-500">{"(Blitzmystic)"}</p>
            </div>
          </div>

          <DialogButton open={open} setOpen={setOpen} />
        </div>

        {/* overall statistic */}
        <div>
          <div className="font-semibold text-sm py-2">Overall Statistic</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Best Win Card */}
            <Card className="p-3 h-[120px] bg-gradient-to-br from-[#A855F7] to-[#CF9DFF] text-white rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Swords className="h-4 w-4" fill="white" />
                <h1 className="text-sm">Best Win (rating)</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">2,100</h1>
                  <Star fill="white" />
                </div>
                <span className="text-xs mt-1 font-thin">
                  vs IM_ChessMaster
                </span>
              </div>
            </Card>

            {/* Win Rate Card */}
            <Card className="p-3 h-[120px] bg-[#F6FFFA] border-[1px] border-[#029A46] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <h1 className="text-sm font-thin">Win Rate</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold text-green-500">90%</h1>
                </div>
                <span className="text-xs mt-1 font-thin">+5% this month</span>
              </div>
            </Card>

            {/* Average ELO Card */}
            <Card className="p-3 h-[120px] border-[1px] bg-[#F6F9FF] border-[#3871EC] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-blue-500" />
                <h1 className="text-sm font-thin">Average ELO Rating</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold text-blue-500">1,850</h1>
                </div>
                <span className="text-xs mt-1 font-thin">
                  +25 points this month
                </span>
              </div>
            </Card>

            {/* Total Games Card */}
            <Card className="p-3 h-[120px] border-[1px] border-[#DEDEDE] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" fill="#eab308" />
                <h1 className="text-sm font-thin">Total Games</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">1,234</h1>
                </div>
                <span className="text-xs mt-1 font-thin">+45 this month</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="lg:border-2 lg:p-4 lg:rounded-md">
          <div className="flex justify-between items-center">
            <Card className="mb-4 w-full md:max-w-[300px] overflow-hidden bg-[#F9FAFC] border-[1px] lg:border-none border-[#DEDEDE]">
              <div className="flex justify-between items-center h-12 text-xs px-2">
                {Tabs.map((t, index) => (
                  <Button
                    key={index}
                    onClick={() => setTab(t)}
                    variant={tab === t ? "default" : "ghost"}
                    className={`flex-1 text-center py-2 mx-auto rounded-none font-semibold ${
                      tab === t
                        ? "bg-white rounded-md hover:bg-white text-black shadow-sm border border-[#DEDEDE]"
                        : ""
                    }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </Card>
            <Button
              variant="outline"
              className="hidden btn-secondary lg:flex items-center rounded-3xl justify-center px-5 gap-2 lg:h-12 lg:w-52"
            >
              <Download className="h-4 w-4" />
              Export Games
            </Button>
          </div>

          {tab === "Games" && <GamesTab />}
          {tab === "Analytics" && <Analytics />}
          {tab === "Performance" && <Performance />}
        </div>
      </main>
    </>
  );
};

export default GameHistoryPage;
