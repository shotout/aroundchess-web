import axios from "axios";

const BASE_URL = process.env.BASE_URL;

const endpoints = {
  trainingPlan: {
    getTopics: `${BASE_URL}/training-plan/topics`,
    createPlan: `${BASE_URL}/training-plan/create`,
    getTodaySchedule: `${BASE_URL}/training-plan/today-schedule`,
    getProgress: (month?: string) => 
      `${BASE_URL}/training-plan/my-progress-training-plan${month ? `?month=${month}` : ''}`,
  },
  
  user: {
    getProfile: `${BASE_URL}/user/profile`,
    updateProfile: `${BASE_URL}/user/profile/update`,
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
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
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
      return response.data;
    } catch (error) {
      console.error(`Error posting to ${url}:`, error);
      throw error;
    }
  },
};

export default endpoints;