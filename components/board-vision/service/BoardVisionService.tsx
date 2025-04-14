import axios from "axios";
import { Chess } from "chess.js";
import { shuffle } from "../util/UtilFunctions";

export interface Position {
  fen: string;
  white: string;
  black: string;
  url: string;
  whiteProfilePic?: string;
  blackProfilePic?: string;
}

export interface PositionAnalysis {
  turn: string;
  legal_white: number;
  legal_black: number;
  checks_white: number;
  checks_black: number;
  threat_white: number;
  threat_black: number;
}

export const ChessService = {
  async getUserGames(
    username: string,
    year: number,
    month: number
  ): Promise<Position[]> {
    try {
      const formattedMonth = String(month).padStart(2, "0");
      const cleanUsername = username.replace(/\s/g, "").toLowerCase();

      const response = await axios.get(
        `https://api.chess.com/pub/player/${cleanUsername}/games/${year}/${formattedMonth}`
      );

      return this.processGames(response.data.games.slice(0, 50));
    } catch (error) {
      console.error("Error fetching chess.com games:", error);
      throw error;
    }
  },

  processGames(games: any[]): Position[] {
    const positions: Position[] = [];

    games.forEach((game) => {
      try {
        const loadedGame = new Chess();
        loadedGame.loadPgn(game.pgn);

        if (loadedGame.history().length < 10) {
          return;
        }

        const middlegame = Math.round(loadedGame.history().length / 2);
        for (let i = 0; i < middlegame; i++) {
          loadedGame.undo();
        }

        const whiteProfilePic = this.getProfilePicUrl(game.white);
        const blackProfilePic = this.getProfilePicUrl(game.black);

        const position = {
          fen: loadedGame.fen(),
          white: game.white.username,
          black: game.black.username,
          url: game.url,
          whiteProfilePic,
          blackProfilePic,
        };

        positions.push(position);
      } catch (error) {
        console.error("Error processing game:", error);
      }
    });

    return shuffle(positions);
  },

  getProfilePicUrl(player: any): string {
    // Try to get profile picture URL
    if (player && player.uuid) {
      return `https://images.chesscomfiles.com/uploads/v1/user/${player.uuid}.png`;
    } else if (player && player.username) {
      return `https://images.chesscomfiles.com/uploads/v1/user/${player.username}.png`;
    } else {
      // Default placeholder
      return "/api/placeholder/48/48";
    }
  },

  analyzePosition(fen: string): PositionAnalysis {
    try {
      const chess = new Chess(fen);
      const turn = chess.turn();

      const allMoves = chess.moves({ verbose: true });

      const legalWhite = turn === "w" ? allMoves.length : 0;
      const legalBlack = turn === "b" ? allMoves.length : 0;

      const checksWhite =
        turn === "w"
          ? allMoves.filter((move) => move.san.includes("+")).length
          : 0;
      const checksBlack =
        turn === "b"
          ? allMoves.filter((move) => move.san.includes("+")).length
          : 0;

      const threatWhite =
        turn === "w"
          ? allMoves.filter((move) => move.flags.includes("c")).length
          : 0;
      const threatBlack =
        turn === "b"
          ? allMoves.filter((move) => move.flags.includes("c")).length
          : 0;

      return {
        turn,
        legal_white: legalWhite,
        legal_black: legalBlack,
        checks_white: checksWhite,
        checks_black: checksBlack,
        threat_white: threatWhite,
        threat_black: threatBlack,
      };
    } catch (error) {
      console.error("Error analyzing position:", error);
      return {
        turn: "w",
        legal_white: 0,
        legal_black: 0,
        checks_white: 0,
        checks_black: 0,
        threat_white: 0,
        threat_black: 0,
      };
    }
  },
};
