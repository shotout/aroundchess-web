"use client";

export const ChessApiService = {
 
  async setUsername(username: string, sessionId: string): Promise<any> {
    try {
      if (!username || !sessionId) {
        throw new Error("Username and session ID are required");
      }

      console.log("Making request to set username:", username);
      console.log("Using session ID (truncated):", `${sessionId.substring(0, 10)}...`);

      const response = await fetch("https://ac-api-dev.kemang.sg/api/profile/set-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionId}`
        },
        body: JSON.stringify({ username })
      });

      console.log("Response status:", response.status);
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        console.log("Response wasn't valid JSON:", responseText);
        throw new Error("Server returned an invalid response. Please check console for details.");
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message || `Failed to set username: ${response.status}`
        );
      }

      return responseData;
    } catch (error) {
      console.error("Chess API error:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Server returned an invalid response. Please try again later.");
      }
      throw error;
    }
  },

  async getProfile(sessionId: string): Promise<any> {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      console.log("Fetching profile with session ID (truncated):", `${sessionId.substring(0, 10)}...`);

      const response = await fetch("https://ac-api-dev.kemang.sg/api/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${sessionId}`
        }
      });

      console.log("Profile API response status:", response.status);
      
      if (!response.ok) {
        console.log("Error in profile API, status:", response.status);
        throw new Error(`Failed to get profile: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log("Profile data retrieved:", responseText.substring(0, 100) + "...");
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse profile response as JSON:", e);
        console.log("Raw response text:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      return responseData;
    } catch (error) {
      console.error("Chess API getProfile error:", error);
      throw error;
    }
  },

  /**
   * Check if user has a Chess.com account connected
   * @param sessionId The user's session ID
   * @returns Object containing connection status and username if connected
   */
  async checkChessConnection(sessionId: string): Promise<{isConnected: boolean, username?: string, profile?: any}> {
    try {
      const profileData = await this.getProfile(sessionId);
      
      // Check username in the appropriate location based on API response structure
      const username = profileData?.username || (profileData?.data && profileData.data.username);
      
      if (username) {
        return { 
          isConnected: true, 
          username,
          profile: profileData
        };
      }

      return { isConnected: false };
    } catch (error) {
      console.error("Chess connection check error:", error);
      return { isConnected: false };
    }
  }
};