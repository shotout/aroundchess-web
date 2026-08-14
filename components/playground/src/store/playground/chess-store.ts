import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Player, MovingPiece, Board, GameResult, PieceType, GameEndResult } from '../../types/chess'
import { initialBoard } from '../../lib/playground/initial-setup'
import { isMovePossible } from '../../utils/possibleMove'
import { isKingInCheck } from '../../utils/kingCheck'
import { 
  playMoveSound, 
  playCaptureSound, 
  playCastlingSound, 
  playCheckSound, 
  playCheckmateSound,
  playPromoteSound 
} from '../../utils/playSound'
import { generateMoveNotation } from '../../utils/generateMoveNotation'
import { promotePawn } from '../../utils/promotePawn'
import { CheckEnpassant } from '../../utils/enpassant'

interface ChessMove {
  type: string;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  recorded?: boolean;
}

export interface ChessStoreState {
  board: Board;
  currentPlayer: Player;
  selectedPiece: null | { row: number; col: number };
  lastMove: ChessMove | null;
  movingPiece: MovingPiece | null;
  winner: Player | null;
  kingCheckOrMoved: { white: boolean; black: boolean };
  rookMoved: {
    white: { left: boolean; right: boolean };
    black: { left: boolean; right: boolean };
  };
  isKingInCheck: Player | "noCheck";
  isCheckMate: Player | "noCheckMate";
  eliminatedPieces: { white: string[]; black: string[] };
  historyIndex: number;
  moves: string[];
  computer: Player | null;
  stockfishLevel: number;
  fiftyMoveRuleCounter: number;
  numberOfFullMoves: number;
  targetELO: number;
  stockfishSettings: { depth: number; randomness: number };
  canPromotePawn: { row: number; col: number } | null;
  gameResults: GameResult[];
  boardHistory: Board[];
  initialized?: boolean;
  gameResult: GameEndResult | null;
  gameStartTime: number | null;
  getFen: () => string;
  hintArrow: [string, string] | null;

  movePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  isValidMove: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  resetGame: () => void;
  undoMove: () => void;
  redoMove: () => void;
  addMove: (move: string) => void;
  updateComputer: (color: Player | null) => void;
  computerMove: () => Promise<void>;
  updateStockfishLevel: (level: number) => void;
  promotePawn: (row: number, col: number, piece: PieceType) => void;
  refetchStore: () => void;
  updateTargetELO: (elo: number) => void;
  addGameResult: (result: Omit<GameResult, 'date'>) => void;
  updateKingMoved: (color: Player) => void;
  updateRookMoved: (color: Player, side: 'left' | 'right') => void;
  setHintArrow: (from: string, to: string) => void;
  clearHintArrow: () => void;
}

