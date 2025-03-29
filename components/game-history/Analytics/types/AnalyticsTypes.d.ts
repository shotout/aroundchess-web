// API Data Types
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
  
  export interface PerformanceInsights {
    averageGameLength: number;
    accuracy: number;
    timeManagement: number;
    blunderRate: number;
  }
  
  export interface KeyStatistics {
    totalGames: number;
    winRate: number;
    averageRating: number;
    longestStreak: number;
  }
  
  // Raw API data structure
  export interface ApiData {
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
  
  // Processed data structure
  export interface ProcessedData {
    ratingData: RatingProgressItem[];
    distributionData: ResultDistributionItem[];
    openingData: OpeningStatistic[];
    performanceData: TimeControlPerformance[];
    performanceInsights: PerformanceInsights;
    keyStats: KeyStatistics;
    achievements: string[];
  }
  
  // Component Props
  export interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: RatingProgressItem }[];
  }
  
  export interface RatingProgressChartProps {
    ratingData: RatingProgressItem[];
    isCacheValid: boolean;
    handleForceRefresh: () => void;
  }
  
  export interface ResultDistributionChartProps {
    distributionData: ResultDistributionItem[];
  }
  
  export interface OpeningStatisticsProps {
    openingData: OpeningStatistic[];
  }
  
  export interface PerformanceInsightsSectionProps {
    insights: PerformanceInsights;
  }
  
  export interface KeyStatisticsSectionProps {
    stats: KeyStatistics;
  }
  
  export interface TimeControlPerformanceProps {
    performanceData: TimeControlPerformance[];
  }
  
  export interface AchievementIconProps {
    type: string;
  }
  
  export interface RecentAchievementsProps {
    achievements: string[];
  }
  
  export interface LoadingErrorProps {
    error: Error;
    handleForceRefresh: () => void;
  }
  
  // Store Types
  export interface PgnStore {
    username: string | null;
    analyticsData: ApiData | null;
    analyticsLastFetched: number | null;
    setAnalyticsData: (data: ApiData) => void;
  }
  
  // Achievement Details
  export interface AchievementDetails {
    icon: string;
    title: string;
    description: string;
  }