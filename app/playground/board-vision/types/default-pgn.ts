import { Variants } from "framer-motion";

export interface HighlightedSquare {
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

export interface GameQuestion {
  text: string;
  answers: number[];
  correctAnswer: number;
}

export type Arrow = [string, string];

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