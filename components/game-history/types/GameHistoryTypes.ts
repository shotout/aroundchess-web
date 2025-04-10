// Common Game Types
export interface Game {
  playerColor: any;
  id: number | string;
  date: string;
  opponent: string;
  result: string;
  resultColor: string;
  eloChange: string;
  rating: string;
  opening: string;
  moves: string;
  timeControl: string;
  source: string;
  gameType: string;
  color: string;
  gameFormat: string;
  pgn: string;
}

// Filter Types
export interface FilterState {
  timeRange: string;
  gameType: string;
  color: string;
  gameFormat: string;
  results: string;
}

export interface DefaultFilters {
  timeRange: string;
  gameType: string;
  color: string;
  gameFormat: string;
  results: string;
}

// Statistics Types
export interface GameStatistics {
  bestWin: {
    opponent: string;
    rating: number;
    date: string;
  };
  winRate: {
    percentage: number;
    monthlyChange: number;
  };
  averageEloRating: {
    rating: number;
    monthlyChange: number;
  };
  totalGames: {
    count: number;
    monthlyChange: number;
  };
}

// Performance Types
export interface BarDataItem {
  name: string;
  performance: number;
  average: number;
}

export interface RadarDataItem {
  subject: string;
  A: number;
  fullMark: number;
}

export interface StrengthItem {
  name: string;
  value: number;
  iconType: string;
}

export interface WeaknessItem {
  name: string;
  value: number;
}

export interface PerformanceData {
  barData?: BarDataItem[];
  radarData?: RadarDataItem[];
  strengthsData?: StrengthItem[];
  weaknessesData?: WeaknessItem[];
  shortTermGoals?: string[];
  trainingFocus?: string[];
}

// Analytics Types
export interface RatingProgressItem {
  month: string;
  rating: number;
}

export interface ResultDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface OpeningStatistic {
  name: string;
  games: number;
  winrate: string;
}

export interface TimeControlPerformance {
  category: string;
  games: number;
  winRate: number;
}

export interface AnalyticsData {
  ratingProgress: number[];
  resultDistribution: {
    win: number;
    draw: number;
    lose: number;
  };
  openingStatistics: {
    name: string;
    games: number;
    winRate: number;
  }[];
  timeControlPerformance: {
    type: string;
    games: number;
    winRate: number;
  }[];
  performanceInsights: {
    averageGameLength: number;
    accuracy: number;
  };
  timeManagement: {
    efficiency: number;
  };
  blunderRate: number;
  keyStatistics: {
    totalGames: number;
    averageRating: number;
  };
  recentAchievements: string[];
}

export interface ProcessedAnalyticsData {
  ratingData: RatingProgressItem[];
  distributionData: ResultDistributionItem[];
  openingData: OpeningStatistic[];
  performanceData: TimeControlPerformance[];
  performanceInsights: {
    averageGameLength: number;
    accuracy: number;
    timeManagement: number;
    blunderRate: number;
  };
  keyStats: {
    totalGames: number;
    winRate: number;
    averageRating: number;
    longestStreak: number;
  };
  achievements: string[];
}

// Cache Utilities
export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export interface CachedGamesState {
  username: string | null;
  gamesData: Game[] | null;
  otherGamesData: Game[] | null;
  performanceData: PerformanceData | null;
  analyticsData: AnalyticsData | null;
  gamesLastFetched: number | null;
  otherGamesLastFetched: number | null;
  performanceLastFetched: number | null;
  analyticsLastFetched: number | null;
  lastFetchTimestamp: number | null;
  isLoading: boolean;
  dataAnalysis: any | null;
  pgn: string | null;
}