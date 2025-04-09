import axios, { AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./Constant";
import { processApiData } from "./AnalyticsHelper";
import { ApiData, ProcessedData } from "../types/AnalyticsTypes";

export const fetchAnalyticsData = async (
  username: string, 
  sessionId: string | null | undefined,
  setAnalyticsData: (data: ApiData) => void
): Promise<ProcessedData> => {
  try {
    const apiUrl = `${API_BASE_URL}/analytic-games/my-game-analytic-history`;
    
    const config: AxiosRequestConfig = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${sessionId}`
      },
    };

    const response = await axios.get(apiUrl, config);

    if (response.data && response.data.success) {
      const apiData: ApiData = response.data.data;
      
      setAnalyticsData(apiData);
      
      return processApiData(apiData);
    } else {
      throw new Error("Invalid data format received from server");
    }
  } catch (err) {
    throw err instanceof Error ? err : new Error("Failed to fetch analytics");
  }
};