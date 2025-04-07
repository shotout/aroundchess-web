import { Game } from "@/app/store/zustandStore";

export interface FilterState {
  timeRange: string;
  gameType: string;
  color: string;
  gameFormat: string;
  results: string;
}

export interface ApiResponse {
  data: any[];
  [key: string]: any;
}

export interface EloChangeResult {
  value: number;
  element: JSX.Element;
}

export interface DefaultFilters {
  timeRange: string;
  gameType: string;
  color: string;
  gameFormat: string;
  results: string;
}

export interface GamesTabCardProps {
  gameData: Game;
  onAnalyze: () => void;
}