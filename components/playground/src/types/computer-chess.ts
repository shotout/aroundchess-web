import { Board, Player, GameResult, PieceType } from './chess';

export interface ChessMove {
  type: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  recorded?: boolean;
}

export interface ComputerChessState {
  board: Board;
  currentPlayer: Player;
  lastMove: ChessMove | null;
  movingPiece: { type: string; fromRow: number; fromCol: number } | null;
  kingCheckOrMoved: { white: boolean; black: boolean };
  rookMoved: {
    white: { left: boolean; right: boolean };
    black: { left: boolean; right: boolean };
  };
  isKingInCheck: "white" | "black" | "noCheck";
  isCheckMate: "white" | "black" | "noCheckMate";
  computer: Player | null;
  eliminatedPieces: { white: string[]; black: string[] };
  historyIndex: number;
  canPromotePawn: { row: number; col: number } | null;
  initialized: boolean;
  moves: string[];
  moveHistory: ChessMove[];
  boardHistory: Board[];
  gameResults: GameResult[];
}

export interface Character {
  id: string;
  name: string;
  title: string;
  elo: number;
  gender: 'male' | 'female';
  avatarNumber: number;
}

export interface ComputerChessStoreState extends ComputerChessState {
  stockfishLevel: number;
  targetELO: number;
  stockfishSettings: { depth: number; randomness: number };
  fiftyMoveRuleCounter: number;
  numberOfFullMoves: number;
  tournamentMode: boolean;
  isColorSelectionOpen: boolean;
  playerColor: 'white' | 'black';
  isBoardFlipped: boolean;
  getFen: () => string;
  movePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  isValidMove: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  resetGame: () => void;
  undoMove: () => void;
  redoMove: () => void;
  addMove: (move: string) => void;
  updateComputer: (color: Player | null) => void;
  computerMove: () => Promise<void>;
  updateTargetELO: (elo: number) => void;
  toggleTournamentMode: () => void;
  promotePawn: (row: number, col: number, piece: PieceType) => void;
  setColorSelectionOpen: (isOpen: boolean) => void;
  setPlayerColor: (color: 'white' | 'black') => void;
  recordMove: (fromRow: number, fromCol: number, toRow: number, toCol: number, piece: string, isCapture: boolean) => string;
  opponentName: string;
  setOpponentName: (name: string) => void;
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character | null) => void;
}
