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
    Accept: "application/json",
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
  const { clearAll } = useProfileStore.getState();
  clearAll();

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
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  } = {}
): Promise<T> => {
  const { method = "GET", sessionId, data, params, onUploadProgress } = options;

  try {
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      params,
      onUploadProgress,
    };

    if (sessionId != "") {
      config.headers = {
        Authorization: `Bearer ${sessionId}`,
        Accept: "application/json",
      };
    }

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
  } catch (error) {
    throw handleApiError(error);
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
    type: "chessdotcom" | "other" = "chessdotcom"
  ) => {
    return apiRequest<ApiResponse<any[]>>(
      `/games/my-game-history?type=${type}`,
      { sessionId }
    );
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
    formData: FormData,
    sessionId: string | null,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ) => {
    return apiRequest<ApiResponse<any>>("/games/import-game", {
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
  type: "all" | "chessdotcom" | "other" = "all"
): Promise<void> => {
  try {
    const store = usePgnStore.getState();

    store.resetFetchState();

    if (type === "all" || type === "chessdotcom") {
      const userGamesResponse = await gameHistoryApi.getUserGames(
        sessionId,
        "chessdotcom"
      );
      if (userGamesResponse && userGamesResponse.data) {
        store.setGamesData(userGamesResponse.data);
      }
    }

    if (type === "all" || type === "other") {
      const otherGamesResponse = await gameHistoryApi.getUserGames(
        sessionId,
        "other"
      );
      if (otherGamesResponse && otherGamesResponse.data) {
        store.setOtherGamesData(otherGamesResponse.data);
      }
    }

    toast.success("Game data refreshed successfully");
  } catch (error) {
    toast.error("Failed to refresh game data");
  }
};
