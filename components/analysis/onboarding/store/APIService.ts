"use client";

const endpoint = process.env.BASE_URL;

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
};
