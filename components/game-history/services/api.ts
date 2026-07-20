import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import axios, { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.BASE_URL || "";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || "API request failed";

    if (error.response?.status === 401) {
      handleSessionExpiration();
    }

    return new Error(message);
  }

  return error instanceof Error
    ? error
    : new Error("An unknown error occurred");
};

const handleSessionExpiration = () => {
  const { clearAll: clearProfile } = useProfileStore.getState();
  clearProfile();

  const { clearAll: clearPgn } = usePgnStore.getState();
  clearPgn();

  localStorage.removeItem("token");
  setPersistedCookie("token", "", 0);

  toast.error("Your session has expired. Please log in again.");
  window.location.href = "/login";
};

export const apiRequest = async <T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    sessionId?: string | null;
    data?: any;
    params?: Record<string, string | number | boolean>;
    onUploadProgress?: (e: AxiosProgressEvent) => void;
  } = {}
): Promise<T> => {
  const { method = "GET", sessionId, data, params, onUploadProgress } =
    options;

  try {
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      params,
      onUploadProgress,
      headers: {
        ...(sessionId
          ? { Authorization: `Bearer ${sessionId}`, Accept: "application/json" }
          : {}),
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await apiClient(config);
    if (
      response.data &&
      typeof response.data.success === "boolean" &&
      !response.data.success
    ) {
      throw new Error(response.data.message || "API request failed");
    }

    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const gameHistoryApi = {
  getProfile: async (sessionId: string | null) => {
    return apiRequest<{
      success: string | undefined;
      username?: string;
      data?: { username?: string };
    }>("/profile", { sessionId });
  },

  getGameSummary: async (sessionId: string | null) => {
    return apiRequest<ApiResponse<any>>("/analytic-games/summary", {
      sessionId,
    });
  },

  getUserGames: async (
    sessionId: string | null,
    filters?: {
      sources?: string[];
      result?: string;
      color?: string;
      analyzedOnly?: boolean;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
      opponent?: string;
    }
  ) => {
    const params: Record<string, string | number | boolean> = {};

    if (filters?.sources && filters.sources.length > 0) {
      params.sources = filters.sources.join(',');
    }
    if (filters?.result) {
      params.result = filters.result;
    }
    if (filters?.color) {
      params.color = filters.color;
    }
    if (filters?.analyzedOnly !== undefined) {
      params.analyzedOnly = filters.analyzedOnly;
    }
    if (filters?.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters?.endDate) {
      params.endDate = filters.endDate;
    }
    if (filters?.page) {
      params.page = filters.page;
    }
    if (filters?.limit) {
      params.limit = filters.limit;
    }
    if (filters?.opponent) {
      params.opponent = filters.opponent;
    }

    console.log("📤 [API] getUserGames called with filters:", filters);
    console.log("📤 [API] URL params being sent:", params);
    console.log("📤 [API] Sources array:", filters?.sources);
    console.log("📤 [API] Sources joined:", params.sources);

    return apiRequest<ApiResponse<any[]>>(
      `/v3/games/my-game-history`,
      { sessionId, params }
    );
  },

  getChessComGames: async (sessionId: string | null) => {
    const params: Record<string, string | number | boolean> = {
      sources: 'chesscom'
    };

    console.log("📤 [API] getChessComGames called");
    console.log("📤 [API] URL params being sent:", params);

    return apiRequest<ApiResponse<any[]>>(
      `/games/my-game-history`,
      { sessionId, params }
    );
  },

  getLeaderboardMe: async (sessionId: string | null) => {
    return apiRequest<ApiResponse<{
      can_join: boolean;
      is_inactive: boolean;
      games_remaining: number;
      ac_games_played: number;
      elo: number;
      rank: number | null;
      rank_change: number | null;
      chess_com_elo_transferred: boolean;
    }>>("/v4/leaderboard/me", { sessionId });
  },

  getOpponentsPlayed: async (
    sessionId: string | null,
    page = 1,
    limit = 20
  ) => {
    return apiRequest<
      ApiResponse<
        {
          opponentUsername: string;
          opponentElo: number | null;
          opponentAvatar: string | null;
          totalGames: number;
          wins: number;
          draws: number;
          losses: number;
        }[]
      > & {
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }
    >("/v3/games/opponents-played", {
      sessionId,
      params: { sources: "vs_ai", page, limit },
    });
  },

  getPerformanceData: async (sessionId: string | null) => {
    return apiRequest<ApiResponse<any>>(
      "/analytic-games/my-game-performance-history",
      { sessionId }
    );
  },

  getAnalyticsData: async (sessionId: string | null) => {
    return apiRequest<ApiResponse<any>>(
      "/analytic-games/my-game-analytic-history",
      { sessionId }
    );
  },

  importGame: async (
    mode:string,
    formData: FormData,
    sessionId: string | null,
    onUploadProgress?: (e: AxiosProgressEvent) => void
  ) => {
    return apiRequest<ApiResponse<any>>("/games/import-game?mode="+mode, {
      method: "POST",
      sessionId,
      data: formData,
      onUploadProgress,
    });
  },

  analyzeGame: async (
    pgn: string,
    username: string | undefined,
    depth: number,
    timeout: number
  ) => {
    try {
      const response = await apiClient.post("/analyze", {
        pgn,
        username,
        depth,
        timeout,
      });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const refetchGameData = async (
  sessionId: string | null,
  filters?: {
    sources?: string[];
    result?: string;
    color?: string;
    analyzedOnly?: boolean;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    opponent?: string;
  }
): Promise<void> => {
  try {
    const store = usePgnStore.getState();
    store.resetFetchState();

    const u = await gameHistoryApi.getUserGames(sessionId, filters);
    if (u?.data) store.setGamesData(u.data);

    toast.success("Game data refreshed successfully");
  } catch {
    toast.error("Failed to refresh game data");
  }
};