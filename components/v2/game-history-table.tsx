"use client";

import { useState, useMemo, useEffect } from "react";
import { usePagination } from "@/components/pagination/hook/usePagination";
import { useGames, GameFilters } from "@/components/game-history/hooks/useGameData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GamesList from "@/components/game-history/components/GameList";
import Timeframe from "@/components/game-history/components/Timeframe";
import { useTutorial } from "@/components/TutorialProvider";
import { usePgnStore } from "@/app/store/zustandStore";

export function GameHistoryTable() {
  const [sources, setSources] = useState<string[]>([
    "chesscom",
    "vs_ai",
    "pgn_upload",
  ]);
  const [result, setResult] = useState<string>("All Results");
  const [color, setColor] = useState<string>("All Colors");
  const [analyzedOnly, setAnalyzedOnly] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [isFilterDisabled, setIsFilterDisabled] = useState<boolean>(false);

  const [debouncedOpponent, setDebouncedOpponent] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOpponent(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const apiFilters = useMemo<GameFilters>(() => {
    const filters: GameFilters = {};

    if (sources.length > 0) {
      filters.sources = sources;
    }

    if (result !== "All Results") {
      const resultMap: Record<string, string> = {
        Wins: "win",
        Losses: "loss",
        Draws: "draw",
      };
      filters.result = resultMap[result];
    }

    if (color !== "All Colors") {
      filters.color = color.toLowerCase();
    }

    if (analyzedOnly) {
      filters.analyzedOnly = true;
    }

    if (startDate) {
      filters.startDate = startDate;
    }

    if (endDate) {
      filters.endDate = endDate;
    }

    if (debouncedOpponent && debouncedOpponent.trim() !== "") {
      filters.opponent = debouncedOpponent.trim();
    }

    return filters;
  }, [sources, result, color, analyzedOnly, startDate, endDate, debouncedOpponent]);

  const { games, isLoading, error, handleRetryFetch, handleForceRefresh } =
    useGames(apiFilters);

  const paginationProps = usePagination(games);

  useEffect(() => {
    if (isLoading) {
      setIsFilterDisabled(true);
    } else {
      const timer = setTimeout(() => {
        setIsFilterDisabled(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleSourceToggle = (source: string) => {
    setSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const handleResultChange = (value: string) => setResult(value);
  const handleAnalyzedOnlyChange = (checked: boolean) => setAnalyzedOnly(checked);
  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const { isTutorialPlay } = useTutorial();
  const { username } = usePgnStore();

  const checkboxLabelBase =
    "relative flex items-center justify-center w-[16px] h-[16px] border border-[#C0CED4] bg-white rounded-[4px] has-[.peer:checked]:bg-[#221AE9] has-[.peer:checked]:border-[#221AE9] has-[.peer:checked]:outline-[2px] has-[.peer:checked]:outline-[rgba(34,26,233,.16)] has-[.peer:checked]";

  return (
    <div className="mb-[32px]">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-[16px] md:p-[20px]">
        <div className="flex items-center justify-between mb-[16px]">
          <h3 className="text-[24px] font-bold leading-[140%] text-[#111827]">
            Your Games
          </h3>

          {username && (
            <button
              type="button"
              onClick={handleForceRefresh}
              disabled={isLoading}
              className={`h-[44px] rounded-full px-6 text-[14px] font-semibold text-blue-700 bg-[#81CFF3] shadow-sm transition-opacity ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              } border-2 border-[#3CA0CE]`}
            >
              Update Games
            </button>
          )}
        </div>

        <div className="w-full relative flex items-center mb-[16px]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-[14px]"
          >
            <path
              d="M14.25 14.25L10.9875 10.9875M12.75 6.75C12.75 10.0637 10.0637 12.75 6.75 12.75C3.43629 12.75 0.75 10.0637 0.75 6.75C0.75 3.43629 3.43629 0.75 6.75 0.75C10.0637 0.75 12.75 3.43629 12.75 6.75Z"
              stroke="#99A5A9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search Opponent"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-[38px] py-[10px] md:py-[12px] pr-[12px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-full text-[14px] outline-none focus:border-[#221AE9]"
          />
        </div>

        {!isTutorialPlay && (
          <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-[8px] lg:gap-[32px] mb-[16px] md:mb-[24px]">
            <div className="w-full lg:hidden">
              <label className="block font-semibold text-[16px] leading-[150%] mb-[4px]">
                Timeframe
              </label>
              <Timeframe onDateChange={handleDateRangeChange} disabled={isFilterDisabled} />
            </div>

            <div className="w-full lg:w-1/3">
              <label className="block font-semibold text-[16px] leading-[150%] lg:mb-[4px]">
                Games
              </label>
              <div className="h-[32px] flex items-center justify-between lg:justify-start gap-[16px]">
                {[
                  { id: "games-chessdotcom", value: "chesscom", label: "Chess.com" },
                  { id: "games-youvsai", value: "vs_ai", label: "Against AI" },
                  { id: "games-pgnupload", value: "pgn_upload", label: "Import" },
                ].map((opt) => (
                  <div key={opt.id} className="flex items-center gap-[8px]">
                    <label
                      htmlFor={opt.id}
                      className={`${checkboxLabelBase} ${
                        isFilterDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 9 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.22426 0.175736C8.45858 0.410051 8.45858 0.78995 8.22426 1.02426L3.42426 5.82426C3.18995 6.05858 2.81005 6.05858 2.57574 5.82426L0.175736 3.42426C-0.0585787 3.18995 -0.0585787 2.81005 0.175736 2.57574C0.41005 2.34142 0.789949 2.34142 1.02426 2.57574L3 4.55147L7.37574 0.175736C7.61005 -0.0585787 7.98995 -0.0585787 8.22426 0.175736Z"
                          fill="#FCFCFD"
                        />
                      </svg>
                      <input
                        id={opt.id}
                        type="checkbox"
                        checked={sources.includes(opt.value)}
                        onChange={() => handleSourceToggle(opt.value)}
                        disabled={isFilterDisabled}
                        className="peer hidden"
                      />
                    </label>
                    <label
                      htmlFor={opt.id}
                      className={`leading-[16px] text-[14px] mt-[2px] ${
                        isFilterDisabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[calc(50%-8px)] lg:w-1/5">
              <label className="block font-semibold text-[16px] leading-[150%] mb-[4px]">
                Game Results
              </label>
              <Select
                value={result}
                onValueChange={handleResultChange}
                defaultValue="All Results"
                disabled={isFilterDisabled}
              >
                <SelectTrigger className="w-full h-[42px] md:h-[38px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] text-[#717375]">
                  <SelectValue placeholder="All Results" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Results">All Results</SelectItem>
                  <SelectItem value="Wins">Wins</SelectItem>
                  <SelectItem value="Losses">Losses</SelectItem>
                  <SelectItem value="Draws">Draws</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[calc(50%-8px)] lg:w-1/5">
              <label className="block font-semibold text-[16px] leading-[150%] mb-[4px]">
                Analyzed Games
              </label>
              <div className="h-[42px] md:h-[38px] flex items-center gap-[8px]">
                <label
                  htmlFor="analyzed-games-only"
                  className={`${checkboxLabelBase} ${
                    isFilterDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 9 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.22426 0.175736C8.45858 0.410051 8.45858 0.78995 8.22426 1.02426L3.42426 5.82426C3.18995 6.05858 2.81005 6.05858 2.57574 5.82426L0.175736 3.42426C-0.0585787 3.18995 -0.0585787 2.81005 0.175736 2.57574C0.41005 2.34142 0.789949 2.34142 1.02426 2.57574L3 4.55147L7.37574 0.175736C7.61005 -0.0585787 7.98995 -0.0585787 8.22426 0.175736Z"
                      fill="#FCFCFD"
                    />
                  </svg>
                  <input
                    id="analyzed-games-only"
                    type="checkbox"
                    checked={analyzedOnly}
                    onChange={(e) => handleAnalyzedOnlyChange(e.target.checked)}
                    disabled={isFilterDisabled}
                    className="peer hidden"
                  />
                </label>
                <label
                  htmlFor="analyzed-games-only"
                  className={`leading-[16px] text-[14px] mt-[2px] ${
                    isFilterDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  Analyzed Games only
                </label>
              </div>
            </div>

            <div className="w-1/5 hidden lg:flex flex-col">
              <label className="block font-semibold text-[16px] leading-[150%] mb-[4px]">
                Timeframe
              </label>
              <Timeframe onDateChange={handleDateRangeChange} disabled={isFilterDisabled} />
            </div>
          </div>
        )}

        <GamesList
          games={games}
          currentGames={paginationProps.currentData}
          isLoading={isLoading}
          error={error}
          handleRetryFetch={handleRetryFetch}
          paginationProps={paginationProps}
          variant="v2"
        />
      </div>
    </div>
  );
}

export default GameHistoryTable;
