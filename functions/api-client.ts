// apiClient.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: RequestMethod;
  path: string;
  body?: any;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export function useApiClient() {
  const { sessionId } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const apiRequest = useCallback(
    async <T = any>({
      method,
      path,
      body,
      params,
      headers = {},
    }: RequestOptions): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        let url = path;
        const token = localStorage.getItem("token");

        if (params && Object.keys(params).length > 0) {
          const query = new URLSearchParams(params as any).toString();
          url += `?${query}`;
        }

        console.log("url", url);
        console.log("method", method);
        console.log("localStorage.getItem token", token);
        console.log("token", sessionId);
        console.log("body", body);

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...headers,
          },
          body: method !== "GET" ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || "API request failed");
          throw new Error(errorData.message || "API request failed");
        }

        const responseData = await response.json();
        if (method == "POST") {
          toast.success(responseData.message || "Request successful");
        }
        return responseData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  const getHistoryGames = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/games/my-game-history?type=other`,
    });
  }, [apiRequest]);

  const getHistoryOptions = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/games/get-data/newbiepisan`,
    });
  }, [apiRequest]);

  const getAnalyticGamePerformance = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/analytic-games/my-game-performance-history`,
    });
  }, [apiRequest]);

  const getAnalyticGameAnalytic = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/analytic-games/my-game-analytic-history`,
    });
  }, [apiRequest]);

  const getAnalyticGameSummary = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/analytic-games/summary`,
    });
  }, [apiRequest]);

  const getPGNFromUsername = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/chessdotcom/games/newbiepisan`,
    });
  }, [apiRequest]);

  const getAnalyticGame = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/analytic-games/newbiepisan`,
    });
  }, [apiRequest]);

  const setUsername = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/profile/set-username`,
        body,
      });
    },
    [apiRequest]
  );

  const profile = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/profile`,
    });
  }, [apiRequest]);

  const analyze = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/analyze`,
        body,
      });
    },
    [apiRequest]
  );

  const startGame = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/start`,
        body,
      });
    },
    [apiRequest]
  );

  const resignGame = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/resign`,
        body,
      });
    },
    [apiRequest]
  );

  const offerDraw = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/offer-draw`,
        body,
      });
    },
    [apiRequest]
  );

  const acceptDraw = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/accept-draw`,
        body,
      });
    },
    [apiRequest]
  );

  const rejectDraw = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/reject-draw`,
        body,
      });
    },
    [apiRequest]
  );

  const makeMove = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/move`,
        body,
      });
    },
    [apiRequest]
  );

  const getMyGames = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/games/my-games`,
    });
  }, [apiRequest]);

  const getGameById = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/get-game`,
        body,
      });
    },
    [apiRequest]
  );

  const getGamePGN = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/get-pgn`,
        body,
      });
    },
    [apiRequest]
  );

  const rematch = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/rematch`,
        body,
      });
    },
    [apiRequest]
  );

  const uploadPGN = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/upload-pgn`,
        body,
      });
    },
    [apiRequest]
  );

  const getPuzzle = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/playground/puzzles`,
    });
  }, [apiRequest]);
  const postPuzzle = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/playground/puzzles`,
        body,
      });
    },
    [apiRequest]
  );
  const getVSAILogs = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        params,
        path: `${process.env.BASE_URL}/playground/vs-ai-logs`,
      });
    },
    [apiRequest]
  );

  const postVSAILogs = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/playground/vs-ai-logs?page=1&limit=1`,
        body,
      });
    },
    [apiRequest]
  );

  const getMistakePrevious = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/mistake-logs/previous`,
    });
  }, [apiRequest]);
  const getMistakePreviousDetail = useCallback(
    (id: string, params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/mistake-logs/previous/${id}`,
        params,
      });
    },
    [apiRequest]
  );
  const getMistakeSaved = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/mistake-logs/saved`,
        params,
      });
    },
    [apiRequest]
  );

  const saveMistakeLog = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/mistake-logs/save`,
        body,
      });
    },
    [apiRequest]
  );
  const unsaveMistakeLog = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/mistake-logs/unsave`,
        body,
      });
    },
    [apiRequest]
  );
  return {
    isLoading,
    error,
    getHistoryGames,
    getHistoryOptions,
    getAnalyticGamePerformance,
    getAnalyticGameAnalytic,
    getAnalyticGameSummary,
    getPGNFromUsername,
    getAnalyticGame,
    setUsername,
    profile,
    analyze,
    startGame,
    resignGame,
    offerDraw,
    acceptDraw,
    rejectDraw,
    makeMove,
    getMyGames,
    getGameById,
    getGamePGN,
    rematch,
    uploadPGN,
    getPuzzle,
    postPuzzle,
    getVSAILogs,
    postVSAILogs,
    getMistakePrevious,
    getMistakeSaved,
    saveMistakeLog,
    unsaveMistakeLog,
    getMistakePreviousDetail,
  };
}
