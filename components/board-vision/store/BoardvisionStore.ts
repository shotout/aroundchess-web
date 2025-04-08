import { create } from 'zustand';
import { Chess } from 'chess.js';
import { QuestionData, questionsData } from '../util/BoardVisionData';

interface HighlightedSquare {
  background: string;
  border?: string;
  borderRadius?: string;
}

export interface HighlightedSquares {
  [square: string]: HighlightedSquare;
}

export type Arrow = [string, string];
export type AppState = "welcome" | "default" | "player-game";

interface BoardVisionState {
  appState: AppState;
  username: string;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  highlightedSquares: HighlightedSquares;
  arrows: Arrow[];
  questions: QuestionData[];
  
  // Actions
  setAppState: (state: AppState) => void;
  setUsername: (name: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setSelectedAnswer: (answer: number | null) => void;
  setShowFeedback: (show: boolean) => void;
  setHighlightedSquares: (squares: HighlightedSquares) => void;
  setArrows: (arrows: Arrow[]) => void;
  handleSelectAnswer: (answer: number) => void;
  handleNextQuestion: () => void;
  analyzePosition: (position: string, questionData: QuestionData) => void;
  resetState: () => void;
}

export const useBoardVisionStore = create<BoardVisionState>((set, get) => ({
  appState: "welcome",
  username: "",
  currentQuestionIndex: 0,
  selectedAnswer: null,
  showFeedback: false,
  highlightedSquares: {},
  arrows: [],
  questions: questionsData,
  
  // Actions
  setAppState: (state) => set({ appState: state }),
  setUsername: (name) => set({ username: name }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  setShowFeedback: (show) => set({ showFeedback: show }),
  setHighlightedSquares: (squares) => set({ highlightedSquares: squares }),
  setArrows: (arrows) => set({ arrows: arrows }),
  
  handleSelectAnswer: (answer) => {
    set({ selectedAnswer: answer, showFeedback: true });
    
    const { questions, currentQuestionIndex, analyzePosition } = get();
    const currentQuestion = questions[currentQuestionIndex];
    analyzePosition(currentQuestion.position, currentQuestion);
  },
  
  handleNextQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    set({
      selectedAnswer: null,
      showFeedback: false,
      highlightedSquares: {},
      arrows: [],
      currentQuestionIndex: (currentQuestionIndex + 1) % questions.length
    });
  },
  
  analyzePosition: (position, questionData) => {
    try {
      const chess = new Chess(position);
      const newHighlightedSquares: HighlightedSquares = {};
      const newArrows: Arrow[] = [];

      if (questionData.type === "legal") {
        const allMoves = chess.moves({ verbose: true });

        if (questionData.piece) {
          const pieceMoves = allMoves.filter((move) => {
            const piece = chess.get(move.from);
            return (
              piece &&
              piece.type.toLowerCase() === questionData.piece?.toLowerCase()
            );
          });

          pieceMoves.forEach((move) => {
            newHighlightedSquares[move.to] = {
              background: "none",
              border: "3px solid #0000C8",
            };
            newArrows.push([move.from, move.to]);
          });
        } else {
          allMoves.forEach((move) => {
            newHighlightedSquares[move.to] = {
              background: "none",
              borderRadius: "100px",
              border: "3px solid #0000C8",
            };
          });
        }
      } else if (questionData.type === "check") {
        const checkMoves = chess
          .moves({ verbose: true })
          .filter((move) => move.san.includes("+"));

        checkMoves.forEach((move) => {
          newHighlightedSquares[move.to] = {
            background: "none",
            border: "3px solid #0000C8",
            borderRadius: "4px",
          };
          newArrows.push([move.from, move.to]);
        });
      }

      set({
        highlightedSquares: newHighlightedSquares,
        arrows: newArrows
      });
    } catch (error) {
      console.error("Error analyzing position:", error);
    }
  },
  
  resetState: () => {
    set({
      appState: "welcome",
      username: "",
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showFeedback: false,
      highlightedSquares: {},
      arrows: []
    });
  }
}));