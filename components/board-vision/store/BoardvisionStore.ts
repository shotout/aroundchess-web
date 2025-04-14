import { create } from 'zustand';
import { Chess } from 'chess.js';
import { ChessService } from '../service/BoardVisionService';
import { shuffle } from '../util/UtilFunctions';
import { defaultPositions } from '../util/DefaultPositionData';


interface HighlightedSquare {
  background: string;
  border?: string;
  borderRadius?: string;
}

export interface HighlightedSquares {
  [square: string]: HighlightedSquare;
}

export interface Position {
  blackProfilePic?: any;
  whiteProfilePic?: any;
  fen: string;
  white: string;
  black: string;
  url: string;
}

export interface QuestionType {
  id: string;
  text: string;
}

export interface GameQuestion {
  text: string;
  answers: number[];
  correctAnswer: number;
}

export type Arrow = [string, string];
export type AppState = "welcome" | "default" | "player-game";

interface BoardVisionState {
  // Basic state
  appState: AppState;
  username: string;
  currentYear: number;
  currentMonth: number;
  positions: Position[];
  currentPositionIndex: number;
  currentPosition: Position | null;
  
  // Game questions
  gameQuestion: GameQuestion | null;
  gameSelectedAnswer: number | null;
  gameShowFeedback: boolean;
  gameCorrects: number;
  gameQuestionNumber: number;
  gameMaxQuestions: number;
  
  // Visualization
  highlightedSquares: HighlightedSquares;
  arrows: Arrow[] | any;
  showThreats: boolean;
  
  // Loading state
  isLoading: boolean;
  loadingError: string | null;
  
  // Actions
  setAppState: (state: AppState) => void;
  setUsername: (name: string) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  loadUserPositions: (username: string, year: number, month: number) => Promise<void>;
  loadDefaultPositions: () => void;
  nextPosition: () => void;
  
  // Game actions
  handleGameSelectAnswer: (answer: number) => void;
  handleGameNextQuestion: () => void;
  generateGameQuestion: (position: Position) => void;
  startGameAgain: () => void;
  
  // Visualization actions
  toggleShowThreats: () => void;
  
  resetState: () => void;
}

