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

// Add this helper function at the top level
function mapELOToStockfishSettings(elo: number, tournamentMode: boolean = false): { depth: number; randomness: number } {
  // Tournament mode for maximum strength
  if (tournamentMode && elo >= 2800) {
    return { depth: 15, randomness: 0.0 }; // Tournament strength
  }

  // Regular mode with optimized performance
  if (elo <= 250) return { depth: 1, randomness: 1.0 };        // Complete beginner
  else if (elo <= 400) return { depth: 1, randomness: 0.95 };  // Just learned rules
  else if (elo <= 600) return { depth: 2, randomness: 0.90 };  // Starting to think
  else if (elo <= 800) return { depth: 2, randomness: 0.85 };  // Basic understanding
  else if (elo <= 1000) return { depth: 3, randomness: 0.80 }; // Developing player
  else if (elo <= 1200) return { depth: 4, randomness: 0.70 }; // Casual player
  else if (elo <= 1400) return { depth: 5, randomness: 0.60 }; // Club player
  else if (elo <= 1600) return { depth: 6, randomness: 0.50 }; // Strong club player
  else if (elo <= 1800) return { depth: 8, randomness: 0.40 }; // Expert
  else if (elo <= 2000) return { depth: 10, randomness: 0.30 }; // Candidate Master
  else if (elo <= 2200) return { depth: 12, randomness: 0.20 }; // Master
  else if (elo <= 2400) return { depth: 14, randomness: 0.15 }; // International Master
  else if (elo <= 2600) return { depth: 16, randomness: 0.10 }; // Grandmaster
  else return { depth: 18, randomness: 0.01 };                  // Super Grandmaster
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
      // Initial state
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

        // Check for pawn promotion BEFORE making the move
        const piece = state.board[fromRow][fromCol];
        if (!piece) return false;
        
        const isPawnPromotion = piece.toUpperCase() === 'P' && (toRow === 0 || toRow === 7);
        if (isPawnPromotion) {
          const newBoard = state.board.map(row => [...row]);
          // Move the pawn to the promotion square
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

        // Check for castling BEFORE making the move
        const isCastling = piece.toUpperCase() === 'K' && Math.abs(toCol - fromCol) === 2;
        if (isCastling) {
          const isKingSide = toCol === 6;
          const rookFromCol = isKingSide ? 7 : 0;
          const rookToCol = isKingSide ? 5 : 3;
          
          // Create new board for castling
          const newBoard = state.board.map(row => [...row]);
          
          // Move the king
          newBoard[toRow][toCol] = piece;
          newBoard[fromRow][fromCol] = null;
          
          // Move the rook
          const rook = newBoard[fromRow][rookFromCol];
          if (rook) {
            newBoard[fromRow][rookToCol] = rook;
            newBoard[fromRow][rookFromCol] = null;
            playCastlingSound();
            
            // Update state with castling move
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

        // Track king and rook movements for castling
        const isKing = piece.toUpperCase() === 'K';
        const isRook = piece.toUpperCase() === 'R';
        const isWhitePiece = piece === piece.toUpperCase();
        
        // Create new board for the move
        const newBoard = JSON.parse(JSON.stringify(state.board));
        const newEliminatedPieces = { ...state.eliminatedPieces };

        // Handle en passant capture BEFORE making the move
        let isEnPassant = false;
        if (state.lastMove && CheckEnpassant(state.board, { fromRow, fromCol, toRow, toCol }, state.lastMove)) {
          const capturedPawnRow = state.lastMove.toRow;
          const capturedPawnCol = state.lastMove.toCol;
          const capturedPawn = state.board[capturedPawnRow][capturedPawnCol];
          if (capturedPawn) {
            // Add captured pawn to the current player's eliminated pieces
            const capturedPawnColor = capturedPawn === capturedPawn.toUpperCase() ? 'white' : 'black';
            newEliminatedPieces[state.currentPlayer].push(capturedPawn);
            // Remove the captured pawn
            newBoard[capturedPawnRow][capturedPawnCol] = null;
            isEnPassant = true;
            playCaptureSound();
          }
        }

        // Make the move
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        // Update eliminated pieces if there's a regular capture
        const capturedPiece = state.board[toRow][toCol];
        if (capturedPiece && !isEnPassant) {
          // Add the captured piece to the appropriate list based on player color
          if (state.playerColor === 'black') {
            // Keep existing behavior for black player
            const capturedPieceColor = capturedPiece === capturedPiece.toUpperCase() ? 'white' : 'black';
            newEliminatedPieces[capturedPieceColor].push(capturedPiece);
          } else {
            // For white player, add captured pieces to black's list
            const capturedPieceColor = capturedPiece === capturedPiece.toUpperCase() ? 'white' : 'black';
            newEliminatedPieces[capturedPieceColor === 'white' ? 'black' : 'white'].push(capturedPiece);
          }
          playCaptureSound();
        }

        // Update king and rook movement tracking
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

        // Record the move
        const moveDetails: ChessMove = {
          type: piece,
          fromRow,
          fromCol,
          toRow,
          toCol,
        };

        // Check for checkmate or stalemate
        const nextPlayer = state.currentPlayer === "white" ? "black" : "white";
        const isInCheck = isKingInCheck(newBoard, nextPlayer);
        let gameResult: GameResult | null = null;

        if (isInCheck) {
          playCheckSound();
          // Check if it's checkmate
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
            // Set isCheckMate state
            set(state => ({
              ...state,
              isCheckMate: state.currentPlayer
            }));
          }
        } else {
          // Check for stalemate
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

        // Determine if move is a capture
        const isCapture = state.board[toRow][toCol] !== null;

        // Play sound effects
        if (!isEnPassant && !isCapture) {
          playMoveSound();
        }

        // Record move in algebraic notation
        const moveText = get().recordMove(fromRow, fromCol, toRow, toCol, piece, isCapture || isEnPassant);

        // Update game state
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

        // If it's computer's turn, schedule the computer move
        if (state.computer === nextPlayer && !gameResult) {
          setTimeout(() => {
            get().computerMove();
          }, 2000); // Increased delay for computer moves
        }

        return true;
      },

      isValidMove: (fromRow, fromCol, toRow, toCol) => {
        const state = get();
        
        // Get the piece that's moving
        const piece = state.board[fromRow][fromCol];
        if (!piece) {
          return false;
        }
        
        // Get piece color
        const isPieceWhite = piece === piece.toUpperCase();
        
        // If it's computer's turn, allow only computer moves
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
        
        // If it's player's turn, verify piece ownership
        const isPlayerPiece = (state.playerColor === 'white' && isPieceWhite) || 
                            (state.playerColor === 'black' && !isPieceWhite);
        if (!isPlayerPiece) {
          return false;
        }

        // Check if it's the correct player's turn
        if ((state.currentPlayer === "white" && !isPieceWhite) || 
            (state.currentPlayer === "black" && isPieceWhite)) {
          return false;
        }

        // Check if move is possible according to chess rules
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
          // Pawn moves
          moveText = isCapture ? fromSquare[0] + 'x' + toSquare : toSquare;
        } else {
          // Piece moves
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
        // Preserve the selected character and opponent name
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

        // If computer is white, trigger its move immediately
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
        
        // Initialize all computer-related state in one place
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
          currentPlayer: 'white', // Game always starts with white
          isBoardFlipped: color === 'black', // Flip board when playing as black
          selectedCharacter: defaultCharacter,
          opponentName: defaultCharacter.name,
          targetELO: defaultCharacter.elo
        });
      },

      setColorSelectionOpen: (isOpen: boolean) => set({ isColorSelectionOpen: isOpen }),

      promotePawn: (row: number, col: number, piece: PieceType) => {
        const state = get();
        const board = state.board.map(row => [...row]);
        
        // Promote the pawn
        board[row][col] = piece;
        
        // Update the board history and move history
        const newBoardHistory = [...state.boardHistory, board];
        const newMoveHistory = [...state.moveHistory];
        if (state.lastMove) {
          // Create a new move that represents the promotion
          newMoveHistory.push({
            type: piece,
            fromRow: row,
            fromCol: col,
            toRow: row,
            toCol: col
          });
        }

        // Check for check/checkmate in the new position
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

        // Play sound and trigger computer's move if needed
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

        // Add initial delay before computer starts thinking
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
          const fen = boardToFen(state.board, state);
          const stockfish = getStockfishService();
          
          // Wait for Stockfish to be ready
          await stockfish.waitReady();
          
          // Get the best move using current settings
          const move = await stockfish.getBestMove(
            fen,
            state.stockfishSettings.depth,
            state.stockfishSettings.randomness
          );

          if (!move) {
            return;
          }

          // Parse the move string (e.g., "e7e8q" for queen promotion)
          const fromCol = move.charCodeAt(0) - 'a'.charCodeAt(0);
          const fromRow = 8 - parseInt(move[1]);
          const toCol = move.charCodeAt(2) - 'a'.charCodeAt(0);
          const toRow = 8 - parseInt(move[3]);
          
          // Make the move
          get().movePiece(fromRow, fromCol, toRow, toCol);

          // If this was a promotion move (move string has 5th character)
          if (move.length === 5) {
            // Map promotion piece character to actual piece
            const promotionMap: { [key: string]: PieceType } = {
              'q': state.computer === 'white' ? 'Q' : 'q',
              'r': state.computer === 'white' ? 'R' : 'r',
              'b': state.computer === 'white' ? 'B' : 'b',
              'n': state.computer === 'white' ? 'N' : 'n'
            };
            
            const promotionPiece = promotionMap[move[4]];
            if (promotionPiece) {
              // Automatically promote the pawn to the chosen piece
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