export const useChessStore = create<ChessStoreState>()(
  persist(
    (set, get) => ({
      board: initialBoard,
      currentPlayer: "white",
      selectedPiece: null,
      lastMove: null,
      movingPiece: null as MovingPiece | null,
      winner: null,
      kingCheckOrMoved: { white: false, black: false },
      rookMoved: {
        white: { left: false, right: false },
        black: { left: false, right: false },
      },
      isKingInCheck: "noCheck",
      isCheckMate: "noCheckMate",
      eliminatedPieces: { white: [], black: [] },
      historyIndex: -1,
      moves: [],
      computer: null,
      stockfishLevel: 1,
      fiftyMoveRuleCounter: 0,
      numberOfFullMoves: 0,
      targetELO: 1200,
      stockfishSettings: { depth: 15, randomness: 0 },
      canPromotePawn: null,
      gameResults: [],
      boardHistory: [initialBoard],
      initialized: false,
      gameResult: null,
      gameStartTime: Date.now(),
      hintArrow: null,

      movePiece: (fromRow, fromCol, toRow, toCol) => {
        const state = get();
        if (!state.isValidMove(fromRow, fromCol, toRow, toCol)) return false;

        const newBoard = state.board.map(row => [...row]) as Board;
        const piece = newBoard[fromRow][fromCol];
        const capturedPiece = newBoard[toRow][toCol];

        let isCastling = false;
        if (piece?.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2) {
          isCastling = true;
          if (toCol === 6) {
            const rookFromCol = 7;
            const rookToCol = 5;
            const rookPiece = newBoard[fromRow][rookFromCol];
            if (rookPiece) {
              newBoard[fromRow][rookToCol] = rookPiece;
              newBoard[fromRow][rookFromCol] = null;
            }
          }
          else if (toCol === 2) {
            const rookFromCol = 0;
            const rookToCol = 3;
            const rookPiece = newBoard[fromRow][rookFromCol];
            if (rookPiece) {
              newBoard[fromRow][rookToCol] = rookPiece;
              newBoard[fromRow][rookFromCol] = null;
            }
          }
        }

        if (piece?.toUpperCase() === 'K') {
          set(state => ({
            ...state,
            kingCheckOrMoved: {
              ...state.kingCheckOrMoved,
              [state.currentPlayer]: true
            }
          }));
        }

        if (piece?.toUpperCase() === 'R') {
          const side = fromCol === 0 ? 'left' : 'right';
          set(state => ({
            ...state,
            rookMoved: {
              ...state.rookMoved,
              [state.currentPlayer]: {
                ...state.rookMoved[state.currentPlayer],
                [side]: true
              }
            }
          }));
        }

        const canPromote = promotePawn(newBoard, fromRow, fromCol, toRow, toCol, state.currentPlayer);
        if (canPromote) {
          newBoard[toRow][toCol] = state.currentPlayer === "white" ? "P" : "p";
          newBoard[fromRow][fromCol] = null;
          
          set({
            board: newBoard,
            canPromotePawn: { row: toRow, col: toCol },
            lastMove: {
              type: state.currentPlayer === "white" ? "P" : "p",
              fromRow,
              fromCol,
              toRow,
              toCol,
            },
          });
          
          playPromoteSound();
          return true;
        }

        const newEliminatedPieces = {
          white: [...state.eliminatedPieces.white],
          black: [...state.eliminatedPieces.black]
        };

        let isEnPassant = false;
        if (state.lastMove && CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, state.lastMove)) {
          const capturedPawnRow = state.lastMove.toRow;
          const capturedPawnCol = state.lastMove.toCol;
          const capturedPawn = newBoard[capturedPawnRow][capturedPawnCol];
          if (capturedPawn && capturedPawn.toUpperCase() === 'P') {
            newEliminatedPieces[state.currentPlayer].push(capturedPawn);
            newBoard[capturedPawnRow][capturedPawnCol] = null;
            newBoard[toRow][toCol] = piece;
            newBoard[fromRow][fromCol] = null;
            isEnPassant = true;
            playCaptureSound();
          }
        }

        if (capturedPiece) {
          const color = state.currentPlayer;
          newEliminatedPieces[color].push(capturedPiece);
        }

        if (!isEnPassant) {
          newBoard[toRow][toCol] = piece;
          newBoard[fromRow][fromCol] = null;
        }

        const opponent = state.currentPlayer === "white" ? "black" : "white";
        const isCheck = isKingInCheck(newBoard, opponent);
        const opponentHasValidMoves = hasValidMoves(newBoard, opponent);
        const isCheckmate = isCheck && !opponentHasValidMoves;

        set(state => ({
          ...state,
          board: newBoard,
          currentPlayer: state.currentPlayer === "white" ? "black" : "white",
          lastMove: {
            type: piece!,
            fromRow,
            fromCol,
            toRow,
            toCol,
          },
          moves: [...state.moves, generateMoveNotation(
            piece!,
            fromRow,
            fromCol,
            toRow,
            toCol,
            isCastling ? null : state.board[toRow][toCol],
            isCheck,
            isCheckmate
          )],
          eliminatedPieces: newEliminatedPieces,
          fiftyMoveRuleCounter: state.fiftyMoveRuleCounter + 1,
          numberOfFullMoves: state.numberOfFullMoves + (state.currentPlayer === "white" ? 1 : 0),
          boardHistory: [...state.boardHistory.slice(0, state.historyIndex + 1), newBoard],
          historyIndex: state.historyIndex + 1,
        }));

        if (isCheck) {
          if (!opponentHasValidMoves) {
            const currentState = get();
            const duration = currentState.gameStartTime !== null ? Math.floor((Date.now() - currentState.gameStartTime) / 1000) : 0;
            set(state => ({
              ...state,
              isCheckMate: opponent,
              gameResult: {
                winner: state.currentPlayer,
                reason: 'checkmate',
                message: `${state.currentPlayer === 'white' ? 'White' : 'Black'} wins by checkmate!`
              },
              gameStartTime: null,
            }));
            playCheckmateSound();
          } else {
            set(state => ({
              ...state,
              isKingInCheck: opponent,
            }));
            playCheckSound();
          }
        } else {
          set(state => ({
            ...state,
            isKingInCheck: "noCheck",
            isCheckMate: "noCheckMate",
          }));
          if (capturedPiece) {
            playCaptureSound();
          } else if (isCastling) {
            playCastlingSound();
          } else {
            playMoveSound();
          }
        }

        state.clearHintArrow();

        return true;
      },
      isValidMove: (fromRow, fromCol, toRow, toCol) => {
        const state = get();
        const { board, currentPlayer } = state;
        
        if (!board[fromRow]?.[fromCol]) {
          return false;
        }
        
        const piece = board[fromRow][fromCol];
        const isWhitePiece = piece === piece?.toUpperCase();
        
        if ((currentPlayer === "white" && !isWhitePiece) ||
            (currentPlayer === "black" && isWhitePiece)) {
          return false;
        }

        return isMovePossible(
          board,
          fromRow,
          fromCol,
          toRow,
          toCol,
          currentPlayer,
          state.lastMove,
          state.rookMoved,
          state.kingCheckOrMoved
        );
      },
      resetGame: () => set((state) => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('chess-store');
        }
        
        return {
          board: initialBoard,
          currentPlayer: "white",
          selectedPiece: null,
          lastMove: null,
          movingPiece: null,
          winner: null,
          kingCheckOrMoved: { white: false, black: false },
          rookMoved: {
            white: { left: false, right: false },
            black: { left: false, right: false },
          },
          isKingInCheck: "noCheck",
          isCheckMate: "noCheckMate",
          eliminatedPieces: { white: [], black: [] },
          historyIndex: -1,
          moves: [],
          computer: null,
          stockfishLevel: 1,
          fiftyMoveRuleCounter: 0,
          numberOfFullMoves: 0,
          targetELO: 1200,
          stockfishSettings: { depth: 15, randomness: 0 },
          canPromotePawn: null,
          gameResults: [],
          boardHistory: [initialBoard],
          initialized: false,
          gameResult: null,
          gameStartTime: Date.now(),
        };
      }),
      undoMove: () => set((state) => {
        if (state.moves.length === 0 || state.historyIndex === -1) return state;
        
        const newHistoryIndex = Math.max(-1, state.historyIndex - 1);
        const currentPlayer = state.currentPlayer === "white" ? "black" : "white";
        const previousBoard = newHistoryIndex === -1 ? initialBoard : state.boardHistory[newHistoryIndex];
        
        return {
          ...state,
          board: previousBoard,
          historyIndex: newHistoryIndex,
          currentPlayer,
          lastMove: null,
          movingPiece: null,
          isKingInCheck: "noCheck",
          isCheckMate: "noCheckMate",
          moves: state.moves.slice(0, newHistoryIndex + 1)
        };
      }),
      
      redoMove: () => set((state) => {
        if (state.historyIndex >= state.boardHistory.length - 1) return state;
        
        const newHistoryIndex = state.historyIndex + 1;
        const currentPlayer = state.currentPlayer === "white" ? "black" : "white";
        const nextBoard = state.boardHistory[newHistoryIndex];
        
        return {
          ...state,
          board: nextBoard,
          historyIndex: newHistoryIndex,
          currentPlayer,
          lastMove: null,
          movingPiece: null,
          isKingInCheck: "noCheck",
          isCheckMate: "noCheckMate"
        };
      }),
      addMove: (move) => set((state) => ({ 
        ...state,
        moves: [...state.moves, move] 
      })),
      updateComputer: (color) => set((state) => ({ 
        ...state,
        computer: color 
      })),
      computerMove: async () => {},
      updateStockfishLevel: (level) => set((state) => ({ 
        ...state,
        stockfishLevel: level 
      })),
      promotePawn: (row: number, col: number, piece: PieceType) => {
        const state = get();
        const newBoard = state.board.map(row => [...row]) as Board;
        
        const promotedPiece = state.currentPlayer === "white" ? 
          piece.toUpperCase() as PieceType : 
          piece.toLowerCase() as PieceType;
          
        newBoard[row][col] = promotedPiece;
        
        set({
          board: newBoard,
          canPromotePawn: null,
          currentPlayer: state.currentPlayer === "white" ? "black" : "white",
          lastMove: {
            ...state.lastMove!,
            type: promotedPiece,
          },
        });
        
        playMoveSound();
      },
      refetchStore: () => {},
      updateTargetELO: (elo) => set((state) => ({ 
        ...state,
        targetELO: elo 
      })),
      addGameResult: (result) => set((state) => ({
        ...state,
        gameResults: [...state.gameResults, { ...result, date: new Date().toISOString() }]
      })),
      updateKingMoved: (color) => set((state) => ({
        ...state,
        kingCheckOrMoved: {
          ...state.kingCheckOrMoved,
          [color]: true
        }
      })),
      updateRookMoved: (color, side) => set((state) => ({
        ...state,
        rookMoved: {
          ...state.rookMoved,
          [color]: {
            ...state.rookMoved[color],
            [side]: true
          }
        }
      })),
      setHintArrow: (from: string, to: string) => {
        set({ hintArrow: [from, to] });
      },
      clearHintArrow: () => {
        set({ hintArrow: null });
      },
      getFen: () => {
        const state = get();
        const board = state.board;
        let fen = '';
        let emptyCount = 0;

        for (let row = 0; row < 8; row++) {
          if (row > 0) fen += '/';
          for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece === null) {
              emptyCount++;
            } else {
              if (emptyCount > 0) {
                fen += emptyCount;
                emptyCount = 0;
              }
              fen += piece;
            }
          }
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
        }

        fen += ' ' + (state.currentPlayer === 'white' ? 'w' : 'b');

        let castling = '';
        if (!state.kingCheckOrMoved.white && !state.rookMoved.white.right) castling += 'K';
        if (!state.kingCheckOrMoved.white && !state.rookMoved.white.left) castling += 'Q';
        if (!state.kingCheckOrMoved.black && !state.rookMoved.black.right) castling += 'k';
        if (!state.kingCheckOrMoved.black && !state.rookMoved.black.left) castling += 'q';
        fen += ' ' + (castling || '-');

        fen += ' -';

        fen += ' ' + state.fiftyMoveRuleCounter;

        fen += ' ' + state.numberOfFullMoves;

        return fen;
      },
    }),
    {
      name: 'chess-store',
    }
  )
) 

const hasValidMoves = (board: Board, player: Player) => {
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (!piece) continue;
      
      const isPieceWhite = piece === piece.toUpperCase();
      if ((player === "white" && !isPieceWhite) || (player === "black" && isPieceWhite)) continue;

      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          if (isMovePossible(board, fromRow, fromCol, toRow, toCol, player)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};