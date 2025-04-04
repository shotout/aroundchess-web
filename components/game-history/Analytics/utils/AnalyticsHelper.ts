import { MONTHS, RESULT_COLORS, CACHE_EXPIRATION } from './Constant';
import { 
  ApiData, 
  ProcessedData, 
  AchievementDetails 
} from '../types/AnalyticsTypes';

export const processApiData = (apiData: ApiData): ProcessedData => {


 

  const processedRatingData = apiData.ratingProgress
    .slice(0, MONTHS.length)
    .map((rating, index) => ({
      month: MONTHS[index],
      rating: rating,
    }));

  const resultData = [
    {
      name: "Win",
      value: apiData.resultDistribution.win || 70,
      color: RESULT_COLORS.WIN,
    },
    {
      name: "Draw",
      value: apiData.resultDistribution.draw || 25,
      color: RESULT_COLORS.DRAW,
    },
    {
      name: "Loss",
      value: apiData.resultDistribution.lose || 5,
      color: RESULT_COLORS.LOSS,
    },
  ];

  const openingStats = apiData.openingStatistics.map(
    (opening) => ({
      name: opening.name,
      games: opening.games,
      winrate: `${opening.winRate}%`,
    })
  );

  const timeControlData = apiData.timeControlPerformance.map(
    (item) => ({
      category: item.type,
      games: item.games,
      winRate: item.winRate,
    })
  );

  const insights = {
    averageGameLength: apiData.performanceInsights.averageGameLength,
    accuracy: apiData.performanceInsights.accuracy,
    timeManagement: apiData.timeManagement.efficiency,
    blunderRate: apiData.blunderRate,
  };

  const stats = {
    totalGames: apiData.keyStatistics.totalGames,
    winRate: 65,
    averageRating: apiData.keyStatistics.averageRating,
    longestStreak: 8,
  };

  const achievementsData = apiData.recentAchievements || [];

  return {
    ratingData: processedRatingData,
    distributionData: resultData,
    openingData: openingStats,
    performanceData: timeControlData,
    performanceInsights: insights,
    keyStats: stats,
    achievements: achievementsData,
  };
};

export const getAchievementDetails = (achievement: string): AchievementDetails => {
  if (achievement.includes("Classical Win")) {
    return {
      icon: "trophy",
      title: "First Classical Win",
      description: "Won against 2,000+ rated player",
    };
  } else if (achievement.includes("consecutive wins")) {
    return {
      icon: "swords",
      title: "Winning Streak",
      description: achievement,
    };
  } else {
    return {
      icon: "timer",
      title: "Achievement",
      description: achievement,
    };
  }
};

export const isCacheValid = (
  lastFetched: number | null, 
  cachedData: ApiData | null
): boolean => {
  if (!lastFetched || !cachedData) return false;

  const now = Date.now();
  const cacheAge = now - lastFetched;
  return cacheAge < CACHE_EXPIRATION && Object.keys(cachedData).length > 0;
};