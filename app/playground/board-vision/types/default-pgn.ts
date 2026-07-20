import { Variants } from "framer-motion";

export interface PlayerInfoProps {
  profilePic: any;
  playerName: string;
  countryCode?: string;
}

export interface HighlightedSquare {
  background: string;
  border?: string;
  borderRadius?: string;
}

export interface HighlightedSquares {
  [square: string]: HighlightedSquare;
}

export interface Position {
  gameIndex: undefined;
  blackProfilePic?: any;
  whiteProfilePic?: any;
  fen: string;
  white: string;
  black: string;
  url: string;
  /** The player's name in this game (matches the PGN White/Black header). */
  username?: string;
}

/** A game fed into the Board Vision quiz: its PGN plus the player's name in it. */
export interface QuizGame {
  pgn: string;
  username: string;
}

export interface GameQuestion {
  text: string;
  answers: number[];
  correctAnswer: number;
}

export interface ArrowConfig {
  from: string;
  to: string;
  color: string;
  isKnightMove: boolean;
}

export type Arrow = [string, string] | ArrowConfig;

// Component Props Types
export interface BoardDisplayProps {
  currentPosition: Position | null;
  gameQuestion: GameQuestion | null;
  highlightedSquares: HighlightedSquares;
  arrows: Arrow[] | any;
  leftPanelVariants: Variants;
}

export interface QuestionPanelProps {
  gameQuestion: GameQuestion | null;
  gameSelectedAnswer: number | null;
  gameShowFeedback: boolean;
  gameQuestionNumber: number;
  gameMaxQuestions: number;
  handleGameSelectAnswer: (answer: number) => void;
  isGameEnd: boolean;
}

export interface GameResultProps {
  gameCorrects: number;
  gameMaxQuestions: number;
  isGameEnd: boolean;
}

export interface FeedbackPanelProps {
  feedbackVariants: Variants;
  gameShowFeedback: boolean;
  isGameEnd: boolean;
  gameQuestion: GameQuestion | null;
  gameSelectedAnswer: number | null;
  handleGameNextQuestion: () => void;
  startGameAgain: () => void;
  setShowSetupPopup: (show: boolean) => void;
  getRandomQuestion?: () => void;
  isChangingQuestion?: boolean;
  routeToDefault?: () => void;
  isUserPGN?: boolean;
  gameQuestionNumber: number;
  gameMaxQuestions: number;
}

export interface LoadingStateProps {
  setShowSetupPopup: (show: boolean) => void;
  message?: string;
}

export interface PerformanceValuation {
  label: string;
  description: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
}

// UserPGN specific types
export interface PlayerInfoProps {
  profilePic: any;
  playerName: string;
  countryCode?: string;
}

export interface UserBoardDisplayProps extends BoardDisplayProps {
  username: string;
  userProfilePic: any;
  opponentProfilePic: any;
  opponentName: string;
}