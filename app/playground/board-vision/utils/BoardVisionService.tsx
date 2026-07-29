import { Chess } from "chess.js";
import { shuffle } from "./UtilFunctions";

export interface Position {
  opponentName: string;
  fen: string;
  white: string;
  black: string;
  url: string;
  username?: string;
  whiteProfilePic?: string;
  blackProfilePic?: string;
  gameIndex?: number;
}

export interface QuizGame {
  pgn: string;
  username: string;
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

  pgnToFenList(pgn: string, includeStartPosition: boolean = true): string[] {
    const chess = new Chess();

    try {
      chess.loadPgn(pgn);
    } catch (error) {
      console.error("Error loading PGN:", error);
      return [];
    }

    const history = chess.history({ verbose: true });
    const fenList: string[] = [];

    chess.reset();

    if (includeStartPosition) {
      fenList.push(chess.fen());
    }

    for (const move of history) {
      chess.move(move);
      fenList.push(chess.fen());
    }

    return fenList;
  },

  async getUserGameFromPgn(
    pgn: string,
    username: string,
    gameIndex: number = 0,
    profileInfo?: {
      userProfilePic?: string;
      opponentProfilePic?: string;
      opponentName?: string;
      userCountry?: string;
      opponentCountry?: string;
    }
  ): Promise<Position[]> {
    try {
      const fenList = this.pgnToFenList(pgn, false);

      const filteredFens = fenList.filter((_, index) => {
        const moveNumber = index + 1;
        return moveNumber > 10 && moveNumber < fenList.length - 5;
      });

      if (filteredFens.length === 0) {
        return [];
      }

      const numberOfPositionsToUse = Math.min(3, filteredFens.length);
      const shuffledFens = shuffle([...filteredFens]);
      const selectedFens = shuffledFens.slice(0, numberOfPositionsToUse);

      const chess = new Chess();
      try {
        chess.loadPgn(pgn);
      } catch (error) {
        console.error("Error loading PGN in headers extraction:", error);
      }

      let white = "Player";
      let black = "Opponent";
      let url = "#";
      let whiteElo: string | undefined;
      let blackElo: string | undefined;

      try {
        const headers = chess.header();
        white = headers.White || username;
        black = headers.Black || profileInfo?.opponentName || "Opponent";
        url = headers.Site || "#";
        // Shown on the player rows next to each name.
        whiteElo = headers.WhiteElo || undefined;
        blackElo = headers.BlackElo || undefined;
      } catch (e) {
        console.error("Error extracting PGN headers:", e);
      }

      const whiteProfilePic =
        username.toLowerCase() === white.toLowerCase()
          ? profileInfo?.userProfilePic
          : profileInfo?.opponentProfilePic;

      const blackProfilePic =
        username.toLowerCase() === black.toLowerCase()
          ? profileInfo?.userProfilePic
          : profileInfo?.opponentProfilePic;

      const positions = selectedFens.map((fen) => ({
        opponentName: profileInfo?.opponentName || black,
        fen,
        white,
        black,
        whiteElo,
        blackElo,
        url,
        username,
        gameIndex,
        whiteProfilePic:
          whiteProfilePic || this.getProfilePicUrl({ username: white }),
        blackProfilePic:
          blackProfilePic || this.getProfilePicUrl({ username: black }),
      }));

      return positions;
    } catch (error) {
      console.error("Error processing PGN:", error);
      throw error;
    }
  },

