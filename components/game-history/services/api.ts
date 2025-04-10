import { usePgnStore } from '@/app/store/zustandStore';
import axios, { AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import { toast } from 'sonner';

// Environment variables - Use BASE_URL consistently for all endpoints
const API_BASE_URL = process.env.BASE_URL || '';

console.log("API Configuration:", { 
  API_BASE_URL
});

// Define API response interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Handles API errors consistently
 */
export const handleApiError = (error: unknown): Error => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'API request failed';
    return new Error(message);
  }
  
  return error instanceof Error ? error : new Error('An unknown error occurred');
};

/**
 * Generic API request function with authentication
 */
export const apiRequest = async <T>(
  endpoint: string, 
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    sessionId?: string | null;
    data?: any;
    params?: Record<string, string | number | boolean>;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  } = {}
): Promise<T> => {
  const { 
    method = 'GET', 
    sessionId, 
    data,
    params,
    onUploadProgress
  } = options;

  try {
    console.log(`Making ${method} request to: ${endpoint}`);
    console.log("With options:", { hasSessionId: !!sessionId, hasData: !!data, params });
    
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      params,
      onUploadProgress
    };

    // Add auth header if sessionId is provided
    if (sessionId) {
      config.headers = {
        Authorization: `Bearer ${sessionId}`,
        Accept: 'application/json'
      };
    }

    // Add data if provided
    if (data) {
      config.data = data;
    }

    console.log("Final request config:", {
      ...config,
      headers: config.headers ? "Headers set" : "No headers",
    });

    const response = await apiClient(config);
    console.log("API response status:", response.status);
    
    // Check for success field in response
    if (response.data && typeof response.data.success === 'boolean' && !response.data.success) {
      throw new Error(response.data.message || 'API request failed');
    }

    return response.data;
  } catch (error) {
    console.error("API request failed", error);
    throw handleApiError(error);
  }
};

// Game History API endpoints
export const gameHistoryApi = {
  /**
   * Fetch user profile data
   */
  getProfile: async (sessionId: string | null) => {
    console.log("Fetching profile with sessionId:", !!sessionId);
    return apiRequest<{ username?: string; data?: { username?: string } }>(
      '/profile',
      { sessionId }
    );
  },

  /**
   * Fetch game history summary statistics
   */
  getGameSummary: async (sessionId: string | null) => {
    console.log("Fetching game summary with sessionId:", !!sessionId);
    return apiRequest<ApiResponse<any>>(
      '/analytic-games/summary',
      { sessionId }
    );
  },

  /**
   * Fetch user games history
   */
  getUserGames: async (sessionId: string | null, type: 'chessdotcom' | 'other' = 'chessdotcom') => {
    console.log("Fetching user games with sessionId:", !!sessionId, "type:", type);
    return apiRequest<ApiResponse<any[]>>(
      `/games/my-game-history?type=${type}`,
      { sessionId }
    );
  },

  /**
   * Fetch performance data
   */
  getPerformanceData: async (sessionId: string | null) => {
    console.log("Fetching performance data with sessionId:", !!sessionId);
    return apiRequest<ApiResponse<any>>(
      '/analytic-games/my-game-performance-history',
      { sessionId }
    );
  },

  /**
   * Fetch analytics data
   */
  getAnalyticsData: async (sessionId: string | null) => {
    console.log("Fetching analytics data with sessionId:", !!sessionId);
    return apiRequest<ApiResponse<any>>(
      '/analytic-games/my-game-analytic-history',
      { sessionId }
    );
  },

  /**
   * Import game
   */
  importGame: async (formData: FormData, sessionId: string | null, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    console.log("Importing game with sessionId:", !!sessionId);
    return apiRequest<ApiResponse<any>>(
      '/games/import-game',
      { 
        method: 'POST',
        sessionId, 
        data: formData,
        onUploadProgress
      }
    );
  },

  /**
   * Analyze game
   */
  analyzeGame: async (pgn: string, username: string | undefined, depth: number, timeout: number) => {
    console.log("Analyzing game for user:", username);
    
    try {
      const response = await apiClient.post('/analyze', {
        pgn,
        username,
        depth,
        timeout
      });
      
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  
};

export const refetchGameData = async (
  sessionId: string | null, 
  type: 'all' | 'chessdotcom' | 'other' = 'all'
): Promise<void> => {
  console.log(`Refetching game data, type: ${type}`);
  
  try {
    const store = usePgnStore.getState();
    
    // Trigger loading state
    store.resetFetchState();
    
    // Refetch user games (Chess.com)
    if (type === 'all' || type === 'chessdotcom') {
      console.log("Refetching Chess.com games");
      const userGamesResponse = await gameHistoryApi.getUserGames(sessionId, 'chessdotcom');
      if (userGamesResponse && userGamesResponse.data) {
        store.setGamesData(userGamesResponse.data);
      }
    }
    
    // Refetch other games
    if (type === 'all' || type === 'other') {
      console.log("Refetching other games");
      const otherGamesResponse = await gameHistoryApi.getUserGames(sessionId, 'other');
      if (otherGamesResponse && otherGamesResponse.data) {
        store.setOtherGamesData(otherGamesResponse.data);
      }
    }
    
    toast.success("Game data refreshed successfully");
  } catch (error) {
    console.error("Error refetching game data:", error);
    toast.error("Failed to refresh game data");
  }
};

