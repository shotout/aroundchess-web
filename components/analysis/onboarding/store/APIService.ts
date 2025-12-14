"use client";

const endpoint = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";

export interface GameTypeData {
  game_type: string;
  elo: number;
  label: string;
}

export interface PlayerStatsResponse {
  success: boolean;
  message: string;
  data: GameTypeData[];
  statusCode: number;
}

export const ChessApiService = {
  async checkPlayerStats(
    username: string,
    sessionId: string
  ): Promise<PlayerStatsResponse> {
    try {
      if (!username) {
        throw new Error("Username is required");
      }

      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await fetch(
        `${endpoint}/games/player-stats/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Player not found: ${response.status}`);
      }

      const responseText = await response.text();

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  },

  async setUsername(
    username: string,
    gameType: string,
    elo: number,
    sessionId: string
  ): Promise<any> {
    try {
      if (!username || !sessionId || !gameType || elo === undefined) {
        throw new Error("Username, gameType, elo, and session ID are required");
      }

      const response = await fetch(`${endpoint}/profile/set-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          username,
          gameType,
          latestElo: elo,
        }),
      });

      const responseText = await response.text();

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error(
          "Server returned an invalid response. Please check console for details."
        );
      }

      if (
        responseData.message &&
        responseData.message.toLowerCase().includes("already exists")
      ) {
        return {
          success: true,
          usernameAlreadyExists: true,
          message: responseData.message,
          username,
        };
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message || `Failed to set username: ${response.status}`
        );
      }

      return responseData;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          "Server returned an invalid response. Please try again later."
        );
      }
      throw error;
    }
  },

  async getProfile(sessionId: string): Promise<any> {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await fetch(`${endpoint}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get profile: ${response.status}`);
      }

      const responseText = await response.text();

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error("Invalid JSON response from server");
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  },

  async checkChessConnection(
    sessionId: string
  ): Promise<{ isConnected: boolean; username?: string; profile?: any }> {
    try {
      const profileData = await this.getProfile(sessionId);

      const username = profileData?.data?.username;

      if (username) {
        return {
          isConnected: true,
          username,
          profile: profileData,
        };
      }

      return { isConnected: false };
    } catch (error) {
      return { isConnected: false };
    }
  },

  async getTutorialStatus(
    type: "chesscom" | "no-chesscom",
    sessionId: string
  ): Promise<any> {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const tutorialType = type === "chesscom" ? "chesscom" : "no-chesscom";
      const url = `${endpoint}/v3/tutorial/${tutorialType}`;

      console.log("📤 [APIService] GET tutorial status:", {
        url,
        type: tutorialType,
        hasSessionId: !!sessionId,
      });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      });

      console.log("📥 [APIService] GET Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [APIService] GET Error response:", errorText);
        throw new Error(`Failed to get tutorial status: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log("📥 [APIService] GET Response body:", responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("❌ [APIService] Invalid JSON response:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      console.log("✅ [APIService] Tutorial status retrieved:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ [APIService] getTutorialStatus error:", error);
      throw error;
    }
  },

  async setTutorialStatus(
    type: "chesscom" | "no-chesscom",
    completed: boolean,
    sessionId: string
  ): Promise<any> {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const tutorialType = type === "chesscom" ? "chesscom" : "no-chesscom";
      const url = `${endpoint}/v3/tutorial/${tutorialType}`;
      const payload = { completed };

      console.log("📤 [APIService] POST tutorial status:", {
        url,
        payload,
        hasSessionId: !!sessionId,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 [APIService] Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [APIService] Error response:", errorText);
        throw new Error(`Failed to set tutorial status: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log("📥 [APIService] Response body:", responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("❌ [APIService] Invalid JSON response:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      console.log("✅ [APIService] Tutorial status saved successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ [APIService] setTutorialStatus error:", error);
      throw error;
    }
  },
};
