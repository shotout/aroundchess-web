"use client";

import { useChessMoveStore } from "@/app/store/chessMoveStore";
import { usePgnStore } from "@/app/store/zustandStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiClient } from "@/functions/api-client";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DotSpinner from "../game-history/Spinner";
import ChessContent from "./ChessContent";
import PreviousAnalysis from "./PreviousAnalysis";
import SavedMistakes from "./SavedMistakes";
import { useDataCache } from "@/app/hooks/useDataCache";
import EmptyLog from "./EmptyLog";
import { sha256Hex } from "@/functions/sha256";
import { enrichMistakeLogsWithAnalyzeSections } from "./utils";
import Link from "next/link";
import Image from "next/image";

const SavedMistakePage = () => {
  const { initializeData, isFetching, hasCachedData } = useDataCache();
  const { getMistakePreviousDetail, getAnalysisByPgnHash } = useApiClient();
  const { chessMove, setChessMove } = useChessMoveStore();
  const [isDesktop, setIsDesktop] = useState(false);
  const [widthSidebar, setWidthSidebar] = useState(0);

  const checkIfDesktop = () => {
    const sidebarW = window.innerWidth / 6;
    setIsDesktop(window.innerWidth >= 1280);
    if (window.innerWidth >= 1280) {
      setWidthSidebar(sidebarW);
    } else {
      setWidthSidebar(0);
    }
  };

  const {
    hydrated,
    username,
    setMistakeLogs,
    setMovementDetails,
    setPlayerInfo,
    setPgn,
    setTitleGame,
    savedMistakes,
    previousAnalyses,
    setPreviousAnalysesDetail,
    tabSelected,
    setTabSelected,
  } = usePgnStore();

  const [mistakePreviousDetail, setMistakePreviousDetail] = useState<any>({
    id: "",
  });
  // const [tabSelected, setSelectedTab] = useState<string>("saved");
  const [MistakeType, setMistakeType] = useState<string>("");
  const [GamePhase, setGamePhase] = useState<string>("");
  const [selectedHistory, setSelectedHistory] = useState<string>("1");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [widthContainer, setWidthContainer] = useState<number>(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hydrated && !hasRun.current) {
      hasRun.current = true;
      initializeData();
    }
  }, [hydrated, initializeData]);

  const fetchMistakePreviousDetailForFilter = async (
    id: string,
    reset: boolean
  ) => {
    try {
      setLoadingPrevious(true);
      const params = reset
        ? {}
        : { page: 1, limit: 10, phase: GamePhase, type: MistakeType };
      const prevDataDetail = await getMistakePreviousDetail(id, params);
      const dataDetail = prevDataDetail.data;
      console.log("getMistakePreviousDetail", dataDetail);
      setMistakePreviousDetail(dataDetail);
      setPgn(dataDetail.pgn);
      setTitleGame(dataDetail.title);
      setMovementDetails(dataDetail.movementDetail);
      setPlayerInfo(dataDetail.playerInfo);

      // Enrich mistake logs with Analyze Game sections and hide Opening/missing
      try {
        const hash = await sha256Hex(dataDetail.pgn || "");
        const analysisRes = await getAnalysisByPgnHash(hash);
        const sections = {
          threats: analysisRes?.data?.threats || [],
          middleGame: analysisRes?.data?.middleGame || { badMoves: [] },
          endGame: analysisRes?.data?.endGame || { badMoves: [] },
        };
        const enriched = enrichMistakeLogsWithAnalyzeSections(
          dataDetail.mistakeLogs,
          sections
        );
        setMistakeLogs(enriched as any);
      } catch (e) {
        // If enrichment fails, still set original (but Opening items may still appear)
        setMistakeLogs(dataDetail.mistakeLogs);
      }
      setLoadingPrevious(false);
    } catch (error) {
      setLoadingPrevious(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();
    checkIfDesktop();

    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", checkIfDesktop);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, [mounted]);

  const handleResize = () => {
    const widthC =
      window?.innerWidth <= 1280
        ? window?.innerWidth
        : window?.innerWidth * 0.52;
    setWidthContainer(widthC);
  };

  useEffect(() => {
    const count = 0;
    setActiveFiltersCount(count);
    setFiltersApplied(count > 0);
  }, [MistakeType, GamePhase]);

  const handleApplyFilters = () => {
    fetchMistakePreviousDetailForFilter(mistakePreviousDetail.id, false);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setGamePhase("");
    setMistakeType("");
    setActiveFiltersCount(0);
    setFiltersApplied(false);
    fetchMistakePreviousDetailForFilter(mistakePreviousDetail.id, true);
  };

  const handleGoPrevious = () => {
    setTabSelected("previous");
    setChessMove({});
    if (mistakePreviousDetail.id) {
      // Refresh detail to ensure enrichment applied when switching tabs
      fetchMistakePreviousDetailForFilter(mistakePreviousDetail.id, false);
    }
  };
  useEffect(() => {
    if (previousAnalyses.length > 0) {
      setSelectedHistory(previousAnalyses[0].id);
    }
  }, []);

  const renderFilters = () => {
    return (
      <>
        <div
          style={{ maxWidth: `calc(100vw - ${widthSidebar}px - 32px)` }}
          className={`flex flex-row w-full overflow-x-auto bg-[#F2FBFE] items-center mb-4 min-h-[48px] lg:mt-8 rounded-[12px] border border-[#C0CED4] p-2 md:p-[12px] `}
        >
          {previousAnalyses.map((hist: any, i: number) => {
            return (
              <div
                onClick={() => {
                  fetchMistakePreviousDetailForFilter(hist.id, false);
                  setSelectedHistory(hist.id);
                }}
                key={i}
                className={`cursor-pointer rounded-[4px] md:rounded-[6px] py-1 px-2 ${
                  selectedHistory != hist.id
                    ? `font-normal `
                    : `border border-[#C0CED4] bg-white shadow-md font-medium `
                }`}
              >
                <span className="min-w-max text-[14px] --10px sm:text-[14px] line-clamp-1">
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
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-[14px] --xs shrink-0 text-[#717375] font-normal text-[14px]">
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
              <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-[14px] --xs shrink-0 text-[#717375] font-normal text-[14px]">
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
              disabled={loadingPrevious}
              onClick={handleApplyFilters}
              className="btn-primary text-white flex items-center justify-center font-medium lg:w-40 gap-2 p-[10px] max-h-[40px] rounded-full text-[14px] --xs whitespace-nowrap"
            >
              <Filter className="h-[20px] w-[20px]" />
              {loadingPrevious ? <DotSpinner size={5} /> : "Apply Filters"}
            </button>
            <button
              disabled={loadingPrevious}
              onClick={handleClearFilters}
              className="btn-tertiary flex items-center justify-center font-medium lg:w-40 px-2 py-2 gap-2 rounded-full p-[10px] max-h-[40px] text-[14px] --xs whitespace-nowrap btn-secondary"
            >
              <Filter className="h-4 w-4" />
              {loadingPrevious ? <DotSpinner size={5} /> : "Clear Filters"}
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
                <span className="inline-flex items-center justify-center w-5 h-5 ml-1 bg-blue-base text-white text-[14px] --xs rounded-full">
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
                <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-[14px] --xs shrink-0 text-[#717375] font-normal text-[14px]">
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
                <SelectTrigger className="py-2 w-1/2 lg:h-12 border border-[#C0CED4] rounded-md text-[14px] --xs shrink-0 text-[#717375] font-normal text-[14px]">
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
                disabled={loadingPrevious}
                onClick={handleApplyFilters}
                className="btn-primary text-white flex items-center justify-center font-medium lg:w-40 gap-2 p-[10px] max-h-[40px] rounded-full text-[14px] --xs whitespace-nowrap"
              >
                <Filter className="h-[20px] w-[20px]" />
                {loadingPrevious ? <DotSpinner size={5} /> : "Apply Filters"}
              </button>
              <button
                disabled={loadingPrevious}
                onClick={handleClearFilters}
                className="btn-tertiary flex items-center justify-center font-medium lg:w-40 px-2 py-2 gap-2 rounded-full p-[10px] max-h-[40px] text-[14px] --xs whitespace-nowrap btn-secondary"
              >
                <Filter className="h-[20px] w-[20px]" />
                {loadingPrevious ? <DotSpinner size={5} /> : "Clear Filters"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  // Show loading only if not hydrated or if we're fetching and don't have cached data
  if (!hydrated || (isFetching && !hasCachedData)) return <DotSpinner />;

  return (
    <main className="w-full p-4 pb-[0px] space-y-[16px] bg-[#FAFDFF]">

      <div className="hidden xl:flex items-center justify-left gap-[4px] mb-[32px]">
        <Link href={'/my-game-history'} className={`flex items-center gap-[8px] justify-center py-[12px] px-[24px] rounded-t-[12px] bg-[#ECF4FF]`}>
          <Image src="/icons/sidebar-game-history.png" alt="icon" width={24} height={24} />
          <span className="font-semibold">Game History</span>
        </Link>

        <Link href={'/saved-mistakes'} className={`flex items-center gap-[8px] justify-center py-[12px] px-[24px] rounded-t-[12px] bg-[#221AE9] text-white`}>
          <Image src="/icons/sidebar-saved-mistakes-icon.svg" alt="icon" width={24} height={24} className="invert brightness-0" />
          <span>Saved Mistakes</span>
        </Link>
      </div>

      <div className="flex justify-center lg:justify-start items-center">
        <div className="flex flex-row items-end gap-2">
          <h1 className="text-xl lg:text-[32px] font-semibold">Saved Mistakes</h1>
          <div className="flex justify-center items-end h-full">
            <p className="text-[14px] --xs text-gray-500 lg:text-[18px] font-normal">
              {`(${username.length>0?username:"No username set"})`}
            </p>
          </div>
        </div>
      </div>

      {savedMistakes.length > 0 ? (
        <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
          <div className="lg:mt-2">
            <ChessContent />
          </div>
          <div className="xl:w-3/4">
            <SavedMistakes onClickSeePrevious={handleGoPrevious} />
          </div>
        </div>
      ) : (
        <SavedMistakes onClickSeePrevious={handleGoPrevious} />
      )}

      {/* <Tabs
        defaultValue="saved"
        className="w-full p-0"
        value={tabSelected}
        onValueChange={setTabSelected}
      >
        <TabsList className="grid w-full h-[50px] lg:h-[62px] grid-cols-2 bg-[#F2FBFE] border border-[#C0CED4] p-1">
          <TabsTrigger
            onClick={() => {
              setTabSelected("saved");
              setChessMove({});
              if (savedMistakes.length > 0) {
                setPgn(savedMistakes[0].pgn);
                setPlayerInfo(savedMistakes[0].playerInfo);
                setTitleGame(savedMistakes[0].title);
                setMovementDetails(savedMistakes[0].movementDetail);
                setPreviousAnalysesDetail(savedMistakes[0]);
              }
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
            onClick={handleGoPrevious}
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
          <span className="hidden lg:block font-semibold text-[20px]">
            Saved Feedback
          </span>
          {savedMistakes.length > 0 ? (
            <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
              <div className="lg:mt-2">
                <ChessContent />
              </div>
              <div className="xl:w-3/4">
                <SavedMistakes onClickSeePrevious={handleGoPrevious} />
              </div>
            </div>
          ) : (
            <SavedMistakes onClickSeePrevious={handleGoPrevious} />
          )}
        </TabsContent>

        <TabsContent value="previous">
          <div className="hidden lg:block">{renderFilters()}</div>
          <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white">
            {!previousAnalyses ||
            (previousAnalyses != null &&
              Object.keys(previousAnalyses).length === 0) ? null : (
              <ChessContent />
            )}
            <div className="block lg:hidden">{renderFilters()}</div>
            {previousAnalyses.length == 0 ? (
              <EmptyLog
                title="You have not yet Analyses"
                content="Analyze Game now"
                noButton={true}
              />
            ) : (
              <div className="xl:w-3/4">
                <PreviousAnalysis />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs> */}
    </main>
  );
};

export default SavedMistakePage;
