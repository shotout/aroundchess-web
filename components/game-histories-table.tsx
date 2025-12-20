import { useState, useMemo, useEffect, useCallback } from "react";
import { usePagination } from "./pagination/hook/usePagination";
import { useGames, GameFilters } from "./game-history/hooks/useGameData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import GamesList from "./game-history/components/GameList";
import Timeframe from "./game-history/components/Timeframe";

export function GameHistoriesTable() {
    // Filter states - Default: all sources checked
    const [sources, setSources] = useState<string[]>(["chesscom", "vs_ai", "pgn_upload"]);
    const [result, setResult] = useState<string>("All Results");
    const [color, setColor] = useState<string>("All Colors");
    const [analyzedOnly, setAnalyzedOnly] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [isFilterDisabled, setIsFilterDisabled] = useState<boolean>(false);

    // Debounced states for filters (except sources - sources filter has no debounce)
    const [debouncedResult, setDebouncedResult] = useState<string>("All Results");
    const [debouncedColor, setDebouncedColor] = useState<string>("All Colors");
    const [debouncedAnalyzedOnly, setDebouncedAnalyzedOnly] = useState<boolean>(false);
    const [debouncedStartDate, setDebouncedStartDate] = useState<string>("");
    const [debouncedEndDate, setDebouncedEndDate] = useState<string>("");
    const [debouncedOpponent, setDebouncedOpponent] = useState<string>("");

    // Debounce filters with 500ms delay (sources filter excluded - no debounce)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedResult(result);
        }, 500);
        return () => clearTimeout(timer);
    }, [result]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedColor(color);
        }, 500);
        return () => clearTimeout(timer);
    }, [color]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedAnalyzedOnly(analyzedOnly);
        }, 500);
        return () => clearTimeout(timer);
    }, [analyzedOnly]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedStartDate(startDate);
        }, 500);
        return () => clearTimeout(timer);
    }, [startDate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedEndDate(endDate);
        }, 500);
        return () => clearTimeout(timer);
    }, [endDate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedOpponent(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Build filters object for API (sources uses immediate value, others use debounced)
    const apiFilters = useMemo<GameFilters>(() => {
        const filters: GameFilters = {};

        // Sources filter - NO debounce, use immediate value
        if (sources.length > 0) {
            filters.sources = sources;
        }

        if (debouncedResult !== "All Results") {
            const resultMap: Record<string, string> = {
                "Wins": "win",
                "Losses": "loss",
                "Draws": "draw",
            };
            filters.result = resultMap[debouncedResult];
        }

        if (debouncedColor !== "All Colors") {
            filters.color = debouncedColor.toLowerCase();
        }

        if (debouncedAnalyzedOnly) {
            filters.analyzedOnly = true;
        }

        if (debouncedStartDate) {
            filters.startDate = debouncedStartDate;
        }

        if (debouncedEndDate) {
            filters.endDate = debouncedEndDate;
        }

        if (debouncedOpponent && debouncedOpponent.trim() !== "") {
            filters.opponent = debouncedOpponent.trim();
        }

        console.log("📊 [GameHistoriesTable] Current sources state:", sources);
        console.log("📊 [GameHistoriesTable] API Filters being sent:", filters);

        return filters;
    }, [sources, debouncedResult, debouncedColor, debouncedAnalyzedOnly, debouncedStartDate, debouncedEndDate, debouncedOpponent]);

    const { games, isLoading, error, handleRetryFetch, handleForceRefresh } =
        useGames(apiFilters);

    const paginationProps = usePagination(games);

    // Add 1000ms delay after loading finishes before enabling filters
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

    // Handle source checkbox changes (no debounce - immediate request)
    const handleSourceToggle = (source: string) => {
        setSources(prev => {
            const newSources = prev.includes(source)
                ? prev.filter(s => s !== source)
                : [...prev, source];

            console.log("📊 [GameHistoriesTable] Sources updated:", prev, "->", newSources);
            return newSources;
        });
        // Request will be sent immediately due to useMemo dependency on sources
    };

    // Handle result filter change
    const handleResultChange = (value: string) => {
        setResult(value);

        // If currently loading, force refresh to cancel previous request and fetch with new filter
        if (isLoading) {
            setTimeout(() => {
                handleForceRefresh();
            }, 100);
        }
    };

    // Handle color filter change
    const handleColorChange = (value: string) => {
        setColor(value);

        // If currently loading, force refresh to cancel previous request and fetch with new filter
        if (isLoading) {
            setTimeout(() => {
                handleForceRefresh();
            }, 100);
        }
    };

    // Handle analyzed only filter change
    const handleAnalyzedOnlyChange = (checked: boolean) => {
        setAnalyzedOnly(checked);

        // If currently loading, force refresh to cancel previous request and fetch with new filter
        if (isLoading) {
            setTimeout(() => {
                handleForceRefresh();
            }, 100);
        }
    };

    // Handle date range change from Timeframe component
    const handleDateRangeChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);

        // If currently loading, force refresh to cancel previous request and fetch with new filter
        if (isLoading) {
            setTimeout(() => {
                handleForceRefresh();
            }, 100);
        }
    };

    return (
        <div className="lg:px-[16px] mb-[32px]">
            <div className="border border-[#dedede] bg-[#FAFDFF] lg:bg-whhite lg:rounded-[16px] pt-[16px] px-[16px]">
                <h3 className="text-[24px] font-bold leading-[140%] mb-[12px]">Your Games</h3>
                
                <div className="w-full relative flex items-center mb-[12px]">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-[12px]">
                        <path d="M14.25 14.25L10.9875 10.9875M12.75 6.75C12.75 10.0637 10.0637 12.75 6.75 12.75C3.43629 12.75 0.75 10.0637 0.75 6.75C0.75 3.43629 3.43629 0.75 6.75 0.75C10.0637 0.75 12.75 3.43629 12.75 6.75Z" stroke="#99A5A9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search Opponent"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-[34px] py-[8px] md:py-[12px] pr-[12px] border border-[#C0CED4] bg-[#F2FBFE] rounded-[8px]"
                    />
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-[8px] lg:gap-[32px] mb-[16px] md:mb-[32px]">
                    {/* Mobile */}
                    <div className="w-full lg:hidden">
                        <label htmlFor="timeframe" className="block font-semibold text-[16px] leading-[150%] mb-[4px]">Timeframe</label>
                        <Timeframe onDateChange={handleDateRangeChange} disabled={isFilterDisabled} />
                    </div>

                    <div className="w-full lg:w-1/3">
                        <label htmlFor="games" className="block font-semibold text-[16px] leading-[150%] lg:mb-[4px]">Games</label>
                        <div className="h-[32px] flex items-center justify-between lg:justify-start gap-[16px]">
                            <div className="flex items-center gap-[8px]">
                                <label htmlFor="games-chessdotcom" className={`relative flex items-center justify-center w-[16px] h-[16px] border border-[#C0CED4] bg-white rounded-[4px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} has-[.peer:checked]:bg-[#221AE9] has-[.peer:checked]:border-[#221AE9] has-[.peer:checked]:outline-[2px] has-[.peer:checked]:outline-[rgba(34,26,233,.16)] has-[.peer:checked]`}>
                                    <svg width="10" height="10" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.22426 0.175736C8.45858 0.410051 8.45858 0.78995 8.22426 1.02426L3.42426 5.82426C3.18995 6.05858 2.81005 6.05858 2.57574 5.82426L0.175736 3.42426C-0.0585787 3.18995 -0.0585787 2.81005 0.175736 2.57574C0.41005 2.34142 0.789949 2.34142 1.02426 2.57574L3 4.55147L7.37574 0.175736C7.61005 -0.0585787 7.98995 -0.0585787 8.22426 0.175736Z" fill="#FCFCFD"/>
                                    </svg>
                                    <input
                                        id="games-chessdotcom"
                                        type="checkbox"
                                        checked={sources.includes("chesscom")}
                                        onChange={() => handleSourceToggle("chesscom")}
                                        disabled={isFilterDisabled}
                                        className="peer hidden"
                                    />
                                </label>
                                <label htmlFor="games-chessdotcom" className={`w-[calc(100%-24px)] leading-[16px] text-[14px] mt-[2px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>Chess.com</label>
                            </div>

                            <div className="flex items-center gap-[8px]">
                                <label htmlFor="games-youvsai" className={`relative flex items-center justify-center w-[16px] h-[16px] border border-[#C0CED4] bg-white rounded-[4px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} has-[.peer:checked]:bg-[#221AE9] has-[.peer:checked]:border-[#221AE9] has-[.peer:checked]:outline-[2px] has-[.peer:checked]:outline-[rgba(34,26,233,.16)] has-[.peer:checked]`}>
                                    <svg width="10" height="10" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.22426 0.175736C8.45858 0.410051 8.45858 0.78995 8.22426 1.02426L3.42426 5.82426C3.18995 6.05858 2.81005 6.05858 2.57574 5.82426L0.175736 3.42426C-0.0585787 3.18995 -0.0585787 2.81005 0.175736 2.57574C0.41005 2.34142 0.789949 2.34142 1.02426 2.57574L3 4.55147L7.37574 0.175736C7.61005 -0.0585787 7.98995 -0.0585787 8.22426 0.175736Z" fill="#FCFCFD"/>
                                    </svg>
                                    <input
                                        id="games-youvsai"
                                        type="checkbox"
                                        checked={sources.includes("vs_ai")}
                                        onChange={() => handleSourceToggle("vs_ai")}
                                        disabled={isFilterDisabled}
                                        className="peer hidden"
                                    />
                                </label>
                                <label htmlFor="games-youvsai" className={`w-[calc(100%-24px)] leading-[16px] text-[14px] mt-[2px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>You vs AI</label>
                            </div>

                            <div className="flex items-center gap-[8px]">
                                <label htmlFor="games-pgnupload" className={`relative flex items-center justify-center w-[16px] h-[16px] border border-[#C0CED4] bg-white rounded-[4px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} has-[.peer:checked]:bg-[#221AE9] has-[.peer:checked]:border-[#221AE9] has-[.peer:checked]:outline-[2px] has-[.peer:checked]:outline-[rgba(34,26,233,.16)] has-[.peer:checked]`}>
                                    <svg width="10" height="10" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.22426 0.175736C8.45858 0.410051 8.45858 0.78995 8.22426 1.02426L3.42426 5.82426C3.18995 6.05858 2.81005 6.05858 2.57574 5.82426L0.175736 3.42426C-0.0585787 3.18995 -0.0585787 2.81005 0.175736 2.57574C0.41005 2.34142 0.789949 2.34142 1.02426 2.57574L3 4.55147L7.37574 0.175736C7.61005 -0.0585787 7.98995 -0.0585787 8.22426 0.175736Z" fill="#FCFCFD"/>
                                    </svg>
                                    <input
                                        id="games-pgnupload"
                                        type="checkbox"
                                        checked={sources.includes("pgn_upload")}
                                        onChange={() => handleSourceToggle("pgn_upload")}
                                        disabled={isFilterDisabled}
                                        className="peer hidden"
                                    />
                                </label>
                                <label htmlFor="games-pgnupload" className={`w-[calc(100%-24px)] leading-[16px] text-[14px] mt-[2px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>PGN Upload</label>
                            </div>
                        </div>
                    </div>

                    <div className="w-[calc(50%-8px)] lg:w-1/5">
                        <label htmlFor="game-results" className="block font-semibold text-[16px] leading-[150%] mb-[4px]">Game Results</label>
                        <div className="flex items-center gap-[32px]">
                            <Select
                                value={result}
                                onValueChange={handleResultChange}
                                defaultValue="All Results"
                                disabled={isFilterDisabled}
                            >
                                <SelectTrigger className="w-full h-[42px] md:h-[32px] bg-[#F8F9FC] border border-[#D8DCE0] rounded-[8px] text-[#717375]">
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
                    </div>

                    <div className="w-[calc(50%-8px)] lg:w-1/5">
                        <label htmlFor="analyzed-games" className="block font-semibold text-[16px] leading-[150%] mb-[4px]">Analyzed Games</label>
                        <div className="h-[42px] md:h-[32px] flex items-center gap-[32px]">
                            <div className="flex items-center gap-[8px]">
                                <label htmlFor="analyzed-games-only" className={`relative flex items-center justify-center w-[16px] h-[16px] border border-[#C0CED4] bg-white rounded-[4px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} has-[.peer:checked]:bg-[#221AE9] has-[.peer:checked]:border-[#221AE9] has-[.peer:checked]:outline-[2px] has-[.peer:checked]:outline-[rgba(34,26,233,.16)] has-[.peer:checked]`}>
                                    <svg width="10" height="10" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.22426 0.175736C8.45858 0.410051 8.45858 0.78995 8.22426 1.02426L3.42426 5.82426C3.18995 6.05858 2.81005 6.05858 2.57574 5.82426L0.175736 3.42426C-0.0585787 3.18995 -0.0585787 2.81005 0.175736 2.57574C0.41005 2.34142 0.789949 2.34142 1.02426 2.57574L3 4.55147L7.37574 0.175736C7.61005 -0.0585787 7.98995 -0.0585787 8.22426 0.175736Z" fill="#FCFCFD"/>
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
                                <label htmlFor="analyzed-games-only" className={`leading-[16px] text-[14px] mt-[2px] ${isFilterDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>Analyzed Games only</label>
                            </div>
                        </div>
                    </div>

                    {/* Desktop */}
                    <div className="w-1/5 hidden lg:flex flex-col">
                        <label htmlFor="timeframe" className="block font-semibold text-[16px] leading-[150%] mb-[4px]">Timeframe</label>
                        <Timeframe onDateChange={handleDateRangeChange} disabled={isFilterDisabled} />
                    </div>
                </div>

                <GamesList
                    games={games}
                    currentGames={paginationProps.currentData}
                    isLoading={isLoading}
                    error={error}
                    handleRetryFetch={handleRetryFetch}
                    paginationProps={paginationProps}
                />
            </div>
        </div>
    );
}