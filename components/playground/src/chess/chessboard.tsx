"use client"

import { useChessStore } from "../store/playground/chess-store"
import { ChessPiece } from "./chess-piece"
import { useState, useEffect, useRef, useCallback } from "react"
import useStore from "../lib/hooks/useStore"
import { initialBoard } from "../lib/playground/initial-setup"
import { LoadingBoard } from "./loading-board"
import { useThemeStore } from "../store/playground/theme-store"
import type { Board, ChessState } from "../types/chess"
import { cn } from "../lib/utils"
import debounce from 'lodash/debounce';
import { playIncorrectMoveSound } from "../utils/playSound"
import { CheckEnpassant } from "../utils/enpassant"

interface MoveDetails {
  piece: string
  fromSquare: string
  toSquare: string
  capture: boolean
  check: boolean
  checkmate: boolean
}

interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  recorded?: boolean;
  type?: string;
}

interface ChessBoardProps {
  isFlipped?: boolean;
  showHints?: boolean;
  onCapture?: (piece: string, color: 'white' | 'black') => void;
  customArrows?: [string, string, string][];
}

export default function ChessBoard({ isFlipped = false, showHints = false, onCapture, customArrows }: ChessBoardProps) {
  const { boardTheme } = useThemeStore((state) => state);
  const store = useStore(useChessStore, (state) => state);
  const isLoading = !store;
  const {
    board,
    movePiece,
    isValidMove,
    isKingInCheck,
    currentPlayer,
    lastMove,
    movingPiece,
    isCheckMate,
    hintArrow,
  } = store! || {
    board: initialBoard,
    movePiece: () => false,
    isValidMove: () => false,
    isKingInCheck: "noCheck" as const,
    currentPlayer: "white" as const,
    isCheckMate: "noCheckMate" as const,
    hintArrow: null,
  };
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const moveProcessedRef = useRef<{[key: string]: boolean}>({});
  const [arrowProps, setArrowProps] = useState({
    tailWidth: window.innerWidth <= 430 ? 0.2 : 5,
    headWidth: window.innerWidth <= 430 ? 0.001 : 12,
    triangleHeight: window.innerWidth <= 430 ? 0.001 : 12,
  });

  useEffect(() => {
    const updateArrowSize = () => {
      setArrowProps({
        tailWidth: window.innerWidth <= 430 ? 0.2 : 5,
        headWidth: window.innerWidth <= 430 ? 0.001 : 12,
        triangleHeight: window.innerWidth <= 430 ? 0.001 : 12,
      });
    };

    window.addEventListener('resize', updateArrowSize);
    return () => window.removeEventListener('resize', updateArrowSize);
  }, []);

  const debouncedStateUpdate = useCallback(
    debounce((move: Move, piece: string, player: "white" | "black") => {
      useChessStore.setState(state => {
        const newState = { ...state };
        
        if (move && !state.lastMove?.recorded) {
          recordMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
          newState.lastMove = { 
            ...move, 
            type: move.type || piece,
            recorded: true 
          };
        }

        if (piece?.toUpperCase() === 'K') {
          newState.kingCheckOrMoved = {
            ...state.kingCheckOrMoved,
            [player]: true
          };
        } else if (piece?.toUpperCase() === 'R') {
          const side = move.fromCol === 0 ? 'left' : 'right';
          newState.rookMoved = {
            ...state.rookMoved,
            [player]: {
              ...state.rookMoved[player],
              [side]: true
            }
          };
        }

        return newState;
      });
    }, 100),
    []
  );

  // Add drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    
    // Add visual feedback for valid drop targets
    if (selectedPiece) {
      const positionData = target.dataset.position?.split(',').map(Number);
      // Validate coordinates
      if (!positionData || positionData.length !== 2 || 
          isNaN(positionData[0]) || isNaN(positionData[1]) ||
          positionData[0] < 0 || positionData[0] > 7 ||
          positionData[1] < 0 || positionData[1] > 7) {
        target.style.boxShadow = '';
        return;
      }
      const [row, col] = positionData;
      
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        target.style.boxShadow = 'inset 0 0 0 3px rgba(52, 211, 153, 0.7)'; // Emerald green ring
      } else {
        target.style.boxShadow = ''; // No visual feedback for invalid moves
      }
    }
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Reset visual feedback
    const target = e.currentTarget;
    target.style.boxShadow = '';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    toRow: number,
    toCol: number
  ) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.style.boxShadow = '';
    
    const coords = e.dataTransfer
      .getData("text")
      .split(",")
      .map(Number);

    // Validate coordinates
    if (coords.length !== 2 || 
        isNaN(coords[0]) || 
        isNaN(coords[1]) || 
        coords[0] < 0 || 
        coords[0] > 7 || 
        coords[1] < 0 || 
        coords[1] > 7) {
      return;
    }

    const [fromRow, fromCol] = coords;
      
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
      // Check if there's a piece being captured
      const capturedPiece = board[toRow][toCol];
      if (capturedPiece && onCapture) {
        // If the captured piece is uppercase, it's white
        const isWhitePiece = capturedPiece === capturedPiece.toUpperCase();
        onCapture(capturedPiece, isWhitePiece ? 'white' : 'black');
      }
      movePiece(fromRow, fromCol, toRow, toCol);
      setSelectedPiece(null);
    } else {
      playIncorrectMoveSound();
    }
  };

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    const piece = board[rowIndex][colIndex];
    const isPieceWhite = piece ? piece === piece.toUpperCase() : false;
    const isCurrentPlayersPiece = piece && ((currentPlayer === "white" && isPieceWhite) || 
                                        (currentPlayer === "black" && !isPieceWhite));

    // Case 1: We have a selected piece
    if (selectedPiece) {
      if (isValidMove(selectedPiece.row, selectedPiece.col, rowIndex, colIndex)) {
        // Check if there's a piece being captured
        const capturedPiece = board[rowIndex][colIndex];
        if (capturedPiece && onCapture) {
          // If the captured piece is uppercase, it's white
          const isWhitePiece = capturedPiece === capturedPiece.toUpperCase();
          onCapture(capturedPiece, isWhitePiece ? 'white' : 'black');
        }
        movePiece(selectedPiece.row, selectedPiece.col, rowIndex, colIndex);
      } else {
        playIncorrectMoveSound();
      }
      setSelectedPiece(null);
      return;
    }

    // Case 2: No selected piece, clicking on our own piece
    if (isCurrentPlayersPiece) {
      setSelectedPiece({ row: rowIndex, col: colIndex });
    } else if (piece) {
      playIncorrectMoveSound();
    }
  };

  // Remove selected piece when current player changes
  useEffect(() => {
    setSelectedPiece(null);
  }, [currentPlayer]);

  const recordMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = board[fromRow][fromCol];
    if (piece) {
      const moveDetails = getMoveNotation(fromRow, fromCol, toRow, toCol, piece);
      const moveNotation = `${moveDetails.piece}${moveDetails.fromSquare}${moveDetails.capture ? 'x' : ''}${moveDetails.toSquare}${moveDetails.checkmate ? '#' : moveDetails.check ? '+' : ''}`;
      
      // Add move to history
      useChessStore.getState().addMove(moveNotation);
    }
  };

  // Replace the existing move recording effect with this
  useEffect(() => {
    if (!lastMove || !board) return;
    
    const piece = board[lastMove.toRow][lastMove.toCol];
    if (!piece) return;
    
    debouncedStateUpdate(lastMove, piece, currentPlayer);
    
  }, [lastMove, board, debouncedStateUpdate, currentPlayer]);

  // Add this helper function to determine if a piece is the king in check
  const isKingInCheckAtPosition = (row: number, col: number) => {
    const piece = board[row][col];
    if (!piece) return false;
    
    // Check if it's a king
    if (piece.toUpperCase() !== 'K') return false;
    
    // Check if it's the king that's in check
    const isWhiteKing = piece === 'K';
    return isKingInCheck === (isWhiteKing ? "white" : "black");
  };

  const getMoveNotation = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    piece: string
  ): MoveDetails => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const toSquare = `${files[toCol]}${8 - toRow}`;
    const capture = board[toRow][toCol] !== null;
    const check = isKingInCheck !== "noCheck";
    const checkmate = isCheckMate !== "noCheckMate";

    // Format piece notation correctly
    let pieceNotation = '';
    switch (piece.toUpperCase()) {
      case 'P': 
        return {
          piece: '',
          fromSquare: '',
          toSquare,
          capture,
          check: check && !checkmate,
          checkmate
        };
      case 'N': pieceNotation = 'N'; break;
      case 'B': pieceNotation = 'B'; break;
      case 'R': pieceNotation = 'R'; break;
      case 'Q': pieceNotation = 'Q'; break;
      case 'K': pieceNotation = 'K'; break;
      default: pieceNotation = '';
    }

    return {
      piece: pieceNotation,
      fromSquare: '',
      toSquare,
      capture,
      check: check && !checkmate,
      checkmate
    };
  };

  if (isLoading) return <LoadingBoard />;

  // Convert algebraic notation to coordinates
  const algebraicToCoords = (square: string): [number, number] => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square[1]);
    return [rank, file];
  }

  const customArrowProps = {
    color: "rgba(0, 0, 0, 0.8)",
    opacity: window.innerWidth <= 430 ? 0.5 : 0.8,
    showTail: true,
    ...arrowProps
  };

  return (
    <div className="relative w-full aspect-square">
      <div className="grid grid-cols-8 grid-rows-8 h-full w-full border-2 border-gray-800 rounded-lg relative">
        {/* Render arrows */}
        <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '100%', height: '100%' }}>
          <defs>
            {customArrows?.map(([_, __, color], index) => (
              <marker
                key={`arrowhead-${index}`}
                id={`arrowhead-${index}`}
                markerWidth="6"
                markerHeight="6"
                refX="0"
                refY="3"
                orient="auto-start-reverse"
                markerUnits="strokeWidth"
              >
                <polygon 
                  points="0 0, 6 3, 0 6"
                  fill={color}
                  opacity="0.8"
                />
              </marker>
            ))}
          </defs>
          {customArrows?.map(([from, to, color], index) => {
            const [fromRow, fromCol] = algebraicToCoords(from);
            const [toRow, toCol] = algebraicToCoords(to);
            
            // Calculate positions
            const squareSize = 100 / 8; // percentage
            const fromX = (fromCol + 0.5) * squareSize;
            const fromY = (fromRow + 0.5) * squareSize;
            const toX = (toCol + 0.5) * squareSize;
            const toY = (toRow + 0.5) * squareSize;
            
            // Calculate the direction vector
            const dx = toX - fromX;
            const dy = toY - fromY;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            // Adjust start and end points
            const startOffset = 4;    // percentage of square size
            const endOffset = 4;     // Adjusted for shorter arrow
            
            const adjustedFromX = fromX + (dx * startOffset / length);
            const adjustedFromY = fromY + (dy * startOffset / length);
            const adjustedToX = toX - (dx * endOffset / length);
            const adjustedToY = toY - (dy * endOffset / length);
            
            return (
              <g key={index}>
                <line
                  x1={`${adjustedFromX}%`}
                  y1={`${adjustedFromY}%`}
                  x2={`${adjustedToX}%`}
                  y2={`${adjustedToY}%`}
                  stroke={color}
                  strokeWidth="8"
                  opacity="0.8"
                  markerEnd={`url(#arrowhead-${index})`}
                />
              </g>
            );
          })}
        </svg>

        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isLastMove = lastMove && ((lastMove.fromRow === rowIndex && lastMove.fromCol === colIndex) || (lastMove.toRow === rowIndex && lastMove.toCol === colIndex));
            const isValidMoveTarget = selectedPiece && isValidMove(selectedPiece.row, selectedPiece.col, rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-position={`${rowIndex},${colIndex}`}
                style={{
                  backgroundColor: (rowIndex + colIndex) % 2 === 0 ? boardTheme.light : boardTheme.dark
                }}
                className={cn(
                  'w-full h-full relative',
                  selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex && 'ring-2 ring-blue-400 ring-inset',
                  lastMove?.fromRow === rowIndex && lastMove?.fromCol === colIndex && 'bg-blue-200/20',
                  lastMove?.toRow === rowIndex && lastMove?.toCol === colIndex && 'bg-blue-200/20'
                )}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              >
                {isValidMoveTarget && !piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Only show dot for valid moves */}
                    {isValidMove(selectedPiece.row, selectedPiece.col, rowIndex, colIndex) && (
                      <div className="w-5 h-5 rounded-full bg-gray-500 bg-opacity-50" />
                    )}
                  </div>
                )}
                {isValidMoveTarget && piece && (
                  <div className="absolute inset-0 ring-[10px] ring-gray-500 ring-opacity-50 ring-inset rounded-full" />
                )}
                {piece && (
                  <ChessPiece
                    type={piece}
                    position={{ row: rowIndex, col: colIndex }}
                    currentPlayer={currentPlayer}
                    highlight={isSelected}
                    setSelectedPiece={setSelectedPiece}
                    isInCheck={isKingInCheckAtPosition(rowIndex, colIndex)}
                    lastMove={lastMove}
                    movingPiece={movingPiece}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
      {/* Add the hint arrow */}
      {hintArrow && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <marker
                id="hintArrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <path
                  d="M 0,0 L 8,3 L 0,6 Z"
                  fill="rgb(0, 128, 0)"
                  opacity="0.8"
                />
              </marker>
            </defs>
            <line
              x1={getSquareCenter(hintArrow[0]).x}
              y1={getSquareCenter(hintArrow[0]).y}
              x2={getSquareCenter(hintArrow[1]).x}
              y2={getSquareCenter(hintArrow[1]).y}
              stroke="rgb(0, 128, 0)"
              strokeWidth="8"
              opacity="0.8"
              markerEnd="url(#hintArrowhead)"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// Helper function to get the center coordinates of a square
function getSquareCenter(square: string) {
  const file = square.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
  const rank = 8 - parseInt(square[1]); // '1' -> 7, '2' -> 6, etc.
  
  // Calculate percentage positions (12.5% per square)
  const x = (file * 12.5 + 6.25) + '%';
  const y = (rank * 12.5 + 6.25) + '%';
  
  return { x, y };
} 