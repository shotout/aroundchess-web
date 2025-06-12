import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Chess } from "chess.js";
import { ChessService } from "./BoardVisionService";
import { shuffle } from "./UtilFunctions";
import { defaultPositions } from "./DefaultPositionData";
import {
  HighlightedSquares,
  Position,
  GameQuestion,
  Arrow,
} from "../types/default-pgn";

interface GameState {
  positions: Position[];
  currentPositionIndex: number;
  currentPosition: Position | null;
  gameQuestion: GameQuestion | null;
  gameSelectedAnswer: number | null;
  gameShowFeedback: boolean;
  gameCorrects: number;
  gameQuestionNumber: number;
  highlightedSquares: HighlightedSquares;
  arrows: Arrow[] | any;
}

interface PersistedGameState {
  positions: Position[];
  currentPositionIndex: number;
  currentPosition: Position | null;
  gameCorrects: number;
  gameQuestionNumber: number;
}

interface BoardVisionState {
  username: string;
  currentYear: number;
  currentMonth: number;
  gameMaxQuestions: number;

  defaultGame: GameState;

  userGame: GameState;

  showThreats: boolean;

  isLoading: boolean;
  isChangingQuestion: boolean;
  loadingError: string | null;

  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;

  setUsername: (name: string) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  toggleShowThreats: () => void;
  resetState: () => void;

  loadDefaultPositions: () => void;
  handleDefaultGameSelectAnswer: (answer: number) => void;
  handleDefaultGameNextQuestion: () => void;
  getDefaultRandomQuestion: () => void;
  startDefaultGameAgain: () => void;

  loadUserPositions: (pgns: string[], username: string) => Promise<void>;
  handleUserGameSelectAnswer: (answer: number) => void;
  handleUserGameNextQuestion: () => void;
  getUserRandomQuestion: () => void;
  startUserGameAgain: () => void;

  generateGameQuestion: (position: Position, forUserGame?: boolean) => void;
}

const createInitialGameState = (): GameState => ({
  positions: [],
  currentPositionIndex: 0,
  currentPosition: null,
  gameQuestion: null,
  gameSelectedAnswer: null,
  gameShowFeedback: false,
  gameCorrects: 0,
  gameQuestionNumber: 1,
  highlightedSquares: {},
  arrows: [],
});

const isValidFEN = (fen: string): boolean => {
  try {
    const chess = new Chess();
    chess.load(fen);
    return true;
  } catch (e) {
    console.error(`Invalid FEN detected: ${fen}`, e);
    return false;
  }
};

