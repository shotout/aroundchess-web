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
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "../game-history/Spinner";
import { useChessMoveStore } from "@/app/store/chessMoveStore";

const history = [
  { value: "1", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "2", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "3", data: "", label: "VS Hikaru (03/03/25)" },
  { value: "4", data: "", label: "VS Hikaru (03/03/25)" },
];

const MistakeLog = () => {
  const { PieceChoosed } = useChessBoardThemeStore();
  const {
    getMistakeSaved,
    getMistakePrevious,
    getMistakePreviousDetail,
    saveMistakeLog,
    unsaveMistakeLog,
    isLoading,
    error,
  } = useApiClient();
  const { chessMove, setChessMove } = useChessMoveStore();

  const {
    username,
    mistakeLogs,
    setMistakeLogs,
    movementDetails,
    setMovementDetails,
    playerInfo,
    setPlayerInfo,
    setPgn,
    pgn,
    titleGame,
    setTitleGame,
    savedMistakes,
    setSavedMistakes,
    previousAnalyses,
    setPreviousAnalyses,
    setPreviousAnalysesDetail,
    previousAnalysesDetail,
  } = usePgnStore();
  const [mistakePreviousDetail, setMistakePreviousDetail] = useState<any>({
    id: "",
  });
  const [tabSelected, setSelectedTab] = useState<string>("saved");
  const [MistakeType, setMistakeType] = useState<string>("");
  const [GamePhase, setGamePhase] = useState<string>("");
  const [selectedHistory, setSelectedHistory] = useState<string>("1");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [widthContainer, setWidthContainer] = useState<number>(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const loadData = () => {
    fetchMistakePrevious();
    fetchMistakeSaved();
  };
  useEffect(() => {
    loadData();
  }, []);

  const fetchMistakePrevious = async () => {
    try {
      const prevData = await getMistakePrevious();
      console.log("prevData", prevData.data);
      if (prevData.data.length > 0) {
        setPreviousAnalyses(prevData.data);
        setMistakePreviousDetail(prevData.data[0]);
        setSelectedHistory(prevData.data[0].id);
        fetchMistakePreviousDetail(prevData.data[0].id, false);
      }
    } catch (error) {
      console.error("Failed to fetch mistake previous:", error);
    }
  };
  const fetchMistakePreviousDetail = async (id: string, reset: boolean) => {
    try {
      let params = reset
        ? {}
        : { page: 1, limit: 10, phase: GamePhase, type: MistakeType };
      const prevDataDetail = await getMistakePreviousDetail(id, params);
      console.log("prevDataDetail", prevDataDetail);
      let dataDetail = prevDataDetail.data;
      setMistakePreviousDetail(dataDetail);
      setPgn(dataDetail.pgn);
      setTitleGame(dataDetail.title);
      setMovementDetails(dataDetail.movementDetail);
      setPlayerInfo(dataDetail.playerInfo);
      setMistakeLogs(dataDetail.mistakeLogs);
    } catch (error) {
      console.error("Failed to fetch mistake previous:", error);
    }
  };
  const fetchMistakeSaved = async () => {
    try {
      let params = { page: 1, limit: 10 };
      const savedData = await getMistakeSaved(params);
      console.log("savedData", savedData.data);
      setSavedMistakes(savedData.data);
      setPreviousAnalysesDetail(savedData.data[0]);
    } catch (error) {
      console.error("Failed to fetch mistake saved:", error);
    }
  };
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
    fetchMistakePreviousDetail(mistakePreviousDetail.id, false);
    setShowFilters(false);
  };
  const handleClearFilters = () => {
    setGamePhase("");
    setMistakeType("");
    setActiveFiltersCount(0);
    setFiltersApplied(false);
    fetchMistakePreviousDetail(mistakePreviousDetail.id, true);
  };
  const renderFilters = () => {
    return (
      <>
        <div className="flex flex-row w-full max-w-sm md:max-w-full overflow-x-auto bg-[#F2FBFE] items-center mb-4 min-h-[48px] lg:mt-8 rounded-[12px] border border-[#C0CED4] p-2 md:p-[12px] ">
          {previousAnalyses.map((hist: any, i: number) => {
            return (
              <div
                onClick={() => {
                  fetchMistakePreviousDetail(hist.id, false);
                  setSelectedHistory(hist.id);
                }}
                key={i}
                className={`cursor-pointer rounded-[4px] md:rounded-[6px] py-1 px-2 ${
                  selectedHistory != hist.id
                    ? `font-normal `
                    : `border border-[#C0CED4] bg-white shadow-md font-medium `
                }`}
              >
                <span className="min-w-max text-[10px] sm:text-[14px] line-clamp-1">
                  {hist.title}
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
              defaultValue="All Type"
            >
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
                <SelectValue placeholder="Mistake Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Type">All Type</SelectItem>
                <SelectItem value="Critical Mistakes">
                  Critical Mistakes
                </SelectItem>
                <SelectItem value="Threats">Threats</SelectItem>
                <SelectItem value="Bad Moves">Bad Moves</SelectItem>
                <SelectItem value="Weakness Identification">
                  Weakness Identification
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={GamePhase}
              onValueChange={setGamePhase}
              defaultValue="All Phase"
            >
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
                <SelectValue placeholder="Game Phase" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Phase">All Phase</SelectItem>
                <SelectItem value="Opening">Opening</SelectItem>
                <SelectItem value="Middle Game">Middle Game</SelectItem>
                <SelectItem value="End Game">End Game</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-1 lg:space-x-2 ml-1 shrink-0">
            <button
              disabled={isLoading}
              onClick={handleApplyFilters}
              className="btn-primary text-white flex items-center justify-center font-medium lg:w-40 gap-2 p-[10px] max-h-[40px] rounded-full text-xs whitespace-nowrap"
            >
              <Filter className="h-[20px] w-[20px]" />
              {isLoading ? <DotSpinner size={5} /> : "Apply Filters"}
            </button>
            <button
              disabled={isLoading}
              onClick={handleClearFilters}
              className="btn-tertiary flex items-center justify-center font-medium lg:w-40 px-2 py-2 gap-2 rounded-full p-[10px] max-h-[40px] text-xs whitespace-nowrap btn-secondary"
            >
              <Filter className="h-4 w-4" />
              {isLoading ? <DotSpinner size={5} /> : "Clear Filters"}
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
                defaultValue="All Type"
              >
                <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
                  <SelectValue placeholder="Mistake Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Type">All Type</SelectItem>
                  <SelectItem value="Critical Mistakes">
                    Critical Mistakes
                  </SelectItem>
                  <SelectItem value="Threats">Threats</SelectItem>
                  <SelectItem value="Bad Moves">Bad Moves</SelectItem>
                  <SelectItem value="Weakness Identification">
                    Weakness Identification
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={GamePhase}
                onValueChange={setGamePhase}
                defaultValue="All Phase"
              >
                <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-xs shrink-0 text-[#717375] font-normal text-[14px]">
                  <SelectValue placeholder="Game Phase" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Phase">All Phase</SelectItem>
                  <SelectItem value="Opening">Opening</SelectItem>
                  <SelectItem value="Middle Game">Middle Game</SelectItem>
                  <SelectItem value="End Game">End Game</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-end space-x-1 lg:space-x-2 ml-1 shrink-0 mt-2">
              <button
                disabled={isLoading}
                onClick={handleApplyFilters}
                className="btn-primary text-white flex items-center justify-center font-medium lg:w-40 gap-2 p-[10px] max-h-[40px] rounded-full text-xs whitespace-nowrap"
              >
                <Filter className="h-[20px] w-[20px]" />
                {isLoading ? <DotSpinner size={5} /> : "Apply Filters"}
              </button>
              <button
                disabled={isLoading}
                onClick={handleClearFilters}
                className="btn-tertiary flex items-center justify-center font-medium lg:w-40 px-2 py-2 gap-2 rounded-full p-[10px] max-h-[40px] text-xs whitespace-nowrap btn-secondary"
              >
                <Filter className="h-[20px] w-[20px]" />
                {isLoading ? <DotSpinner size={5} /> : "Clear Filters"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  };
  return (
    <main className="w-full p-4 xl:p-[32px] pb-[0px] space-y-[16px] bg-[#FAFDFF]">
      <div className="flex justify-center lg:justify-start items-center">
        <div className="flex flex-row items-end gap-2">
          <h1 className="text-xl lg:text-[32px] font-semibold">Feedback Log</h1>
          <div className="flex justify-center items-end h-full">
            <p className="text-xs text-gray-500 lg:text-[18px] font-normal">
              {`(${username})`}
            </p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="saved" className="w-full p-0 xl:p-[8px] ">
        <TabsList className="grid w-full h-[50px] lg:h-[62px] grid-cols-2 bg-[#F2FBFE] border border-[#C0CED4] p-1">
          <TabsTrigger
            onClick={() => {
              setSelectedTab("saved");
              setChessMove({});
              setPgn(savedMistakes[0].pgn);
              setPlayerInfo(savedMistakes[0].playerInfo);
              setTitleGame(savedMistakes[0].title);
              setMovementDetails(savedMistakes[0].movementDetail);
              setPreviousAnalysesDetail(savedMistakes[0]); // Set the first saved mistake as the default detail
            }}
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
              Saved Feedback
            </span>
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setSelectedTab("previous");
              setChessMove({});
              setPgn(mistakePreviousDetail.pgn);
              setPlayerInfo(mistakePreviousDetail.playerInfo);
              setTitleGame(mistakePreviousDetail.title);
              setMovementDetails(mistakePreviousDetail.movementDetail);
              setPreviousAnalysesDetail(mistakePreviousDetail); // Set the first saved mistake as the default detail
            }}
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
              Previous Analyses
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="gap-2">
          {isLoading ? (
            <DotSpinner />
          ) : (
            <>
              <span className="hidden lg:block font-semibold text-[20px]">
                Saved Feedback
              </span>
              <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
                <div className="lg:mt-2">
                  <ChessContent />
                </div>
                <div className="xl:w-3/4">
                  <SavedMistakes reFetch={loadData} />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="previous">
          {isLoading ? (
            <DotSpinner />
          ) : (
            <>
              <div className="hidden lg:block">{renderFilters()}</div>
              <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
                <ChessContent />
                <div className="block lg:hidden">{renderFilters()}</div>

                <div className="xl:w-3/4">
                  <PreviousAnalysis reFetch={loadData} />
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default MistakeLog;
