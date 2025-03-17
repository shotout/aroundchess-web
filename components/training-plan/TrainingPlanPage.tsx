"use client";

import Responsive from "@/components/game-history/Responsive";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Star,
  Target,
  Trophy,
  Swords,
  BarChart2,
  PlusIcon,
} from "lucide-react";
import React, { useState } from "react";
import Statistics from "./statistics/Statistics";
import DailyPlan from "./daily/DailyPlan";
import DialogPlan from "./dialog/DialogPlan";
import WeeklyPlan from "./weekly/WeeklyPlan";
import TrainingGoals from "./goals";

const Tabs = ["Daily Plan", "Weekly Plan", "Goals", "Statistics"] as const;

const TrainingPlanPage = () => {
  const [tab, setTab] = useState<string>("Statistics");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* <Responsive /> */}
      <main className="w-full p-4 space-y-[16px]">
        {/* top menu */}
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-end gap-2">
            <h1 className="text-base font-bold">My Training Plan</h1>
            <div className="flex justify-center items-end h-full">
              <p className="text-xs text-gray-500">{"(Blitzmystic)"}</p>
            </div>
          </div>

          <DialogPlan open={open} setOpen={setOpen} />
        </div>

        {/* overall statistic */}
        <div>
          <div className="font-semibold text-sm py-2">Overall Improvement</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Best Win Card */}
            <Card className="p-3 h-[120px] bg-gradient-to-br from-[#A855F7] to-[#CF9DFF] text-white rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Swords className="h-4 w-4" fill="white" />
                <h1 className="text-sm">Goals Met</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">8/10</h1>
                  <Star fill="white" />
                </div>
                <span className="text-xs mt-1 font-thin">80% success rate</span>
              </div>
            </Card>

            {/* Average ELO Card */}
            <Card className="p-3 h-[120px] border-[1px] bg-[#F6F9FF] border-[#3871EC] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-blue-500" />
                <h1 className="text-sm font-thin">Current ELO Rating</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold text-blue-500">1,850</h1>
                </div>
                <span className="text-xs mt-1 font-thin">
                  +25 points compared to last moth
                </span>
              </div>
            </Card>

            {/* Win Rate Card */}
            <Card className="p-3 h-[120px] bg-[#F6FFFA] border-[1px] border-[#029A46] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <h1 className="text-sm font-thin">Training Days</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold text-green-500">15/30</h1>
                </div>
                <span className="text-xs mt-1 font-thin">50% completion</span>
              </div>
            </Card>

            {/* Total Games Card */}
            <Card className="p-3 h-[120px] border-[1px] bg-[#FAC93314] border-[#FAC933] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" fill="#eab308" />
                <h1 className="text-sm font-thin">Accuracy</h1>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h1 className="text-lg font-bold">85%</h1>
                </div>
                <span className="text-xs mt-1 font-thin">+5% improvement</span>
              </div>
            </Card>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="btn-primary md:hidden rounded-full flex justify-center items-center gap-2 p-2 h-9 w-full"
        >
          <PlusIcon className="w-5 h-5 text-white" />
          <h1 className="text-sm">Create Training Plan</h1>
        </Button>

        {/* Tab navigation */}
        <div className="lg:border-2 lg:p-4 lg:rounded-md">
          <div className="flex justify-between items-center">
            <Card className="mb-4 w-full lg:max-w-[500px] overflow-hidden bg-[#F9FAFC] border-[1px] lg:border-none border-[#DEDEDE]">
              <div className="flex justify-between items-center h-12 text-[9px]  px-2 text-nowrap">
                {Tabs.map((t, index) => (
                  <Button
                    key={index}
                    onClick={() => setTab(t)}
                    variant={tab === t ? "default" : "ghost"}
                    className={`flex-1 text-center py-2 mx-auto rounded-none font-semibold text-xs ${
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
          </div>
          {tab === "Statistics" && <Statistics />}
          {tab === "Daily Plan" && <DailyPlan />}
          {tab === "Weekly Plan" && <WeeklyPlan />}
          {tab === "Goals" && <TrainingGoals />}
        </div>
      </main>
    </>
  );
};

export default TrainingPlanPage;
