"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";
import ChessContent from "./ChessContent";
import SavedMistakes from "./SavedMistakes";
import PreviousAnalysis from "./PreviousAnalysis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

const history = [
  { value: "1", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "2", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "3", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "4", data: "", label: "VS Hikaru (03/03/25)" },
];

const MistakeLog = () => {
  const [MistakeType, setMistakeType] = useState<string>("");
  const [GamePhase, setGamePhase] = useState<string>("");
  const [selectedHistory, setSelectedHistory] = useState<string>("1");

  const handleApplyFilters = () => {};

  const handleClearFilters = () => {
    setGamePhase("");
    setMistakeType("");
  };
  return (
    <main className="w-full px-4 py-4 space-y-[16px]">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-end gap-2">
          <h1 className="text-base lg:text-3xl font-bold">Mistake Log</h1>
          <div className="flex justify-center items-end h-full">
            <p className="text-xs text-gray-500 lg:text-lg">
              {"(Blitzmystic)"}
            </p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full h-[62px] grid-cols-2 bg-[#F2FBFE] border border-[#C0CED4] p-1">
          <TabsTrigger value="saved">
            <span className="text-xs py-2">Saved Mistakes</span>
          </TabsTrigger>
          <TabsTrigger value="previous">
            <span className="text-xs py-2">Previous Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          <span className="font-bold text-md">Saved Mistakes</span>
          <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
            <ChessContent />
            <div className="xl:w-3/4">
              <SavedMistakes />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="previous" className="space-y-4">
          <div className="hidden md:flex bg-[#F2FBFE] items-center mb-4 mt-8 rounded-lg border border-primary-gray py-2 md:p-2 md:h-[36px] lg:h-[48px]">
            <div className="flex items-center space-x-1 lg:space-x-1 flex-1 flex-nowrap mx-2">
              {history.map((hist: any, i: number) => {
                return (
                  <div
                    key={i}
                    className={`rounded-[2px] py-1 px-2 ${
                      selectedHistory != hist.value ? `` : `bg-white shadow-md`
                    }`}
                  >
                    <span className="text-xs">{hist.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center mb-4 rounded-lg border border-primary-gray gap-2 p-2 md:p-4 md:h-[56px] lg:h-[80px]">
            <div className="flex items-center space-x-1 lg:space-x-1 flex-1 flex-nowrap mx-2">
              <Select
                value={MistakeType}
                onValueChange={setMistakeType}
                defaultValue="All Games"
              >
                <SelectTrigger className="py-2 w-1/2 lg:h-12 border rounded-md bg-white text-xs shrink-0">
                  <SelectValue placeholder="All Games" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Games">All Games</SelectItem>
                  <SelectItem value="Bullet">Bullet</SelectItem>
                  <SelectItem value="Blitz">Blitz</SelectItem>
                  <SelectItem value="Rapid">Rapid</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={GamePhase}
                onValueChange={setGamePhase}
                defaultValue="All Formats"
              >
                <SelectTrigger className="py-2 w-1/2 lg:h-12 border rounded-md bg-white text-xs shrink-0">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Formats">All Sources</SelectItem>
                  <SelectItem value="Chess.com">Chess.com</SelectItem>
                  <SelectItem value="PGN Upload">PGN Upload</SelectItem>
                  <SelectItem value="Online Games">Online Games</SelectItem>
                  <SelectItem value="Tournaments">Tournaments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-1 lg:space-x-2 ml-1 shrink-0">
              <button
                onClick={handleApplyFilters}
                className="btn-primary text-white flex items-center justify-center lg:w-40 gap-2 py-2 px-2 rounded-3xl text-xs whitespace-nowrap"
              >
                <Filter className="h-4 w-4" />
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="btn-tertiary flex items-center justify-center lg:w-40 px-2 py-2 gap-2 rounded-3xl text-xs whitespace-nowrap btn-secondary"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
            <ChessContent />
            <div className="xl:w-3/4">
              <PreviousAnalysis />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default MistakeLog;