export const useBoardVisionStore = create<BoardVisionState>((set, get) => ({
  // Basic state
  appState: "welcome",
  username: "",
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  positions: [],
  currentPositionIndex: 0,
  currentPosition: null,
  
  // Game questions
  gameQuestion: null,
  gameSelectedAnswer: null,
  gameShowFeedback: false,
  gameCorrects: 0,
  gameQuestionNumber: 1,
  gameMaxQuestions: 10,
  
  // Visualization
  highlightedSquares: {},
  arrows: [],
  showThreats: false,
  
  // Loading state
  isLoading: false,
  loadingError: null,
  
  // Actions
  setAppState: (state) => set({ appState: state }),
  setUsername: (name) => set({ username: name }),
  setCurrentMonth: (month) => set({ currentMonth: month }),
  setCurrentYear: (year) => set({ currentYear: year }),
  
  loadUserPositions: async (username, year, month) => {
    const state = get();
    
    // Don't reload if username and dates match
    if (state.username === username && 
        state.currentYear === year && 
        state.currentMonth === month && 
        state.positions.length > 0) {
      return;
    }
    
    set({ isLoading: true, loadingError: null });
    
    try {
      const positions = await ChessService.getUserGames(username, year, month);
      
      // Only require 1 game now instead of 10
      if (positions.length < 1) {
        set({ 
          isLoading: false,
          loadingError: `No games found for ${username} in ${month}/${year}. Please try another month or username.`
        });
        return;
      }
      
      set({ 
        username,
        currentYear: year,
        currentMonth: month,
        positions: shuffle(positions),
        currentPositionIndex: 0,
        currentPosition: positions[0],
        isLoading: false,
        gameQuestionNumber: 1,
        gameCorrects: 0,
        gameShowFeedback: false,
        gameSelectedAnswer: null
      });
      
      // Generate first question
      get().generateGameQuestion(positions[0]);
      
    } catch (error) {
      console.error("Error loading user positions:", error);
      set({ 
        isLoading: false, 
        loadingError: `Failed to load games for ${username}. Please check the username and try again.`
      });
    }
  },
  
  loadDefaultPositions: () => {
    const positions = defaultPositions();
    set({ 
      positions: shuffle(positions),
      currentPositionIndex: 0,
      currentPosition: positions[0],
      gameQuestionNumber: 1,
      gameCorrects: 0,
      gameShowFeedback: false,
      gameSelectedAnswer: null
    });
    
    // Generate first question
    get().generateGameQuestion(positions[0]);
  },
  
  nextPosition: () => {
    const { positions, currentPositionIndex } = get();
    const nextIndex = (currentPositionIndex + 1) % positions.length;
    const nextPosition = positions[nextIndex];
    
    set({
      currentPositionIndex: nextIndex,
      currentPosition: nextPosition,
      gameSelectedAnswer: null,
      gameShowFeedback: false,
      showThreats: false,
      highlightedSquares: {},
      arrows: []
    });
    
    // Generate new question for this position
    get().generateGameQuestion(nextPosition);
  },
  
  handleGameSelectAnswer: (answer) => {
    const { gameQuestion, currentPosition } = get();
    const isCorrect = gameQuestion && answer === gameQuestion.correctAnswer;
    
    set({
      gameSelectedAnswer: answer,
      gameShowFeedback: true,
      gameCorrects: isCorrect ? get().gameCorrects + 1 : get().gameCorrects,
      showThreats: true
    });
    
    // Visualize threats if current question type is about threats or checks
    if (currentPosition && gameQuestion) {
      const chess = new Chess(currentPosition.fen);
      const allMoves = chess.moves({ verbose: true });
      const newHighlightedSquares: HighlightedSquares = {};
      const newArrows: Arrow[] = [];
      
      if (gameQuestion.text.includes("legal moves")) {
        // Highlight all legal moves
        allMoves.forEach((move) => {
          newHighlightedSquares[move.to] = {
            background: "none",
            borderRadius: "100px",
            border: "3px solid #0000C8",
          };
          // Optionally add arrows for all legal moves
          newArrows.push([move.from, move.to]);
        });
      } else if (gameQuestion.text.includes("check moves")) {
        // Highlight check moves
        const checkMoves = allMoves.filter(move => move.san.includes('+'));
        checkMoves.forEach((move) => {
          newHighlightedSquares[move.to] = {
            background: "none",
            border: "3px solid #FF0000",
            borderRadius: "4px",
          };
          newArrows.push([move.from, move.to]);
        });
      } else if (gameQuestion.text.includes("capture moves")) {
        // Highlight capture moves (threats)
        const captureMoves = allMoves.filter(move => move.flags.includes('c'));
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
        highlightedSquares: newHighlightedSquares,
        arrows: newArrows
      });
    }
  },
  
  handleGameNextQuestion: () => {
    const { gameQuestionNumber, gameMaxQuestions } = get();
    
    if (gameQuestionNumber >= gameMaxQuestions) {
      // End of game
      set({ gameQuestionNumber: gameQuestionNumber + 1 });
    } else {
      // Next question
      set({
        gameQuestionNumber: gameQuestionNumber + 1,
        gameSelectedAnswer: null,
        gameShowFeedback: false,
        showThreats: false,
        highlightedSquares: {},
        arrows: []
      });
      
      // Get next position
      get().nextPosition();
    }
  },
  
  generateGameQuestion: (position) => {
    if (!position) return;
    
    // Analyze the position
    const analysis = ChessService.analyzePosition(position.fen);
    
    // Define question types
    const questionTypes = [
      { id: "legal_white", text: "How many legal moves does White have?" },
      { id: "legal_black", text: "How many legal moves does Black have?" },
      { id: "checks_white", text: "How many check moves does White have?" },
      { id: "checks_black", text: "How many check moves does Black have?" },
      { id: "threat_white", text: "How many capture moves does White have?" },
      { id: "threat_black", text: "How many capture moves does Black have?" }
    ];
    
    // Filter questions based on the current color to move
    const availableQuestions = questionTypes.filter(q => 
      q.id.includes(analysis.turn === 'w' ? "white" : "black")
    );
    
    // Select a random question
    const questionType = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    // Get the correct answer based on the question type
    let correctAnswer = 0;
    switch (questionType.id) {
      case "legal_white": correctAnswer = analysis.legal_white; break;
      case "legal_black": correctAnswer = analysis.legal_black; break;
      case "checks_white": correctAnswer = analysis.checks_white; break;
      case "checks_black": correctAnswer = analysis.checks_black; break;
      case "threat_white": correctAnswer = analysis.threat_white; break;
      case "threat_black": correctAnswer = analysis.threat_black; break;
    }
    
    // Generate random answers (following Vue Chess Guardian's approach)
    const answers = [correctAnswer];
    while (answers.length < 4) {
      const randomAnswer = Math.max(0, correctAnswer + Math.floor(Math.random() * 13) - 6);
      if (!answers.includes(randomAnswer)) {
        answers.push(randomAnswer);
      }
    }
    
    // Create the question
    const question: GameQuestion = {
      text: questionType.text,
      answers: shuffle(answers),
      correctAnswer
    };
    
    set({ gameQuestion: question });
  },
  
  toggleShowThreats: () => {
    set({ showThreats: !get().showThreats });
  },
  
  startGameAgain: () => {
    const { positions } = get();
    
    set({
      gameQuestionNumber: 1,
      gameCorrects: 0,
      gameShowFeedback: false,
      gameSelectedAnswer: null,
      currentPositionIndex: 0,
      currentPosition: positions[0],
      positions: shuffle(positions),
      showThreats: false,
      highlightedSquares: {},
      arrows: []
    });
    
    // Generate first question
    get().generateGameQuestion(positions[0]);
  },
  
  resetState: () => {
    set({
      appState: "welcome",
      username: "",
      positions: [],
      currentPositionIndex: 0,
      currentPosition: null,
      gameQuestion: null,
      gameSelectedAnswer: null,
      gameShowFeedback: false,
      gameCorrects: 0,
      gameQuestionNumber: 1,
      isLoading: false,
      loadingError: null,
      showThreats: false,
      highlightedSquares: {},
      arrows: []
    });
  }
}));