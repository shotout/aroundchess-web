import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Chess } from 'chess.js';
import { isKingInCheck } from '../utils/kingCheck';
import { isMovePossible, hasAnyValidMoves } from '../utils/possibleMove';
import { getStockfishService } from '@/lib/stockfish/stockfish-service';
import { GameResult } from '../types/chess';
import { 
  playMoveSound, 
  playCaptureSound, 
  playCastlingSound, 
  playCheckSound, 
  playCheckmateSound,
  playPromoteSound
} from "@/components/playground/src/utils/playSound";
import { Player, Board, PieceType } from '../types/chess';
import { ChessMove, ComputerChessStoreState } from '../types/computer-chess';
import { initialBoard } from '../lib/playground/initial-setup';
import { boardToFen } from '../utils/boardToFen';
import { generateMoveNotation } from '../utils/generateMoveNotation';
import { CheckEnpassant } from '../utils/enpassant';

function mapELOToStockfishSettings(elo: number, tournamentMode: boolean = false): { depth: number; randomness: number } {
  if (tournamentMode && elo >= 2800) {
    return { depth: 15, randomness: 0.0 };
  }

  if (elo <= 250) return { depth: 1, randomness: 1.0 };
  else if (elo <= 400) return { depth: 1, randomness: 0.95 };
  else if (elo <= 600) return { depth: 2, randomness: 0.90 };
  else if (elo <= 800) return { depth: 2, randomness: 0.85 };
  else if (elo <= 1000) return { depth: 3, randomness: 0.80 };
  else if (elo <= 1200) return { depth: 4, randomness: 0.70 };
  else if (elo <= 1400) return { depth: 5, randomness: 0.60 };
  else if (elo <= 1600) return { depth: 6, randomness: 0.50 };
  else if (elo <= 1800) return { depth: 8, randomness: 0.40 };
  else if (elo <= 2000) return { depth: 10, randomness: 0.30 };
  else if (elo <= 2200) return { depth: 12, randomness: 0.20 };
  else if (elo <= 2400) return { depth: 14, randomness: 0.15 };
  else if (elo <= 2600) return { depth: 16, randomness: 0.10 };
  else return { depth: 18, randomness: 0.01 };
}

interface Character {
  id: string;
  name: string;
  title: string;
  elo: number;
  gender: 'male' | 'female';
  avatarNumber: number;
}

