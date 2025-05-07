"use client";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useLoadingAPI } from "@/app/store/loadingApi";
import useLocalStorage from "@/hooks/useLocalStorage";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: RequestMethod;
  path: string;
  body?: any;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export function useApiClient() {
  const [token, setToken] = useLocalStorage<string>("token", "");
  const { setIsLoading, isLoading } = useLoadingAPI();
  const [error, setError] = useState<Error | null>(null);

  const apiRequest = useCallback(
    async <T = any>({
      method,
      path,
      body,
      params,
      headers = {},
    }: RequestOptions): Promise<T | null> => {
      try {
        if (token != "" && token != null) {
          setIsLoading(true);
          setError(null);
          let url = path;

          if (params && Object.keys(params).length > 0) {
            const query = new URLSearchParams(params as any).toString();
            url += `?${query}`;
          }

          console.log("url", url);
          console.log("method", method);
          console.log("token", token);
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
            console.log("errorData", errorData, response);
            if (errorData.statusCode != 401) {
              toast.error(errorData.message || "API request failed");
            }
            throw new Error(errorData.message || "API request failed");
          }

          const responseData = await response.json();
          if (method == "POST") {
            toast.success(responseData.message || "Request successful");
          }
          return responseData;
        } else {
          return null as T | null;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
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
  const getProfile = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/profile`,
        params,
      });
    },
    [apiRequest]
  );
  const getTokenBalance = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/tokens/balance`,
        params,
      });
    },
    [apiRequest]
  );
  const getTokenPackage = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/tokens/packages`,
        params,
      });
    },
    [apiRequest]
  );
  const getTokenUsageHistory = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/tokens/history`,
        params,
      });
    },
    [apiRequest]
  );
  const getTokenPurchaseHistory = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/tokens/purchase-history`,
        params,
      });
    },
    [apiRequest]
  );

  const postPurchaseToken = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/tokens/purchase`,
        body,
      });
    },
    [apiRequest]
  );
  const getActiveMembership = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/membership/active`,
        params,
      });
    },
    [apiRequest]
  );

  const getAllMembershipPackage = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/membership/packages`,
        params,
      });
    },
    [apiRequest]
  );
  const getMembershipHistory = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/membership/history`,
        params,
      });
    },
    [apiRequest]
  );
  const getCheckAnalysisAccess = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/membership/check-analysis-access`,
        params,
      });
    },
    [apiRequest]
  );
  const postPurchaseMembership = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/membership/purchase`,
        body,
      });
    },
    [apiRequest]
  );
  const getNewsCategories = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/news/categories`,
        params,
      });
    },
    [apiRequest]
  );

  const getNews = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/news/articles`,
        params,
      });
    },
    [apiRequest]
  );
  const getNewsById = useCallback(
    (params: any, id: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/news/articles/${id}`,
        params,
      });
    },
    [apiRequest]
  );
  const getNewsBySlug = useCallback(
    (params: any, slug: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/news/articles/slug/${slug}`,
        params,
      });
    },
    [apiRequest]
  );
  const getNewsSaved = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/news/articles/saved`,
        params,
      });
    },
    [apiRequest]
  );

  const getMostRead = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/news/articles/most-reads`,
        params,
      });
    },
    [apiRequest]
  );
  const toggleSaveNews = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/news/articles/toggle-save`,
        body,
      });
    },
    [apiRequest]
  );
  const getFAQ = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/faq`,
        params,
      });
    },
    [apiRequest]
  );

  const logOut = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/auth/logout`,
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
    getActiveMembership,
    getAllMembershipPackage,
    getMembershipHistory,
    postPurchaseMembership,
    getTokenBalance,
    getTokenPackage,
    getTokenPurchaseHistory,
    getTokenUsageHistory,
    postPurchaseToken,
    getCheckAnalysisAccess,
    getProfile,
    getNewsCategories,
    getNews,
    getNewsById,
    getNewsBySlug,
    getNewsSaved,
    getMostRead,
    toggleSaveNews,
    getFAQ,
    logOut,
  };
}
