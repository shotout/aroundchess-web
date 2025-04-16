import axios from "axios";
import { Chess } from "chess.js";
import { shuffle } from "./UtilFunctions";
import { User } from "lucide-react";

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
  isValidFen(fen: string): boolean {
    try {
      const chess = new Chess();
      chess.load(fen);
      return true;
    } catch (e) {
      console.error(`Invalid FEN detected: ${fen}`, e);
      return false;
    }
  },

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

      console.log(response.data);

      const positions = this.processGames(response.data.games.slice(0, 50));

      const validPositions = positions.filter((pos) =>
        this.isValidFen(pos.fen)
      );

      if (validPositions.length === 0) {
        throw new Error("No valid positions found in the fetched games");
      }

      return validPositions;
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

        const fen = loadedGame.fen();
        if (!this.isValidFen(fen)) {
          console.warn(`Skipping invalid FEN position: ${fen}`);
          return;
        }

        const whiteProfilePic = this.getProfilePicUrl(game.white);
        const blackProfilePic = this.getProfilePicUrl(game.black);

        const position = {
          fen,
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

  /**
   * Get profile picture URL for a player, Still not working
   */
  getProfilePicUrl(player: any): string {
    // Try to get profile picture URL
    if (player && player.uuid) {
      return `https://images.chesscomfiles.com/uploads/v1/user/${player.uuid}.png`;
    } else if (player && player.username) {
      return `https://images.chesscomfiles.com/uploads/v1/user/${player.username}.png`;
    } else {
      // Default placeholder
      return "/board-vision/user.svg";
    }
  },

  analyzePosition(fen: string): PositionAnalysis {
    try {
      // First validate the FEN
      if (!this.isValidFen(fen)) {
        throw new Error(`Invalid FEN: ${fen}`);
      }

      const chess = new Chess(fen);
      const turn = chess.turn();

      // For more accurate analysis, we need to check both sides' moves
      let legal_white = 0;
      let legal_black = 0;
      let checks_white = 0;
      let checks_black = 0;
      let threat_white = 0;
      let threat_black = 0;

      // Analyze current position
      const allMoves = chess.moves({ verbose: true });

      if (turn === "w") {
        legal_white = allMoves.length;
        checks_white = allMoves.filter((move) => move.san.includes("+")).length;
        threat_white = allMoves.filter((move) =>
          move.flags.includes("c")
        ).length;
      } else {
        legal_black = allMoves.length;
        checks_black = allMoves.filter((move) => move.san.includes("+")).length;
        threat_black = allMoves.filter((move) =>
          move.flags.includes("c")
        ).length;
      }

      return {
        turn,
        legal_white,
        legal_black,
        checks_white,
        checks_black,
        threat_white,
        threat_black,
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

  /**
   * Enhanced version of analyzePosition that checks moves for both sides
   * This is a more comprehensive analysis that can be used for more detailed questions
   */
  analyzePositionComprehensive(fen: string): PositionAnalysis {
    try {
      // Validate FEN first
      if (!this.isValidFen(fen)) {
        throw new Error(`Invalid FEN: ${fen}`);
      }

      const chess = new Chess(fen);
      const turn = chess.turn();

      // Analysis logic for both white and black
      let legal_white = 0;
      let legal_black = 0;
      let checks_white = 0;
      let checks_black = 0;
      let threat_white = 0;
      let threat_black = 0;

      // Analyze white moves
      try {
        // If it's black's turn, we need to temporarily change it to white to analyze white's moves
        const whiteTurnFen = fen.replace(/ b /, " w ");
        const whiteChess = new Chess(whiteTurnFen);
        const whiteMoves = whiteChess.moves({ verbose: true });

        legal_white = whiteMoves.length;
        checks_white = whiteMoves.filter((move) =>
          move.san.includes("+")
        ).length;
        threat_white = whiteMoves.filter((move) =>
          move.flags.includes("c")
        ).length;
      } catch (e) {
        console.error("Error analyzing white moves:", e);
        // Keep default values if analysis fails
      }

      // Analyze black moves
      try {
        // If it's white's turn, we need to temporarily change it to black to analyze black's moves
        const blackTurnFen = fen.replace(/ w /, " b ");
        const blackChess = new Chess(blackTurnFen);
        const blackMoves = blackChess.moves({ verbose: true });

        legal_black = blackMoves.length;
        checks_black = blackMoves.filter((move) =>
          move.san.includes("+")
        ).length;
        threat_black = blackMoves.filter((move) =>
          move.flags.includes("c")
        ).length;
      } catch (e) {
        console.error("Error analyzing black moves:", e);
        // Keep default values if analysis fails
      }

      return {
        turn,
        legal_white,
        legal_black,
        checks_white,
        checks_black,
        threat_white,
        threat_black,
      };
    } catch (error) {
      console.error("Error in analyzePositionComprehensive:", error);
      // Return default values to prevent application crash
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

export default ChessService;
