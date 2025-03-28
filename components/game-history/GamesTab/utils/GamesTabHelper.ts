import { Game } from "@/app/store/zustandStore";
import { ApiResponse, EloChangeResult, FilterState } from "../types/GamesTabType";

export const API_BASE_URL = "https://ac-api.kemang.sg/api";
export const CACHE_EXPIRATION = 5 * 60 * 1000;
export const AnalysisUrl = process.env.BASE_URL! + "/analyze";

export function transformApiDataToComponentFormat(apiData: any[]): Game[] {
  if (!Array.isArray(apiData)) return [];
  
  return apiData.map((item) => {
    // Add console.log to debug opening information
    console.log('Opening data for game:', {
      eco: item.opening_eco,
      name: item.opening_name,
      fullItem: item
    });
    
    return {
      id: item.id,
      date: formatDate(item.date),
      timeControl: formatTimeControl(item.time_control),
      result: item.result,
      opponent: item.opponent,
      rating: item.rating,
      eloChange: item.elo_change,
      moves: item.moves,
      opening: item.opening_name || "Unknown Opening", // Ensure this exists
      source: item.source,
      color: item.color,
      gameFormat: item.game_format,
      pgn: item.pgn,
      resultColor: item.result_color || 'default',
      gameType: item.game_type || 'standard'
    };
  });
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    // If the dateString is already in ISO format (like "2020-07-26T00:00:00.000Z")
    // Extract just the date part (YYYY-MM-DD) and return it
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // Otherwise, parse it as a date and format
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return dateString; // Return original if invalid date
    }
    
    return `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
  } catch (e) {
    return dateString;
  }
}

export function isCacheValid(gamesLastFetched: number | null, cachedGames: Game[]): boolean {
  if (!gamesLastFetched || !cachedGames.length) return false;

  const now = Date.now();
  const cacheAge = now - gamesLastFetched;
  return cacheAge < CACHE_EXPIRATION && cachedGames.length > 0;
}

export function filterGames(gamesData: Game[], filters: FilterState): Game[] {
  if (!Array.isArray(gamesData)) return [];
  
  let filtered = [...gamesData];

  if (filters.color !== "All Colors") {
    filtered = filtered.filter((game) => game.color === filters.color);
  }

  if (filters.gameFormat !== "All Formats") {
    filtered = filtered.filter((game) => game.gameFormat === filters.gameFormat);
  }

  if (filters.results !== "All Results") {
    const resultMap: Record<string, string> = {
      Wins: "WIN",
      Losses: "LOSS",
      Draws: "DRAW",
    };
    filtered = filtered.filter(
      (game) => game.result === resultMap[filters.results as keyof typeof resultMap]
    );
  }

  return filtered;
}

export function getResultData(result: string | undefined | null): { text: string, className: string } {
  if (!result || typeof result !== 'string') {
    return { text: "UNKNOWN", className: "text-gray-500 font-semibold" };
  }
  
  if (result === "WIN") {
    return { text: "WIN", className: "text-game-green font-semibold" };
  } else if (result === "LOSS") {
    return { text: "LOSS", className: "text-game-red font-semibold" };
  } else {
    return { text: "DRAW", className: "text-gray-500 font-semibold" };
  }
}

export function getEloChangeData(change: string | undefined | null): { value: number, text: string, className: string } {
  if (!change || typeof change !== 'string') {
    return { value: 0, text: "0", className: "text-gray-500" };
  }
  
  const match = change.match(/\(([+-]\d+) ELO Rating\)/);
  const value = match ? parseInt(match[1]) : 0;

  if (value > 0) {
    return { value, text: `+${value}`, className: "text-green-500" };
  } else if (value < 0) {
    return { value, text: `${value}`, className: "text-red-500" };
  } else {
    return { value, text: "0", className: "text-gray-500" };
  }
}

export function countActiveFilters(filters: FilterState, defaultFilters: FilterState): number {
  let count = 0;
  if (filters.timeRange !== defaultFilters.timeRange) count++;
  if (filters.gameType !== defaultFilters.gameType) count++;
  if (filters.color !== defaultFilters.color) count++;
  if (filters.gameFormat !== defaultFilters.gameFormat) count++;
  if (filters.results !== defaultFilters.results) count++;

  return count;
}

export function formatTimeControl(timeControlStr: string) {
  if (!timeControlStr) return "0+0";
  
  const seconds = parseInt(timeControlStr);
  if (isNaN(seconds)) return timeControlStr;
  
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}+${remainingSeconds}`
      : `${minutes}+0`;
  }
  return `${seconds}+0`;
}