import { create } from 'zustand';
import { Chess } from 'chess.js';
import { ChessService } from './BoardVisionService';
import { shuffle } from './UtilFunctions';
import { defaultPositions } from './DefaultPositionData';
import { HighlightedSquares, Position, GameQuestion, Arrow } from '../types/default-pgn';

export type AppState = "welcome" | "default" | "player-game";

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

interface BoardVisionState {
  // App state
  appState: AppState;
  username: string;
  currentYear: number;
  currentMonth: number;
  gameMaxQuestions: number;
  
  // Default game state
  defaultGame: GameState;
  
  // User game state
  userGame: GameState;
  
  // Display state
  showThreats: boolean;
  
  // Loading state
  isLoading: boolean;
  isChangingQuestion: boolean;
  loadingError: string | null;
  
  // Actions - Common
  setAppState: (state: AppState) => void;
  setUsername: (name: string) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  toggleShowThreats: () => void;
  resetState: () => void;
  
  // Actions - Default Game
  loadDefaultPositions: () => void;
  handleDefaultGameSelectAnswer: (answer: number) => void;
  handleDefaultGameNextQuestion: () => void;
  getDefaultRandomQuestion: () => void;
  startDefaultGameAgain: () => void;
  
  // Actions - User Game
  loadUserPositions: (username: string, year: number, month: number) => Promise<void>;
  handleUserGameSelectAnswer: (answer: number) => void;
  handleUserGameNextQuestion: () => void;
  getUserRandomQuestion: () => void;
  startUserGameAgain: () => void;
  
  // Shared Actions
  generateGameQuestion: (position: Position, forUserGame?: boolean) => void;
}

// Helper function to create initial game state
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

