"use client";

export const ChessApiService = {
 
  async setUsername(username: string, sessionId: string): Promise<any> {
    try {
      if (!username || !sessionId) {
        throw new Error("Username and session ID are required");
      }

      console.log("Making request to set username:", username);
      console.log("Using session ID (truncated):", `${sessionId.substring(0, 10)}...`);


      const response = await fetch("https://ac-api.kemang.sg/api/profile/set-username", {
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


  async getGames(sessionId: string): Promise<any> {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      console.log("Fetching games with session ID (truncated):", `${sessionId.substring(0, 10)}...`);

      const response = await fetch("https://ac-api.kemang.sg/api/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${sessionId}`
        }
      });

      console.log("Games response status:", response.status);
      
      const responseText = await response.text();
      console.log("Raw games response (preview):", responseText.substring(0, 100) + "...");
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse games response as JSON:", e);
        throw new Error("Server returned an invalid response. Please check console for details.");
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message || `Failed to get games: ${response.status}`
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
  }
};