export const useBoardVisionStore = create<BoardVisionState>()(
  persist(
    (set, get) => ({
      username: "",
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      gameMaxQuestions: 10,

      defaultGame: createInitialGameState(),

      userGame: createInitialGameState(),

      showThreats: false,

      isLoading: false,
      isChangingQuestion: false,
      loadingError: null,

      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),

      setUsername: (name) => set({ username: name }),
      setCurrentMonth: (month) => set({ currentMonth: month }),
      setCurrentYear: (year) => set({ currentYear: year }),

      toggleShowThreats: () => {
        set({ showThreats: !get().showThreats });
      },

      loadDefaultPositions: () => {
        const positions = defaultPositions();

        const validPositions = positions.filter((pos) => isValidFEN(pos.fen));

        if (validPositions.length === 0) {
          console.error("No valid positions found in default positions");
          set({
            loadingError:
              "No valid chess positions found. Please contact support.",
          });
          return;
        }

        const shuffledPositions = shuffle(validPositions).map((pos, idx) => ({
          ...pos,
          gameIndex: undefined,
        }));

        set({
          defaultGame: {
            ...createInitialGameState(),
            positions: shuffledPositions,
            currentPosition: shuffledPositions[0],
          },
        });

        get().generateGameQuestion(shuffledPositions[0], false);
      },

      handleDefaultGameSelectAnswer: (answer) => {
        const { defaultGame } = get();
        const isCorrect =
          defaultGame.gameQuestion &&
          answer === defaultGame.gameQuestion.correctAnswer;

        set({
          defaultGame: {
            ...defaultGame,
            gameSelectedAnswer: answer,
            gameShowFeedback: true,
            gameCorrects: isCorrect
              ? defaultGame.gameCorrects + 1
              : defaultGame.gameCorrects,
          },
          showThreats: true,
        });

        if (defaultGame.currentPosition && defaultGame.gameQuestion) {
          try {
            const chess = new Chess(defaultGame.currentPosition.fen);
            const allMoves = chess.moves({ verbose: true });
            const newHighlightedSquares: HighlightedSquares = {};
            const newArrows: Arrow[] = [];

            if (defaultGame.gameQuestion.text.includes("legal moves")) {
              allMoves.forEach((move) => {
                newHighlightedSquares[move.to] = {
                  background: "none",
                  borderRadius: "100px",
                  border: "3px solid #0000C8",
                };
                newArrows.push([move.from, move.to]);
              });
            } else if (defaultGame.gameQuestion.text.includes("check moves")) {
              const checkMoves = allMoves.filter((move) =>
                move.san.includes("+")
              );
              checkMoves.forEach((move) => {
                newHighlightedSquares[move.to] = {
                  background: "none",
                  border: "3px solid #FF0000",
                  borderRadius: "4px",
                };
                newArrows.push([move.from, move.to]);
              });
            } else if (
              defaultGame.gameQuestion.text.includes("capture moves")
            ) {
              const captureMoves = allMoves.filter((move) =>
                move.flags.includes("c")
              );
              captureMoves.forEach((move) => {
                newHighlightedSquares[move.to] = {
                  background: "none",
                  border: "3px solid #00CC00",
                  borderRadius: "4px",
                };
                newArrows.push([move.from, move.to]);
              });
            }

            set({
              defaultGame: {
                ...get().defaultGame,
                highlightedSquares: newHighlightedSquares,
                arrows: newArrows,
              },
            });
          } catch (error) {
            console.error("Error highlighting moves:", error);
          }
        }
      },

      handleDefaultGameNextQuestion: () => {
        const { defaultGame, gameMaxQuestions } = get();

        if (defaultGame.gameQuestionNumber >= gameMaxQuestions) {
          set({
            defaultGame: {
              ...defaultGame,
              gameQuestionNumber: defaultGame.gameQuestionNumber + 1,
            },
          });
        } else {
          const nextIndex =
            (defaultGame.currentPositionIndex + 1) %
            defaultGame.positions.length;
          const nextPosition = defaultGame.positions[nextIndex];

          set({
            defaultGame: {
              ...defaultGame,
              currentPositionIndex: nextIndex,
              currentPosition: nextPosition,
              gameQuestionNumber: defaultGame.gameQuestionNumber + 1,
              gameSelectedAnswer: null,
              gameShowFeedback: false,
              highlightedSquares: {},
              arrows: [],
            },
            showThreats: false,
          });

          get().generateGameQuestion(nextPosition, false);
        }
      },

      getDefaultRandomQuestion: () => {
        const { defaultGame } = get();
        if (defaultGame.positions.length === 0) return;

        set({ isChangingQuestion: true });

        const currentCorrects = defaultGame.gameCorrects;

        setTimeout(() => {
          const randomIndex = Math.floor(
            Math.random() * defaultGame.positions.length
          );
          const randomPosition = defaultGame.positions[randomIndex];

          set({
            defaultGame: {
              ...defaultGame,
              currentPositionIndex: randomIndex,
              currentPosition: randomPosition,
              gameSelectedAnswer: null,
              gameShowFeedback: false,
              gameQuestionNumber: defaultGame.gameQuestionNumber + 1,
              gameCorrects: Math.max(0, currentCorrects - 1),
              highlightedSquares: {},
              arrows: [],
            },
            showThreats: false,
            isChangingQuestion: false,
          });

          get().generateGameQuestion(randomPosition, false);
        }, 500);
      },

      startDefaultGameAgain: () => {
        const { defaultGame } = get();

        set({
          defaultGame: {
            ...defaultGame,
            gameQuestionNumber: 1,
            gameCorrects: 0,
            gameShowFeedback: false,
            gameSelectedAnswer: null,
            currentPositionIndex: 0,
            currentPosition: defaultGame.positions[0],
            positions: shuffle(defaultGame.positions),
            highlightedSquares: {},
            arrows: [],
          },
          showThreats: false,
        });

        get().generateGameQuestion(defaultGame.positions[0], false);
      },

      loadUserPositions: async (pgns, username) => {
        set({ isLoading: true, loadingError: null });

        try {
          const positions = await ChessService.processMultipleGames(
            pgns,
            username
          );

          const opponentCount = new Map<string, number>();
          positions.forEach((pos) => {
            const opponent = pos.opponentName || "unknown";
            opponentCount.set(opponent, (opponentCount.get(opponent) || 0) + 1);
          });

          console.log("Opponent distribution in selected positions:");
          opponentCount.forEach((count, opponent) => {
            console.log(`${opponent}: ${count} positions`);
          });

          if (positions.length === 0) {
            set({
              isLoading: false,
              loadingError: `No valid positions found in the provided games. Please try other games.`,
            });
            return;
          }

          set({
            username,
            userGame: {
              ...createInitialGameState(),
              positions: positions.map(({ gameIndex, ...rest }) => ({
                ...rest,
                gameIndex: undefined,
              })),
              currentPosition: { ...positions[0], gameIndex: undefined },
            },
            isLoading: false,
          });

          get().generateGameQuestion(
            { ...positions[0], gameIndex: undefined },
            true
          );
        } catch (error) {
          console.error("Error loading user positions:", error);
          set({
            isLoading: false,
            loadingError: `Failed to load the games. Please try again or select different games.`,
          });
        }
      },

      handleUserGameSelectAnswer: (answer) => {
        const { userGame } = get();
        const isCorrect =
          userGame.gameQuestion &&
          answer === userGame.gameQuestion.correctAnswer;

        set({
          userGame: {
            ...userGame,
            gameSelectedAnswer: answer,
            gameShowFeedback: true,
            gameCorrects: isCorrect
              ? userGame.gameCorrects + 1
              : userGame.gameCorrects,
          },
          showThreats: true,
        });

        if (userGame.currentPosition && userGame.gameQuestion) {
          try {
            const chess = new Chess(userGame.currentPosition.fen);
            const allMoves = chess.moves({ verbose: true });
            const newHighlightedSquares: HighlightedSquares = {};
            const newArrows: Arrow[] = [];

            if (userGame.gameQuestion.text.includes("legal moves")) {
              allMoves.forEach((move) => {
                newHighlightedSquares[move.to] = {
                  background: "none",
                  borderRadius: "100px",
                  border: "3px solid #1C16C2",
                };
                newArrows.push([move.from, move.to]);
              });
            } else if (userGame.gameQuestion.text.includes("check moves")) {
              const checkMoves = allMoves.filter((move) =>
                move.san.includes("+")
              );
              checkMoves.forEach((move) => {
                newHighlightedSquares[move.to] = {
                  background: "none",
                  border: "3px solid #FF0000",
                  borderRadius: "4px",
                };
                newArrows.push([move.from, move.to]);
              });
            } else if (userGame.gameQuestion.text.includes("capture moves")) {
              const captureMoves = allMoves.filter((move) =>
                move.flags.includes("c")
              );
              captureMoves.forEach((move) => {
                newHighlightedSquares[move.to] = {
                  background: "none",
                  border: "3px solid #00CC00",
                  borderRadius: "4px",
                };
                newArrows.push([move.from, move.to]);
              });
            }

            set({
              userGame: {
                ...get().userGame,
                highlightedSquares: newHighlightedSquares,
                arrows: newArrows,
              },
            });
          } catch (error) {
            console.error("Error highlighting moves:", error);
          }
        }
      },
      handleUserGameNextQuestion: () => {
        const { userGame, gameMaxQuestions } = get();

        if (userGame.gameQuestionNumber > gameMaxQuestions) {
          set({
            userGame: {
              ...userGame,
              gameQuestionNumber: userGame.gameQuestionNumber + 1,
            },
          });
        } else {
          const nextIndex =
            (userGame.currentPositionIndex + 1) % userGame.positions.length;
          const nextPosition = userGame.positions[nextIndex];

          set({
            userGame: {
              ...userGame,
              currentPositionIndex: nextIndex,
              currentPosition: nextPosition,
              gameQuestionNumber: userGame.gameQuestionNumber + 1,
              gameSelectedAnswer: null,
              gameShowFeedback: false,
              highlightedSquares: {},
              arrows: [],
            },
            showThreats: false,
          });

          get().generateGameQuestion(nextPosition, true);
        }
      },

      getUserRandomQuestion: () => {
        const { userGame } = get();
        if (userGame.positions.length === 0) return;

        set({ isChangingQuestion: true });

        const currentCorrects = userGame.gameCorrects;

        setTimeout(() => {
          const randomIndex = Math.floor(
            Math.random() * userGame.positions.length
          );
          const randomPosition = userGame.positions[randomIndex];

          set({
            userGame: {
              ...userGame,
              currentPositionIndex: randomIndex,
              currentPosition: randomPosition,
              gameSelectedAnswer: null,
              gameShowFeedback: false,
              gameQuestionNumber: userGame.gameQuestionNumber + 1,
              gameCorrects: Math.max(0, currentCorrects - 1),
              highlightedSquares: {},
              arrows: [],
            },
            showThreats: false,
            isChangingQuestion: false,
          });

          get().generateGameQuestion(randomPosition, true);
        }, 500);
      },

      startUserGameAgain: () => {
        const { userGame } = get();

        set({
          userGame: {
            ...userGame,
            gameQuestionNumber: 1,
            gameCorrects: 0,
            gameShowFeedback: false,
            gameSelectedAnswer: null,
            currentPositionIndex: 0,
            currentPosition: userGame.positions[0],
            positions: shuffle(userGame.positions),
            highlightedSquares: {},
            arrows: [],
          },
          showThreats: false,
        });

        get().generateGameQuestion(userGame.positions[0], true);
      },

      generateGameQuestion: (position, forUserGame = false) => {
        if (!position) return;

        try {
          if (!isValidFEN(position.fen)) {
            throw new Error(`Invalid FEN: ${position.fen}`);
          }

          const analysis = ChessService.analyzePosition(position.fen);

          const questionTypes = [
            {
              id: "legal_white",
              text: "How many legal moves does White have?",
            },
            {
              id: "legal_black",
              text: "How many legal moves does Black have?",
            },
            {
              id: "checks_white",
              text: "How many check moves does White have?",
            },
            {
              id: "checks_black",
              text: "How many check moves does Black have?",
            },
            {
              id: "threat_white",
              text: "How many capture moves does White have?",
            },
            {
              id: "threat_black",
              text: "How many capture moves does Black have?",
            },
          ];

          const availableQuestions = questionTypes.filter((q) =>
            q.id.includes(analysis.turn === "w" ? "white" : "black")
          );

          const questionType =
            availableQuestions[
              Math.floor(Math.random() * availableQuestions.length)
            ];

          let correctAnswer = 0;
          switch (questionType.id) {
            case "legal_white":
              correctAnswer = analysis.legal_white;
              break;
            case "legal_black":
              correctAnswer = analysis.legal_black;
              break;
            case "checks_white":
              correctAnswer = analysis.checks_white;
              break;
            case "checks_black":
              correctAnswer = analysis.checks_black;
              break;
            case "threat_white":
              correctAnswer = analysis.threat_white;
              break;
            case "threat_black":
              correctAnswer = analysis.threat_black;
              break;
          }

          const answers = [correctAnswer];
          while (answers.length < 4) {
            const randomAnswer = Math.max(
              0,
              correctAnswer + Math.floor(Math.random() * 13) - 6
            );
            if (!answers.includes(randomAnswer)) {
              answers.push(randomAnswer);
            }
          }

          const question: GameQuestion = {
            text: questionType.text,
            answers: shuffle(answers),
            correctAnswer,
          };

          if (forUserGame) {
            set({
              userGame: {
                ...get().userGame,
                gameQuestion: question,
              },
            });
          } else {
            set({
              defaultGame: {
                ...get().defaultGame,
                gameQuestion: question,
              },
            });
          }
        } catch (error) {
          console.error("Error generating question:", error);

          // Create a fallback question
          const fallbackQuestion: GameQuestion = {
            text: "How many legal moves are available?",
            answers: [0, 1, 2, 3],
            correctAnswer: 0,
          };

          // Update with fallback question
          if (forUserGame) {
            set({
              userGame: {
                ...get().userGame,
                gameQuestion: fallbackQuestion,
              },
            });
          } else {
            set({
              defaultGame: {
                ...get().defaultGame,
                gameQuestion: fallbackQuestion,
              },
            });
          }
        }
      },

      resetState: () => {
        set({
          username: "",
          defaultGame: createInitialGameState(),
          userGame: createInitialGameState(),
          isLoading: false,
          loadingError: null,
          showThreats: false,
        });
      },
    }),
    {
      name: "board-vision-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        username: state.username,
        userGame: {
          positions: state.userGame.positions,
          currentPositionIndex: state.userGame.currentPositionIndex,
          currentPosition: state.userGame.currentPosition,
          gameCorrects: state.userGame.gameCorrects,
          gameQuestionNumber: state.userGame.gameQuestionNumber,
        } as PersistedGameState,
        defaultGame: {
          positions: state.defaultGame.positions,
          currentPositionIndex: state.defaultGame.currentPositionIndex,
          currentPosition: state.defaultGame.currentPosition,
          gameCorrects: state.defaultGame.gameCorrects,
          gameQuestionNumber: state.defaultGame.gameQuestionNumber,
        } as PersistedGameState,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);

          if (
            state.userGame.currentPosition &&
            state.userGame.positions.length > 0
          ) {
            setTimeout(() => {
              state.generateGameQuestion(state.userGame.currentPosition!, true);
            }, 100);
          }

          if (
            state.defaultGame.currentPosition &&
            state.defaultGame.positions.length > 0
          ) {
            setTimeout(() => {
              state.generateGameQuestion(
                state.defaultGame.currentPosition!,
                false
              );
            }, 100);
          }
        }
      },
    }
  )
);
