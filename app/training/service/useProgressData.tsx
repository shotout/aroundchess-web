import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const endpoint = process.env.BASE_URL;

export interface ProgressRatingData {
  week: number;
  rating: number;
}

export interface ProgressGameAnalysis {
  accuracy: number;
  score: number;
}

export interface ProgressRecentGame {
  date: string;
  opponent: string;
  result: string;
  opening: string;
  analysis: ProgressGameAnalysis;
  rating: number;
}

export interface ProgressPerformanceTrend {
  count?: number;
  rating?: number;
  change: number;
}

export interface ProgressData {
  currentLevel: {
    level: string;
    rating: number;
  };
  accuracy: {
    percentage: number;
    improvement: number;
  };
  ratingProgress: {
    data: ProgressRatingData[];
    currentMonth: string;
  };
  trainingDistribution: {
    openings: number;
    middlegame: number;
    endgame: number;
    tactics: number;
  };
  recentGames: ProgressRecentGame[];
  performanceTrends: {
    gamesWon: ProgressPerformanceTrend;
    eloRating: ProgressPerformanceTrend;
    mistakes: ProgressPerformanceTrend;
    blunders: ProgressPerformanceTrend;
  };
  winRate: number;
  avgAccuracy: number;
}

interface ProgressApiResponse {
  success: boolean;
  message: string;
  data: ProgressData;
  statusCode: number;
}

export function useProgressData(month?: string) {
  const { sessionId } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgressData = async (selectedMonth?: string) => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = `${endpoint}/training-plan/my-progress-training-plan${
        selectedMonth ? `?month=${selectedMonth}` : ""
      }`;

      const response = await axios.get<ProgressApiResponse>(url, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      setProgressData(response.data.data);
    } catch (err) {
      console.error("Error fetching progress data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch progress data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchProgressData(month);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, month]);

  return {
    progressData,
    isLoading,
    error,
    refetch: (selectedMonth?: string) => fetchProgressData(selectedMonth),
  };
}
