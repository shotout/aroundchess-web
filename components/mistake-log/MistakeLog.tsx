"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";
import { usePgnStore } from "@/app/store/zustandStore";

const history = [
  { value: "1", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "2", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "3", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "4", data: "", label: "VS Hikaru (03/03/25)" },
];

const MistakeLog = () => {
  const { PieceChoosed } = useChessBoardThemeStore();
  const { username } = usePgnStore();
  const [tabSelected, setSelectedTab] = useState<string>("saved");
  const [MistakeType, setMistakeType] = useState<string>("");
  const [GamePhase, setGamePhase] = useState<string>("");
  const [selectedHistory, setSelectedHistory] = useState<string>("1");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [widthContainer, setWidthContainer] = useState<number>(700);
  const [mounted, setMounted] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);
  const handleResize = () => {
    let widthC =
      window?.innerWidth <= 1280
        ? window?.innerWidth
        : window?.innerWidth * 0.5;
    console.log("widthC", widthC);
    setWidthContainer(widthC);
  };
  useEffect(() => {
    let count = 0;

    setActiveFiltersCount(count);
    setFiltersApplied(count > 0);
  }, [MistakeType, GamePhase]);

  const handleApplyFilters = () => {
    setShowFilters(false);
  };
  const handleClearFilters = () => {
    setGamePhase("");
    setMistakeType("");
    setActiveFiltersCount(0);
    setFiltersApplied(false);
  };
  const renderFilters = () => {
    return (
      <>
        <div className="flex flex-row w-full max-w-sm md:max-w-full overflow-x-auto bg-[#F2FBFE] items-center mb-4 min-h-[48px] lg:mt-8 rounded-[12px] border border-[#C0CED4] p-2 md:p-[12px] ">
          {history.map((hist: any, i: number) => {
            return (
              <div
                onClick={() => setSelectedHistory(hist.value)}
                key={i}
                className={`rounded-[4px] md:rounded-[6px] py-1 px-2 ${
                  selectedHistory != hist.value
                    ? `font-normal `
                    : `border border-[#C0CED4] bg-white shadow-md font-medium `
                }`}
              >
                <span className="min-w-max text-[10px] sm:text-[14px] line-clamp-1">
                  {hist.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="hidden md:flex items-center mb-4 rounded-lg bg-white border border-[#C0CED4] gap-4 p-2 md:p-[12px] md:h-[56px] lg:h-[64px]">
          <div className="flex items-center gap-1 flex-1 flex-nowrap ">
            <Select
              value={MistakeType}
              onValueChange={setMistakeType}
              defaultValue="All Games"
            >
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
                <SelectValue placeholder="Mistake Type" />
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
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
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
              className="btn-primary text-white flex items-center justify-center font-medium lg:w-40 gap-2 p-[10px] max-h-[40px] rounded-full text-xs whitespace-nowrap"
            >
              <Filter className="h-[20px] w-[20px]" />
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="btn-tertiary flex items-center justify-center font-medium lg:w-40 px-2 py-2 gap-2 rounded-full p-[10px] max-h-[40px] text-xs whitespace-nowrap btn-secondary"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>
        <Button
          variant="outline"
          className={`md:hidden w-full flex items-center justify-center gap-2 py-5 rounded-lg mb-4 ${
            filtersApplied ? "text-blue-base border-blue-base" : ""
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          {filtersApplied ? (
            <>
              Filters Applied
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 ml-1 bg-blue-base text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </>
          ) : (
            "Add Filters"
          )}
        </Button>
        {showFilters && (
          <div className="md:hidden p-2 border rounded-lg mb-4 absolute top-full left-2 right-2 z-10 bg-white shadow-lg">
            <div className="flex items-center space-x-1 lg:space-x-1 flex-1 flex-nowrap mx-2">
            <Select
              value={MistakeType}
              onValueChange={setMistakeType}
              defaultValue="All Games"
            >
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
                <SelectValue placeholder="Mistake Type" />
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
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
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
            <div className="flex items-center justify-end space-x-1 lg:space-x-2 ml-1 shrink-0 mt-2">
            <button
              onClick={handleApplyFilters}
              className="btn-primary text-white flex items-center justify-center font-medium lg:w-40 gap-2 p-[10px] max-h-[40px] rounded-full text-xs whitespace-nowrap"
            >
              <Filter className="h-[20px] w-[20px]" />
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="btn-tertiary flex items-center justify-center font-medium lg:w-40 px-2 py-2 gap-2 rounded-full p-[10px] max-h-[40px] text-xs whitespace-nowrap btn-secondary"
            >
              <Filter className="h-[20px] w-[20px]" />
              Clear Filters
            </button>
            </div>
          </div>
        )}
      </>
    );
  };
  return (
    <main className="w-full px-4 py-4 space-y-[16px] bg-[#FAFDFF]">
      <div className="flex justify-center lg:justify-start items-center">
        <div className="flex flex-row items-end gap-2">
          <h1 className="text-base lg:text-[32px] font-semibold">
            Mistake Log
          </h1>
          <div className="flex justify-center items-end h-full">
            <p className="text-xs text-gray-500 lg:text-[18px] font-normal">
              {`(${username})`}
            </p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="saved" className="w-full p-[8px]">
        <TabsList className="grid w-full lg:h-[62px] grid-cols-2 bg-[#F2FBFE] border border-[#C0CED4] p-1">
          <TabsTrigger
            value="saved"
            className={`${
              tabSelected == "saved"
                ? `rounded-[6px] border border-[#C0CED4]`
                : ` `
            }`}
          >
            <span
              className={`text-[16px] ${
                tabSelected == "saved" ? `font-semibold` : `font-normal`
              } lg:py-2`}
            >
              Saved Mistakes
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="previous"
            className={`${
              tabSelected != "saved"
                ? `rounded-[6px] border border-[#C0CED4]`
                : ` `
            }`}
          >
            <span
              className={`text-[16px] ${
                tabSelected != "saved" ? `font-semibold` : `font-normal`
              } lg:py-2`}
            >
              Previous Analysis
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="gap-2">
          <span className="hidden lg:block font-semibold text-[20px]">
            Saved Mistakes
          </span>
          <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
            <ChessContent />
            <div style={{ width: widthContainer }}>
              <SavedMistakes />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="previous" className="space-y-4">
          <div className="hidden lg:block">{renderFilters()}</div>
          <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
            <ChessContent />
            <div className="block lg:hidden">{renderFilters()}</div>

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
