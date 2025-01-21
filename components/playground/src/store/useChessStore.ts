import { getDB, STORE_NAME, getSessionStoreName } from "../lib/indexdb/initial";
import { PieceColor, PieceType } from "../types/chess";
import { checkCastling } from "../utils/castle";
import { CheckEnpassant } from "../utils/enpassant";
import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "../utils/initialSetup";
import { isCheckMate, isKingInCheck } from "../utils/kingCheck";
import { playMoveSound } from "../utils/playSound";
import { isMovePossible } from "../utils/possibleMove";
import { promotePawn } from "../utils/promotePawn";
import { ConvertBoardToFEN } from "../utils/stock-services/FENconverter";
import { GetBestMove } from "../utils/stock-services/service";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Piece = string | null;
export type Board = Piece[][];
export type CheckState = "white" | "black" | "noCheck";
export type RookMoved = { 
  white: { left: boolean; right: boolean }; 
  black: { left: boolean; right: boolean } 
};
export type KingCheckOrMoved = {
  white: boolean;
  black: boolean;
};
export type CheckMateState = "checkMate" | "noCheckMate" | "draw" | "stalemate";

interface ChessState {
  board: Board;
  currentPlayer: "white" | "black";
  lastMove: { type: string; fromRow: number; fromCol: number; toRow: number; toCol: number } | null;
  movingPiece: { type: string; fromRow: number; fromCol: number; toRow?: number; toCol?: number } | null;
  kingCheckOrMoved: KingCheckOrMoved;
  rookMoved: RookMoved;
  isKingInCheck: CheckState;
  isCheckMate: CheckMateState;
  computer: PieceColor | null;
  stockfishLevel: number;
  fiftyMoveRuleCounter: number;
  numberOfFullMoves: number;
  eliminatedPieces: { white: string[]; black: string[] };
  historyIndex: number;
  canPromotePawn: { row: number; col: number } | null;
  targetELO: number;
  setTargetELO: (elo: number) => void;
  
  // Methods
  movePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  isValidMove: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
  promotePawn: (row: number, col: number, newPiece: string) => void;
  saveMove: (nextState: string) => Promise<void>;
  undoMove: () => Promise<void>;
  redoMove: () => Promise<void>;
  computerMove: (nextState: ChessState) => Promise<void>;
  updateComputer: (color: PieceColor | null) => void;
  updateStockfishLevel: (level: number) => void;
  refetchStore: () => void;
}

const generateStoreId = () => {
  if (typeof window === 'undefined') return 'default';
  const tabId = window.sessionStorage.getItem('chess-tab-id');
  if (!tabId) {
    const newTabId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    window.sessionStorage.setItem('chess-tab-id', newTabId);
    return newTabId;
  }
  return tabId;
};

