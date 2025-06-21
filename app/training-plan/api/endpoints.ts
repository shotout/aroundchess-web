import axios from "axios";
import CacheUtil, { CACHE_KEYS } from "./cacheUtils";

const BASE_URL = process.env.BASE_URL;

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

export const apiService = {
  get: async (url: string, token: string, params = {}) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      // Clear related cache on error
      if (url.includes("existing-topics")) {
        CacheUtil.clearItem(CACHE_KEYS.EXISTING_TRAINING_TOPICS);
      } else if (url.includes("topics")) {
        CacheUtil.clearItem(CACHE_KEYS.TRAINING_TOPICS);
        CacheUtil.clearItem(CACHE_KEYS.USER_PROFILE);
      } else if (url.includes("today-schedule")) {
        CacheUtil.clearItem(CACHE_KEYS.TRAINING_SCHEDULE);
      } else if (url.includes("progress")) {
        CacheUtil.clearItem(CACHE_KEYS.PROGRESS_DATA);
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
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