const useComputerChessStore = create<ComputerChessStoreState>()(
  persist(
    (set, get) => ({
      board: initialBoard,
      currentPlayer: "white" as Player,
      lastMove: null,
      movingPiece: null,
      kingCheckOrMoved: {
        white: false,
        black: false
      },
      rookMoved: {
        white: { left: false, right: false },
        black: { left: false, right: false }
      },
      isKingInCheck: "noCheck",
      isCheckMate: "noCheckMate",
      computer: null,
      stockfishLevel: 1,
      targetELO: 250,
      tournamentMode: false,
      stockfishSettings: { depth: 0, randomness: 1.0 },
      fiftyMoveRuleCounter: 0,
      numberOfFullMoves: 1,
      eliminatedPieces: { white: [], black: [] },
      historyIndex: 0,
      canPromotePawn: null,
      initialized: true,
      moves: [],
      moveHistory: [],
      boardHistory: [initialBoard],
      gameResults: [],
      isColorSelectionOpen: true,
      playerColor: 'white',
      isBoardFlipped: false,
      opponentName: 'Thomas',
      selectedCharacter: {
        id: '250-0',
        name: 'Thomas',
        title: '',
        elo: 250,
        gender: 'male',
        avatarNumber: 1
      },
      setOpponentName: (name: string) => set({ opponentName: name }),
      setSelectedCharacter: (character: Character | null) => {
        console.log('Store - Setting character:', character);
        set({ selectedCharacter: character });
      },
      getFen: () => {
        const state = get();
        return boardToFen(state.board, state);
      },

      movePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
        const state = get();
        
        if (!get().isValidMove(fromRow, fromCol, toRow, toCol)) {
          return false;
        }

        const piece = state.board[fromRow][fromCol];
        if (!piece) return false;
        
        const isPawnPromotion = piece.toUpperCase() === 'P' && (toRow === 0 || toRow === 7);
        if (isPawnPromotion) {
          const newBoard = state.board.map(row => [...row]);
          newBoard[toRow][toCol] = state.currentPlayer === "white" ? "P" : "p";
          newBoard[fromRow][fromCol] = null;
          
          set({
            ...state,
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

        const isCastling = piece.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2;
        if (isCastling) {
          const isKingSide = toCol === 6;
          const rookFromCol = isKingSide ? 7 : 0;
          const rookToCol = isKingSide ? 5 : 3;
          
          const newBoard = state.board.map(row => [...row]);
          
          newBoard[toRow][toCol] = piece;
          newBoard[fromRow][fromCol] = null;
          
          const rook = newBoard[fromRow][rookFromCol];
          if (rook) {
            newBoard[fromRow][rookToCol] = rook;
            newBoard[fromRow][rookFromCol] = null;
            playCastlingSound();
            
            set({
              board: newBoard,
              currentPlayer: state.currentPlayer === "white" ? "black" : "white",
              lastMove: {
                type: piece,
                fromRow,
                fromCol,
                toRow,
                toCol,
              },
              kingCheckOrMoved: {
                ...state.kingCheckOrMoved,
                [state.currentPlayer]: true
              },
              rookMoved: {
                ...state.rookMoved,
                [state.currentPlayer]: {
                  ...state.rookMoved[state.currentPlayer],
                  [isKingSide ? 'right' : 'left']: true
                }
              }
            });
            return true;
          }
        }

        const isKing = piece.toUpperCase() === 'K';
        const isRook = piece.toUpperCase() === 'R';
        const isWhitePiece = piece === piece.toUpperCase();
        
        const newBoard = JSON.parse(JSON.stringify(state.board));
        const newEliminatedPieces = { ...state.eliminatedPieces };

        let isEnPassant = false;
        if (state.lastMove && CheckEnpassant(state.board, { fromRow, fromCol, toRow, toCol }, state.lastMove)) {
          const capturedPawnRow = state.lastMove.toRow;
          const capturedPawnCol = state.lastMove.toCol;
          const capturedPawn = state.board[capturedPawnRow][capturedPawnCol];
          if (capturedPawn) {
            const capturedPawnColor = capturedPawn === capturedPawn.toUpperCase() ? 'white' : 'black';
            newEliminatedPieces[state.currentPlayer].push(capturedPawn);
            newBoard[capturedPawnRow][capturedPawnCol] = null;
            isEnPassant = true;
            playCaptureSound();
          }
        }

        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        const capturedPiece = state.board[toRow][toCol];
        if (capturedPiece && !isEnPassant) {
          if (state.playerColor === 'black') {
            const capturedPieceColor = capturedPiece === capturedPiece.toUpperCase() ? 'white' : 'black';
            newEliminatedPieces[capturedPieceColor].push(capturedPiece);
          } else {
            const capturedPieceColor = capturedPiece === capturedPiece.toUpperCase() ? 'white' : 'black';
            newEliminatedPieces[capturedPieceColor === 'white' ? 'black' : 'white'].push(capturedPiece);
          }
          playCaptureSound();
        }

        const newKingCheckOrMoved = { ...state.kingCheckOrMoved };
        const newRookMoved = { ...state.rookMoved };

        if (isKing) {
          newKingCheckOrMoved[isWhitePiece ? "white" : "black"] = true;
        }
        if (isRook) {
          const side = fromCol === 0 ? "left" : "right";
          const color = isWhitePiece ? "white" : "black";
          newRookMoved[color][side] = true;
        }

        const moveDetails: ChessMove = {
          type: piece,
          fromRow,
          fromCol,
          toRow,
          toCol,
        };

        const nextPlayer = state.currentPlayer === "white" ? "black" : "white";
        const isInCheck = isKingInCheck(newBoard, nextPlayer);
        let gameResult: GameResult | null = null;

        if (isInCheck) {
          playCheckSound();
          const hasValidMoves = hasAnyValidMoves(newBoard, nextPlayer);
          if (!hasValidMoves) {
            playCheckmateSound();
            gameResult = {
              id: crypto.randomUUID(),
              winner: state.currentPlayer,
              winnerName: state.currentPlayer === 'white' ? 'White' : 'Black',
              method: 'checkmate',
              date: new Date().toISOString(),
              moveCount: state.moves.length,
              duration: 0
            };
            set(state => ({
              ...state,
              isCheckMate: state.currentPlayer
            }));
          }
        } else {
          const hasValidMoves = hasAnyValidMoves(newBoard, nextPlayer);
          if (!hasValidMoves) {
            gameResult = {
              id: crypto.randomUUID(),
              winner: "draw",
              winnerName: "Draw",
              method: 'draw',
              date: new Date().toISOString(),
              moveCount: state.moves.length,
              duration: 0
            };
          }
        }

        const isCapture = state.board[toRow][toCol] !== null;

        if (!isEnPassant && !isCapture) {
          playMoveSound();
        }

        const moveText = get().recordMove(fromRow, fromCol, toRow, toCol, piece, isCapture || isEnPassant);

        set({
          board: newBoard,
          lastMove: moveDetails,
          currentPlayer: nextPlayer,
          moveHistory: [...(state.moveHistory || []), moveDetails],
          kingCheckOrMoved: newKingCheckOrMoved,
          rookMoved: newRookMoved,
          boardHistory: [...state.boardHistory, newBoard],
          isKingInCheck: isInCheck ? nextPlayer : "noCheck",
          gameResults: gameResult ? [...state.gameResults, gameResult] : state.gameResults,
          moves: [...state.moves, moveText],
          eliminatedPieces: newEliminatedPieces
        });

        if (state.computer === nextPlayer && !gameResult) {
          setTimeout(() => {
            get().computerMove();
          }, 2000);
        }

        return true;
      },

      isValidMove: (fromRow, fromCol, toRow, toCol) => {
        const state = get();
        
        const piece = state.board[fromRow][fromCol];
        if (!piece) {
          return false;
        }
        
        const isPieceWhite = piece === piece.toUpperCase();
        
        if (state.computer === state.currentPlayer) {
          const isComputerPiece = (state.computer === 'white' && isPieceWhite) ||
                                 (state.computer === 'black' && !isPieceWhite);
          if (!isComputerPiece) {
            return false;
          }
          return isMovePossible(
            state.board,
            fromRow,
            fromCol,
            toRow,
            toCol,
            state.currentPlayer,
            state.lastMove,
            state.rookMoved,
            state.kingCheckOrMoved
          );
        }
        
        const isPlayerPiece = (state.playerColor === 'white' && isPieceWhite) || 
                            (state.playerColor === 'black' && !isPieceWhite);
        if (!isPlayerPiece) {
          return false;
        }

        if ((state.currentPlayer === "white" && !isPieceWhite) || 
            (state.currentPlayer === "black" && isPieceWhite)) {
          return false;
        }

        return isMovePossible(
          state.board,
          fromRow,
          fromCol,
          toRow,
          toCol,
          state.currentPlayer,
          state.lastMove,
          state.rookMoved,
          state.kingCheckOrMoved
        );
      },

      recordMove: (fromRow: number, fromCol: number, toRow: number, toCol: number, piece: string, isCapture: boolean) => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        
        const fromSquare = files[fromCol] + ranks[fromRow];
        const toSquare = files[toCol] + ranks[toRow];
        
        let moveText = '';
        
        if (piece.toUpperCase() === 'P') {
          moveText = isCapture ? fromSquare[0] + 'x' + toSquare : toSquare;
        } else {
          moveText = piece.toUpperCase() + (isCapture ? 'x' : '') + toSquare;
        }
        
        return moveText;
      },

      addMove: (move: string) => {
        set((state) => ({
          ...state,
          moves: [...state.moves, move]
        }));
      },

      resetGame: () => set((state) => ({
        board: initialBoard,
        currentPlayer: "white" as Player,
        lastMove: null,
        movingPiece: null,
        kingCheckOrMoved: {
          white: false,
          black: false
        },
        rookMoved: {
          white: { left: false, right: false },
          black: { left: false, right: false }
        },
        isKingInCheck: "noCheck",
        isCheckMate: "noCheckMate",
        computer: null,
        stockfishSettings: mapELOToStockfishSettings(state.targetELO, state.tournamentMode),
        fiftyMoveRuleCounter: 0,
        numberOfFullMoves: 1,
        eliminatedPieces: { white: [], black: [] },
        historyIndex: 0,
        canPromotePawn: null,
        initialized: true,
        moves: [],
        moveHistory: [],
        boardHistory: [initialBoard],
        gameResults: [],
        isColorSelectionOpen: true,
        playerColor: 'white',
        isBoardFlipped: false,
        selectedCharacter: {
          id: '250-0',
          name: 'Thomas',
          title: '',
          elo: 250,
          gender: 'male',
          avatarNumber: 1
        },
        opponentName: 'Thomas'
      })),

      undoMove: () => {
        const state = get();
        if (state.historyIndex > 0) {
          set({
            board: state.boardHistory[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1,
            currentPlayer: state.currentPlayer === "white" ? "black" : "white",
            lastMove: null,
            movingPiece: null,
          });
        }
      },

      redoMove: () => {
        const state = get();
        if (state.historyIndex < state.boardHistory.length - 1) {
          set({
            board: state.boardHistory[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1,
            currentPlayer: state.currentPlayer === "white" ? "black" : "white",
            lastMove: null,
            movingPiece: null,
          });
        }
      },

      updateComputer: (color: Player | null) => {
        const state = get();
        set({
          ...state,
          computer: color,
          stockfishSettings: mapELOToStockfishSettings(state.targetELO, state.tournamentMode)
        });

        if (color === "white") {
          const updatedState = get();
          updatedState.computerMove();
        }
      },

      toggleTournamentMode: () => {
        const state = get();
        const newTournamentMode = !state.tournamentMode;
        const newSettings = mapELOToStockfishSettings(state.targetELO, newTournamentMode);
        
        set(state => ({
          ...state,
          tournamentMode: newTournamentMode,
          stockfishSettings: newSettings,
          ...newSettings
        }));
      },

      updateTargetELO: (elo: number) => {
        const state = get();
        const settings = mapELOToStockfishSettings(elo, state.tournamentMode);
        set(state => ({
          ...state,
          targetELO: elo,
          stockfishSettings: settings,
          ...settings
        }));
      },

      setPlayerColor: (color: 'white' | 'black') => {
        console.log('Store - Setting player color:', color);
        const computer = color === 'white' ? 'black' : 'white';
        console.log('Store - Computer color will be:', computer);
        
        const defaultCharacter: Character = {
          id: '250-0',
          name: 'Thomas',
          title: '',
          elo: 250,
          gender: 'male',
          avatarNumber: 1
        };
        
        set({ 
          playerColor: color,
          computer,
          currentPlayer: 'white',
          isBoardFlipped: color === 'black',
          selectedCharacter: defaultCharacter,
          opponentName: defaultCharacter.name,
          targetELO: defaultCharacter.elo
        });
      },

      setColorSelectionOpen: (isOpen: boolean) => set({ isColorSelectionOpen: isOpen }),

      promotePawn: (row: number, col: number, piece: PieceType) => {
        const state = get();
        const board = state.board.map(row => [...row]);
        
        board[row][col] = piece;
        
        const newBoardHistory = [...state.boardHistory, board];
        const newMoveHistory = [...state.moveHistory];
        if (state.lastMove) {
          newMoveHistory.push({
            type: piece,
            fromRow: row,
            fromCol: col,
            toRow: row,
            toCol: col
          });
        }

        const nextPlayer = state.currentPlayer === "white" ? "black" : "white";
        const isInCheck = isKingInCheck(board, nextPlayer);
        
        set({
          ...state,
          board,
          canPromotePawn: null,
          currentPlayer: nextPlayer,
          boardHistory: newBoardHistory,
          moveHistory: newMoveHistory,
          isKingInCheck: isInCheck ? nextPlayer : "noCheck",
          historyIndex: newBoardHistory.length - 1
        });

        playPromoteSound();
        if (state.computer === nextPlayer) {
          setTimeout(() => {
            get().computerMove();
          }, 500);
        }
      },

      computerMove: async () => {
        const state = get();
        
        if (!state.computer || state.currentPlayer !== state.computer || state.isCheckMate !== "noCheckMate") {
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        try {
          const fen = boardToFen(state.board, state);
          const stockfish = getStockfishService();
          
          await stockfish.waitReady();
          
          const move = await stockfish.getBestMove(
            fen,
            state.stockfishSettings.depth,
            state.stockfishSettings.randomness
          );

          if (!move) {
            return;
          }

          const fromCol = move.charCodeAt(0) - 'a'.charCodeAt(0);
          const fromRow = 8 - parseInt(move[1]);
          const toCol = move.charCodeAt(2) - 'a'.charCodeAt(0);
          const toRow = 8 - parseInt(move[3]);
          
          get().movePiece(fromRow, fromCol, toRow, toCol);

          if (move.length === 5) {
            const promotionMap: { [key: string]: PieceType } = {
              'q': state.computer === 'white' ? 'Q' : 'q',
              'r': state.computer === 'white' ? 'R' : 'r',
              'b': state.computer === 'white' ? 'B' : 'b',
              'n': state.computer === 'white' ? 'N' : 'n'
            };
            
            const promotionPiece = promotionMap[move[4]];
            if (promotionPiece) {
              get().promotePawn(toRow, toCol, promotionPiece);
            }
          }
        } catch (error) {
          console.error('Error in computer move:', error);
        }
      },
    }),
    {
      name: "computer-chess-store",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export { useComputerChessStore, mapELOToStockfishSettings };
export type { Player, ChessMove };