export const useBoardVisionStore = create<BoardVisionState>((set, get) => ({
  // App state
  appState: "welcome",
  username: "",
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  gameMaxQuestions: 10,
  
  // Default game state
  defaultGame: createInitialGameState(),
  
  // User game state
  userGame: createInitialGameState(),
  
  // Display state
  showThreats: false,
  
  // Loading state
  isLoading: false,
  isChangingQuestion: false,
  loadingError: null,
  
  // Actions - Common
  setAppState: (state) => set({ appState: state }),
  setUsername: (name) => set({ username: name }),
  setCurrentMonth: (month) => set({ currentMonth: month }),
  setCurrentYear: (year) => set({ currentYear: year }),
  
  toggleShowThreats: () => {
    set({ showThreats: !get().showThreats });
  },
  
  // Actions - Default Game
  loadDefaultPositions: () => {
    const positions = defaultPositions();
    const shuffledPositions = shuffle(positions);
    
    set({
      defaultGame: {
        ...createInitialGameState(),
        positions: shuffledPositions,
        currentPosition: shuffledPositions[0],
      }
    });
    
    // Generate first question
    get().generateGameQuestion(shuffledPositions[0], false);
  },
  
  handleDefaultGameSelectAnswer: (answer) => {
    const { defaultGame } = get();
    const isCorrect = defaultGame.gameQuestion && answer === defaultGame.gameQuestion.correctAnswer;
    
    set({
      defaultGame: {
        ...defaultGame,
        gameSelectedAnswer: answer,
        gameShowFeedback: true,
        gameCorrects: isCorrect ? defaultGame.gameCorrects + 1 : defaultGame.gameCorrects,
      },
      showThreats: true
    });
    
    // Visualize threats if current question type is about threats or checks
    if (defaultGame.currentPosition && defaultGame.gameQuestion) {
      const chess = new Chess(defaultGame.currentPosition.fen);
      const allMoves = chess.moves({ verbose: true });
      const newHighlightedSquares: HighlightedSquares = {};
      const newArrows: Arrow[] = [];
      
      if (defaultGame.gameQuestion.text.includes("legal moves")) {
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
      } else if (defaultGame.gameQuestion.text.includes("check moves")) {
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
      } else if (defaultGame.gameQuestion.text.includes("capture moves")) {
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
        defaultGame: {
          ...get().defaultGame,
          highlightedSquares: newHighlightedSquares,
          arrows: newArrows
        }
      });
    }
  },
  
  handleDefaultGameNextQuestion: () => {
    const { defaultGame, gameMaxQuestions } = get();
    
    if (defaultGame.gameQuestionNumber >= gameMaxQuestions) {
      // End of game
      set({
        defaultGame: {
          ...defaultGame,
          gameQuestionNumber: defaultGame.gameQuestionNumber + 1
        }
      });
    } else {
      // Get next position
      const nextIndex = (defaultGame.currentPositionIndex + 1) % defaultGame.positions.length;
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
          arrows: []
        },
        showThreats: false
      });
      
      // Generate new question for this position
      get().generateGameQuestion(nextPosition, false);
    }
  },
  
  getDefaultRandomQuestion: () => {
    const { defaultGame } = get();
    if (defaultGame.positions.length === 0) return;
    
    // Set loading state
    set({ isChangingQuestion: true });
    
    // Count each question change as a mistake
    const currentCorrects = defaultGame.gameCorrects;
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      // Get a random position
      const randomIndex = Math.floor(Math.random() * defaultGame.positions.length);
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
          arrows: []
        },
        showThreats: false,
        isChangingQuestion: false
      });
      
      // Generate new question for this position
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
        arrows: []
      },
      showThreats: false
    });
    
    // Generate first question
    get().generateGameQuestion(defaultGame.positions[0], false);
  },
  
  // Actions - User Game
  loadUserPositions: async (username, year, month) => {
    const state = get();
    
    // Don't reload if username and dates match and positions exist
    if (state.username === username && 
        state.currentYear === year && 
        state.currentMonth === month && 
        state.userGame.positions.length > 0) {
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
      
      const shuffledPositions = shuffle(positions);
      
      set({ 
        username,
        currentYear: year,
        currentMonth: month,
        userGame: {
          ...createInitialGameState(),
          positions: shuffledPositions,
          currentPosition: shuffledPositions[0],
        },
        isLoading: false
      });
      
      // Generate first question
      get().generateGameQuestion(shuffledPositions[0], true);
      
    } catch (error) {
      console.error("Error loading user positions:", error);
      set({ 
        isLoading: false, 
        loadingError: `Failed to load games for ${username}. Please check the username and try again.`
      });
    }
  },
  
  handleUserGameSelectAnswer: (answer) => {
    const { userGame } = get();
    const isCorrect = userGame.gameQuestion && answer === userGame.gameQuestion.correctAnswer;
    
    set({
      userGame: {
        ...userGame,
        gameSelectedAnswer: answer,
        gameShowFeedback: true,
        gameCorrects: isCorrect ? userGame.gameCorrects + 1 : userGame.gameCorrects,
      },
      showThreats: true
    });
    
    // Visualize threats if current question type is about threats or checks
    if (userGame.currentPosition && userGame.gameQuestion) {
      const chess = new Chess(userGame.currentPosition.fen);
      const allMoves = chess.moves({ verbose: true });
      const newHighlightedSquares: HighlightedSquares = {};
      const newArrows: Arrow[] = [];
      
      if (userGame.gameQuestion.text.includes("legal moves")) {
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
      } else if (userGame.gameQuestion.text.includes("check moves")) {
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
      } else if (userGame.gameQuestion.text.includes("capture moves")) {
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
        userGame: {
          ...get().userGame,
          highlightedSquares: newHighlightedSquares,
          arrows: newArrows
        }
      });
    }
  },
  
  handleUserGameNextQuestion: () => {
    const { userGame, gameMaxQuestions } = get();
    
    if (userGame.gameQuestionNumber >= gameMaxQuestions) {
      // End of game
      set({
        userGame: {
          ...userGame,
          gameQuestionNumber: userGame.gameQuestionNumber + 1
        }
      });
    } else {
      // Get next position
      const nextIndex = (userGame.currentPositionIndex + 1) % userGame.positions.length;
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
          arrows: []
        },
        showThreats: false
      });
      
      // Generate new question for this position
      get().generateGameQuestion(nextPosition, true);
    }
  },
  
  getUserRandomQuestion: () => {
    const { userGame } = get();
    if (userGame.positions.length === 0) return;
    
    // Set loading state
    set({ isChangingQuestion: true });
    
    // Count each question change as a mistake
    const currentCorrects = userGame.gameCorrects;
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      // Get a random position
      const randomIndex = Math.floor(Math.random() * userGame.positions.length);
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
          arrows: []
        },
        showThreats: false,
        isChangingQuestion: false
      });
      
      // Generate new question for this position
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
        arrows: []
      },
      showThreats: false
    });
    
    // Generate first question
    get().generateGameQuestion(userGame.positions[0], true);
  },
  
  // Generate question for either default or user game
  generateGameQuestion: (position, forUserGame = false) => {
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
    
    // Generate random answers
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
    
    // Update either default or user game state
    if (forUserGame) {
      set({
        userGame: {
          ...get().userGame,
          gameQuestion: question
        }
      });
    } else {
      set({
        defaultGame: {
          ...get().defaultGame,
          gameQuestion: question
        }
      });
    }
  },
  
  resetState: () => {
    set({
      appState: "welcome",
      username: "",
      defaultGame: createInitialGameState(),
      userGame: createInitialGameState(),
      isLoading: false,
      loadingError: null,
      showThreats: false
    });
  }
}));