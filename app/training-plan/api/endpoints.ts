import axios from "axios";
import { useProfileStore } from "@/app/store/profile";
import { refreshSession, shouldRefreshBeforeRequest } from "@/functions/refresh-token";
import CacheUtil, { CACHE_KEYS, getProgressCacheKey, getGameTypeCacheKey } from "./cacheUtils";

const BASE_URL = process.env.BASE_URL;

function getCurrentMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

export const endpoints = {
  trainingPlan: {
    getTopics: `${BASE_URL}/training-plan/topics`,
    getExistingTopics: `${BASE_URL}/training-plan/existing-topics`,
    createPlan: `${BASE_URL}/training-plan/create`,
    getTodaySchedule: `${BASE_URL}/v2/training-plan/today-schedule`,
    getProgress: (month?: string) =>
      `${BASE_URL}/training-plan/my-progress-training-plan${
        month ? `?month=${month}` : ""
      }`,
  },
};

/** Axios goes over XHR, so the global fetch wrapper can't help here: renew the
 *  token when it is stale and replay once on a 401, the same as everywhere else.
 *  `token` is the caller's captured value; the store's is preferred when set. */
const withFreshToken = async <T>(
  token: string,
  send: (token: string) => Promise<T>
): Promise<T> => {
  if (shouldRefreshBeforeRequest()) {
    await refreshSession();
  }

  try {
    return await send(useProfileStore.getState().sessionId || token);
  } catch (error: any) {
    if (error?.response?.status !== 401) throw error;

    const refreshed = await refreshSession();
    if (refreshed.status !== "refreshed") throw error;

    return send(refreshed.token);
  }
};

export const apiService = {
  get: async (url: string, token: string, params = {}) => {
    try {
      const response = await withFreshToken(token, (accessToken) =>
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params,
        })
      );
      return response.data;
    } catch (error: any) {
      if (url.includes("existing-topics")) {
        CacheUtil.clearItem(CACHE_KEYS.EXISTING_TRAINING_TOPICS);
      } else if (url.includes("topics")) {
        CacheUtil.clearItem(CACHE_KEYS.TRAINING_TOPICS);
        CacheUtil.clearItem(CACHE_KEYS.USER_PROFILE);
      } else if (url.includes("today-schedule")) {
        CacheUtil.clearItem(CACHE_KEYS.TRAINING_SCHEDULE);
      } else if (url.includes("progress")) {
        const monthMatch = url.match(/month=([^&]+)/);
        if (monthMatch) {
          const month = monthMatch[1];
          CacheUtil.clearItem(getProgressCacheKey(month));
        } else {
          const currentMonth = getCurrentMonth();
          CacheUtil.clearItem(getProgressCacheKey(currentMonth));
        }
      }

      if (error.response && error.response.data) {
        const apiError = new Error(error.response.data.message || "API Error");
        (apiError as any).response = error.response;
        throw apiError;
      }

      throw error;
    }
  },

  post: async (url: string, token: string, data = {}) => {
    try {
      const response = await withFreshToken(token, (accessToken) =>
        axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      if (url.includes("create")) {
        CacheUtil.clearAll();
      }

      return response.data;
    } catch (error: any) {
      console.error(`Error posting to ${url}:`, error);

      if (error.response && error.response.data) {
        const apiError = new Error(error.response.data.message || "API Error");
        (apiError as any).response = error.response;
        throw apiError;
      }

      throw error;
    }
  },
};