  processMultipleGames(games: QuizGame[]): Promise<Position[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const allPositions: Position[] = [];
        const opponents = new Set<string>();

        for (let i = 0; i < games.length; i++) {
          const { pgn, username } = games[i];
          try {
            const chess = new Chess();
            try {
              chess.loadPgn(pgn);
            } catch (error) {
              console.error("Error loading PGN:", error);
              continue;
            }

            let opponent = "";
            try {
              const headers = chess.header();
              if (
                headers.White &&
                headers.White.toLowerCase() === username.toLowerCase()
              ) {
                opponent = headers.Black || "Opponent";
              } else {
                opponent = headers.White || "Opponent";
              }
              opponents.add(opponent);
            } catch (e) {
              console.error("Error extracting PGN headers:", e);
            }

            const positions = await this.getUserGameFromPgn(
              pgn,
              username,
              i
            );
            if (positions.length > 0) {
              const positionsWithOpponent = positions.map((pos) => ({
                ...pos,
                opponentName: opponent,
              }));
              allPositions.push(...positionsWithOpponent);
            }
          } catch (error) {
            console.error(`Error processing game ${i}:`, error);
          }
        }

        console.log(
          `Found ${opponents.size} unique opponents from ${games.length} games`
        );

        if (opponents.size >= 4 && allPositions.length >= 10) {
          const positionsByOpponent: { [key: string]: Position[] } = {};

          allPositions.forEach((pos) => {
            const opp = pos.opponentName || "unknown";
            if (!positionsByOpponent[opp]) {
              positionsByOpponent[opp] = [];
            }
            positionsByOpponent[opp].push(pos);
          });

          let selectedPositions: Position[] = [];

          const shuffledOpponents = shuffle(Array.from(opponents));

          shuffledOpponents.forEach((opp) => {
            if (positionsByOpponent[opp]) {
              const oppPositions = shuffle(positionsByOpponent[opp]);

              const positionsToTake = opponents.size <= 5 ? 2 : 1;
              const taken = oppPositions.slice(0, positionsToTake);

              selectedPositions.push(...taken);
            }
          });

          if (selectedPositions.length < 10) {
            const shuffledAllPositions = shuffle(allPositions);
            let i = 0;
            while (
              selectedPositions.length < 10 &&
              i < shuffledAllPositions.length
            ) {
              const isDuplicate = selectedPositions.some(
                (p) => p.fen === shuffledAllPositions[i].fen
              );

              if (!isDuplicate) {
                selectedPositions.push(shuffledAllPositions[i]);
              }
              i++;
            }
          }

          // Take only up to 10 positions
          selectedPositions = selectedPositions.slice(0, 10);

          // Shuffle final selection for randomness in quiz order
          resolve(shuffle(selectedPositions));
        } else {
          // Just use regular selection if we don't have enough variety
          const shuffledPositions = shuffle(allPositions);
          resolve(
            shuffledPositions.slice(0, Math.min(10, shuffledPositions.length))
          );
        }
      } catch (error) {
        console.error("Error processing multiple games:", error);
        reject(error);
      }
    });
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
          opponentName:
            game.black?.username || game.white?.username || "Opponent",
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

  getProfilePicUrl(player: any): string {
    if (player && player.uuid) {
      return `https://images.chesscomfiles.com/uploads/v1/user/${player.uuid}.png`;
    } else if (player && player.username) {
      return `https://images.chesscomfiles.com/uploads/v1/user/${player.username}.png`;
    } else {
      return "/board-vision/user.svg";
    }
  },

  analyzePosition(fen: string): PositionAnalysis {
    try {
      if (!this.isValidFen(fen)) {
        throw new Error(`Invalid FEN: ${fen}`);
      }

      const chess = new Chess(fen);
      const turn = chess.turn();

      let legal_white = 0;
      let legal_black = 0;
      let checks_white = 0;
      let checks_black = 0;
      let threat_white = 0;
      let threat_black = 0;

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

  analyzePositionComprehensive(fen: string): PositionAnalysis {
    try {
      if (!this.isValidFen(fen)) {
        throw new Error(`Invalid FEN: ${fen}`);
      }

      const chess = new Chess(fen);
      const turn = chess.turn();

      let legal_white = 0;
      let legal_black = 0;
      let checks_white = 0;
      let checks_black = 0;
      let threat_white = 0;
      let threat_black = 0;

      try {
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
      }

      try {
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
