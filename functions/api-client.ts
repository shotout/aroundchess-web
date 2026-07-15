"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { useProfileStore } from "@/app/store/profile";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import { supabase } from "@/lib/supabase";
import { usePgnStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method: RequestMethod;
  path: string;
  body?: any;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
}

export function useApiClient() {
  const router = useRouter()
  const { setIsLoading, isLoading } = useLoadingAPI();
  const { sessionId } = useProfileStore();
  const [error, setError] = useState<Error | null>(null);
  const { clearAll } = useProfileStore();
  const { clearAll: clearPGN } = usePgnStore();
  const handleSignOut = async () => {
    clearAll();
    clearPGN();

    logOut({ sessionId })
      .then(() => {})
      .finally(() => {
        clearAll();
        localStorage.removeItem("sessionId");
        localStorage.removeItem("token");
        localStorage.removeItem("background-analysis-storage");
        localStorage.removeItem("training_schedule");
        localStorage.removeItem("training_topics");
        localStorage.removeItem("pgn-local-storage");
        setPersistedCookie("token", "", 0);
      });
      router.replace("/login")
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      throw error;
    }
  };
  const apiRequest = useCallback(
    async <T = any>({
      method,
      path,
      body,
      params,
      headers = {},
    }: RequestOptions): Promise<T | null> => {
      try {
        if (
          sessionId.length > 0 ||
          path.includes("faq") ||
          path.includes("contact") ||
          path.includes("news") ||
          path.includes("tokens/packages")
        ) {
          setIsLoading(true);
          setError(null);
          let url = path;

          if (params && Object.keys(params).length > 0) {
            const query = new URLSearchParams(params as any).toString();
            url += `?${query}`;
          }
          let mewUrl = url?.includes("?")
            ? url + "&t=" + Date.now()
            : url + "?t=" + Date.now();
          const response = await fetch(mewUrl, {
            method,
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${sessionId}`,
              ...headers,
              // Don't set Content-Type for FormData, let the browser set it with the boundary
              ...(!body || !(body instanceof FormData)
                ? { "Content-Type": "application/json" }
                : {}),
              // cache: "no-store",
            },
            body:
              method !== "GET"
                ? body instanceof FormData
                  ? body
                  : JSON.stringify(body)
                : undefined,
          });

          if (!response.ok) {
            const errorData = await response.json();

            // Handle 401 Unauthorized - Session expired
            if (errorData.statusCode === 401 || response.status === 401) {
              handleSignOut();
              throw new Error("Session expired");
            }

            // Handle other errors (except 404)
            if (errorData.statusCode != 404) {
              // console.log("errorData", url, errorData, response);
              throw new Error(errorData.message || "API request failed");
            }

            // OLD CODE - refresh token approach (commented out)
            // const originalRequest = errorData.config;
            // kalau 401 (unauthorized), coba refresh token
            // if (errorData.response?.status === 401 && !originalRequest._retry) {
            //   originalRequest._retry = true;
            //   const { data, error: refreshError } =
            //     await supabase.auth.refreshSession();
            //   console.log("refreshError", refreshError);
            //   if (refreshError) {
            //     console.error("Refresh token gagal:", refreshError.message);
            //     // bisa redirect ke login page
            //     handleSignOut();
            //     return Promise.reject(error);
            //   }
            //   const newAccessToken = data.session?.access_token;
            //   if (newAccessToken) {
            //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            //     return apiRequest(originalRequest); // ulangi request dengan token baru
            //   }
            // }
          }

          const responseData = await response.json();
          if (method == "POST") {
            // toast.success(responseData.message || "Request successful");
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
    [sessionId]
  );

  const getHistoryGames = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/games/my-game-history?type=other`,
    });
  }, [apiRequest]);

  const viewAnalysisResult = useCallback(
    (id: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/games/mark-analysis-viewed/${id}`,
      });
    },
    [apiRequest]
  );
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

  const updateProfileUsername = useCallback(
    (body: { username: string }) => {
      return apiRequest({
        method: "PATCH",
        path: `/api/profile/username`,
        body,
      });
    },
    [apiRequest]
  );

  const checkUsernameAvailability = useCallback(
    (username: string) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/profile/username/check`,
        params: { username },
      });
    },
    [apiRequest]
  );

  const uploadProfilePicture = useCallback(
    (formData: FormData) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/profile/picture`,
        body: formData,
      });
    },
    [apiRequest]
  );

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

  const getUsagePuzzle = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/playground/puzzle/check-puzzle-usage`,
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

  const getMistakePrevious = useCallback((params?: any) => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/mistake-logs/previous`,
      params,
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
  const postCancelMembership = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/membership/cancel`,
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

  const getLastAnalysis = useCallback(
    (params: any) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/v2/analyze/last-analysis`,
        params,
      });
    },
    [apiRequest]
  );
  const getAnalysisByPgnHash = useCallback(
    (pgnHash: string) => {
      return apiRequest({
        method: "GET",
        path: `${process.env.BASE_URL}/v2/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
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
  const contactUs = useCallback(
    (formData: FormData) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/contact-us`,
        body: formData,
      });
    },
    [apiRequest]
  );
  const GameHistoryOpenings = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/games/my-game-history-opening`,
    });
  }, [apiRequest]);
  const checkoutSessions = useCallback(
    (body: any) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/payments/checkout_sessions`,
        body,
      });
    },
    [apiRequest]
  );

  const getStreakStatus = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/v4/streaks/status`,
    });
  }, [apiRequest]);

  const recordStreakPlay = useCallback(() => {
    return apiRequest({
      method: "POST",
      path: `${process.env.BASE_URL}/v4/streaks/record-play`,
    });
  }, [apiRequest]);

  const postLeaderboardGameResult = useCallback(
    (body: { game_id: string; used_hint: boolean }) => {
      return apiRequest({
        method: "POST",
        path: `${process.env.BASE_URL}/v4/leaderboard/game-result`,
        body,
      });
    },
    [apiRequest]
  );

  const getLeaderboardData = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/v4/leaderboard`,
    });
  }, [apiRequest]);

  const getLeaderboardMe = useCallback(() => {
    return apiRequest({
      method: "GET",
      path: `${process.env.BASE_URL}/v4/leaderboard/me`,
    });
  }, [apiRequest]);

  return {
    isLoading,
    error,
    getHistoryGames,
    getHistoryOptions,
    viewAnalysisResult,
    getAnalyticGamePerformance,
    getAnalyticGameAnalytic,
    getAnalyticGameSummary,
    getPGNFromUsername,
    getAnalyticGame,
    setUsername,
    profile,
    updateProfileUsername,
    checkUsernameAvailability,
    uploadProfilePicture,
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
    getUsagePuzzle,
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
    postCancelMembership,
    getNewsCategories,
    getNews,
    getNewsById,
    getNewsBySlug,
    getNewsSaved,
    getMostRead,
    toggleSaveNews,
    getFAQ,
    getLastAnalysis,
    getAnalysisByPgnHash,
    logOut,
    contactUs,
    GameHistoryOpenings,
    checkoutSessions,
    getStreakStatus,
    recordStreakPlay,
    postLeaderboardGameResult,
    getLeaderboardData,
    getLeaderboardMe,
  };
}