export const useChessStore = create(
  persist<ChessState>(
    (set, get) => ({
      board: initialBoard,
      currentPlayer: "white",
      lastMove: null,
      movingPiece: null,
      kingCheckOrMoved: {
        white: false,
        black: false,
      } as KingCheckOrMoved,
      rookMoved: initialRookMoved,
      isKingInCheck: "noCheck",
      isCheckMate: "noCheckMate",
      computer: null,
      stockfishLevel: 1,
      fiftyMoveRuleCounter: 0,
      numberOfFullMoves: 0,
      eliminatedPieces: { white: [], black: [] },
      historyIndex: -1,
      canPromotePawn: null,
      targetELO: 1500,
      setTargetELO: (elo) => set((state) => ({ ...state, targetELO: elo })),

      // Action to move a piece
      movePiece: (fromRow, fromCol, toRow, toCol) => {
        const { board, currentPlayer, isValidMove, lastMove, computer } = get();
        const state = get();
        if (!isValidMove(fromRow, fromCol, toRow, toCol)) return false;

        const newBoard = board.map((row) => [...row]);
        const piece = newBoard[fromRow][fromCol];
        let capturedPiece = null;

        // Handle regular captures
        if (newBoard[toRow][toCol]) {
          capturedPiece = newBoard[toRow][toCol];
        }

        // Handle en passant captures
        if (lastMove && CheckEnpassant(newBoard, { fromRow, fromCol, toRow, toCol }, lastMove)) {
          capturedPiece = newBoard[lastMove.toRow][lastMove.toCol];
          newBoard[lastMove.toRow][lastMove.toCol] = null;
        }

        // Make the move
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        let OpponentKingCheck = false;
        if (isKingInCheck(newBoard as (PieceType | null)[][], currentPlayer === "white" ? "black" : "white")) {
          OpponentKingCheck = true;
        }

        // Handle captured pieces
        const newEliminatedPieces = { ...state.eliminatedPieces };
        if (capturedPiece) {
          const captureColor = capturedPiece === capturedPiece.toUpperCase() ? 'white' : 'black';
          newEliminatedPieces[captureColor] = [...newEliminatedPieces[captureColor], capturedPiece];
        }

        // Update rook moved state for castling
        if (piece?.toUpperCase() === 'R') {
          const isWhite = piece === 'R';
          const isLeftRook = fromCol === 0;
          const isRightRook = fromCol === 7;
          
          if (isLeftRook || isRightRook) {
            set(state => ({
              ...state,
              rookMoved: {
                ...state.rookMoved,
                [isWhite ? 'white' : 'black']: {
                  ...state.rookMoved[isWhite ? 'white' : 'black'],
                  [isLeftRook ? 'left' : 'right']: true
                }
              }
            }));
          }
        }

        // Handle castling move
        if (piece?.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2) {
          const isKingside = toCol === 6;
          const row = currentPlayer === 'white' ? 7 : 0;
          const rookFromCol = isKingside ? 7 : 0;
          const rookToCol = isKingside ? 5 : 3;
          
          // Move the rook
          newBoard[row][rookToCol] = newBoard[row][rookFromCol];
          newBoard[row][rookFromCol] = null;
        }

        // Update state immediately
        set({
          board: newBoard,
          currentPlayer: currentPlayer === "white" ? "black" : "white",
          lastMove: { type: piece!, fromRow, fromCol, toRow, toCol },
          movingPiece: { type: piece!, fromRow, fromCol, toRow, toCol },
          eliminatedPieces: newEliminatedPieces,
          historyIndex: state.historyIndex + 1,
          isKingInCheck: OpponentKingCheck
            ? currentPlayer === "white"
              ? "black"
              : "white"
            : "noCheck",
        });

        playMoveSound();

        // Save state after update
        get().saveMove(JSON.stringify({
          ...state,
          board: newBoard,
          currentPlayer: currentPlayer === "white" ? "black" : "white",
          lastMove: { type: piece!, fromRow, fromCol, toRow, toCol },
          movingPiece: { type: piece!, fromRow, fromCol, toRow, toCol },
          eliminatedPieces: newEliminatedPieces,
          historyIndex: state.historyIndex + 1,
          isKingInCheck: OpponentKingCheck
            ? currentPlayer === "white"
              ? "black"
              : "white"
            : "noCheck",
        }));

        return true;
      },

      // Check if the move is valid
      isValidMove: (fromRow, fromCol, toRow, toCol) => {
        const { board, currentPlayer, kingCheckOrMoved, rookMoved } = get();
        if (
          !Number.isInteger(fromRow) ||
          !Number.isInteger(fromCol) ||
          !Number.isInteger(toRow) ||
          !Number.isInteger(toCol)
        )
          return false;

        const newBoard = board.map((row) => [...row]);
        const piece = newBoard[fromRow][fromCol];
        if (!piece) return false;

        const isWhitePiece = piece === piece.toUpperCase();
        console.log("over here", piece);
        if (
          (currentPlayer === "white" && !isWhitePiece) ||
          (currentPlayer === "black" && isWhitePiece)
        )
          return false;

        const temp = isMovePossible(
          newBoard as (PieceType | null)[][],
          fromRow,
          fromCol,
          toRow,
          toCol,
          currentPlayer,
          get().lastMove,
          rookMoved,
          kingCheckOrMoved
        );

        return temp;
      },

      // Promote Pawn
      promotePawn: (row, col, newPiece) => {
        const { board, currentPlayer } = get();
        const newBoard = board.map((row) => [...row]);
        
        // Ensure proper case for the promoted piece
        const promotedPiece = currentPlayer === "black" 
          ? newPiece.toLowerCase() 
          : newPiece.toUpperCase();
        
        newBoard[row][col] = promotedPiece;

        // Update the state with all necessary fields
        set((state) => ({
          ...state, // Preserve other state
          board: newBoard,
          canPromotePawn: null,
          lastMove: {
            type: promotedPiece,
            fromRow: row,
            fromCol: col,
            toRow: row,
            toCol: col
          },
          movingPiece: null, // Reset moving piece
          isKingInCheck: isKingInCheck(newBoard as (PieceType | null)[][], currentPlayer)
            ? currentPlayer === "white"
              ? "white"
              : "black"
            : "noCheck",
          currentPlayer: currentPlayer === "white" ? "black" : "white", // Switch player after promotion
          historyIndex: state.historyIndex + 1 // Increment history index
        }));

        // Play move sound for better user feedback
        playMoveSound();
      },

      // Save state of the board
      saveMove: async (nextState: string) => {
        const state = JSON.parse(nextState);
        const db = await getDB();
        const storeName = getSessionStoreName();
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        await store.put({
          id: state.historyIndex,
          state: nextState,
          timestamp: Date.now(),
        });
      },

      undoMove: async () => {
        const { historyIndex } = get();
        if (historyIndex - 1 < 0) {
          get().refetchStore();
          return;
        }

        const db = await getDB();
        const storeName = getSessionStoreName();
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const previousMove = await store.get(historyIndex - 1);
        if (!previousMove) return;

        const previousState = JSON.parse(previousMove.state);
        set(previousState);
      },

      redoMove: async () => {
        const { historyIndex } = get();

        const db = await getDB();
        const storeName = getSessionStoreName();
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const nextMove = await store.get(historyIndex + 1);
        if (!nextMove) return;

        const nextState = JSON.parse(nextMove.state);
        set(nextState);
      },

      computerMove: async (nextState: ChessState) => {
        const {
          board,
          lastMove,
          rookMoved,
          kingCheckOrMoved,
          fiftyMoveRuleCounter,
          numberOfFullMoves,
          computer,
        } = nextState;
        
        const compColor: PieceColor = computer || "white";
        
        const FEN = ConvertBoardToFEN(
          board,
          compColor,
          lastMove,
          rookMoved as RookMoved,
          kingCheckOrMoved,
          numberOfFullMoves,
          fiftyMoveRuleCounter
        );

        const move = await GetBestMove(FEN, get().stockfishLevel);
        get().movePiece(move.prevX, move.prevY, move.newX, move.newY);
      },

      updateComputer: (color: PieceColor | null) => {
        set({ computer: color });
      },

      updateStockfishLevel: (level: number) => {
        set({ stockfishLevel: level });
      },

      refetchStore: () => {
        set({
          board: initialBoard,
          currentPlayer: "white",
          lastMove: null,
          movingPiece: null,
          kingCheckOrMoved: {
            white: false,
            black: false,
          } as KingCheckOrMoved,
          rookMoved: initialRookMoved,
          isKingInCheck: "noCheck",
          isCheckMate: "noCheckMate",
          eliminatedPieces: { white: [], black: [] },
          historyIndex: -1,
          computer: null,
          fiftyMoveRuleCounter: 0,
          numberOfFullMoves: 0,
        });

        // Clear IndexedDB store
        getDB().then(db => {
          const storeName = getSessionStoreName();
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          store.clear();
        }).catch(console.error);

        localStorage.removeItem(`chess-store-${generateStoreId()}`);
      },
    }),
    {
      name: `chess-store-${generateStoreId()}`,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
