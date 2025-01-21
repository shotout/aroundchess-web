"use client"

import { useComputerChessStore } from "../store/computerChessStore"
import { ChessPiece } from "./chess-piece"
import { useState, useEffect } from "react"
import useStore from "../lib/hooks/useStore"
import { initialBoard } from "../lib/playground/initial-setup"
import { LoadingBoard } from "./loading-board"
import { useThemeStore } from "../store/playground/theme-store"
import { cn } from "../lib/utils"
import { MoveDetails } from "@/types/chess"
import { playIncorrectMoveSound, playCaptureSound } from "../utils/playSound"

interface ChessBoardProps {
  onCapture?: (piece: string, color: "white" | "black") => void;
}

export default function ComputerChessBoard({ onCapture }: ChessBoardProps) {
  const { boardTheme } = useThemeStore((state) => state);
  const store = useStore(useComputerChessStore, (state) => state);
  const isLoading = !store;
  const {
    board,
    movePiece,
    isValidMove,
    isKingInCheck,
    currentPlayer,
    lastMove,
    movingPiece,
    computer,
    computerMove,
    playerColor,
    isBoardFlipped,
  } = store! || {
    board: initialBoard,
    movePiece: () => false,
    isValidMove: () => false,
    isKingInCheck: "noCheck",
    currentPlayer: "white",
    computer: null,
    computerMove: async () => {},
    playerColor: "white",
    isBoardFlipped: false,
  };
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);

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
    const checkmate = false; // We'll handle checkmate separately

    // Format piece notation correctly
    let pieceNotation = '';
    switch (piece.toUpperCase()) {
      case 'P': 
        return {
          piece: '',
          from: { x: fromCol, y: fromRow },
          to: { x: toCol, y: toRow },
          isCapture: capture,
          isCheck: check,
          isCheckmate: checkmate
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
      from: { x: fromCol, y: fromRow },
      to: { x: toCol, y: toRow },
      isCapture: capture,
      isCheck: check,
      isCheckmate: checkmate
    };
  };

  const recordMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = board[fromRow][fromCol];
    if (piece) {
      const moveDetails = getMoveNotation(fromRow, fromCol, toRow, toCol, piece);
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const moveNotation = piece.toUpperCase() === 'P' 
        ? `${files[toCol]}${8 - toRow}${moveDetails.isCheckmate ? '#' : moveDetails.isCheck ? '+' : ''}`
        : `${moveDetails.piece}${moveDetails.isCapture ? 'x' : ''}${files[toCol]}${8 - toRow}${moveDetails.isCheckmate ? '#' : moveDetails.isCheck ? '+' : ''}`;
      
      // Add move to history
      useComputerChessStore.getState().addMove(moveNotation);
    }
  };

  // Add effect to record moves
  useEffect(() => {
    if (!lastMove || !board) return;
    
    const piece = board[lastMove.toRow][lastMove.toCol];
    if (!piece || lastMove.recorded) return;
    
    recordMove(lastMove.fromRow, lastMove.fromCol, lastMove.toRow, lastMove.toCol);
    
    // Mark move as recorded
    useComputerChessStore.setState(state => ({
      ...state,
      lastMove: { ...lastMove, recorded: true }
    }));
  }, [lastMove, board]);

  // Effect to trigger computer move
  useEffect(() => {
    if (computer === currentPlayer) {
      computerMove();
    }
  }, [computer, currentPlayer, computerMove]);

  // drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    
    // Add visual feedback for valid drop targets
    if (selectedPiece) {
      const [row, col] = target.dataset.position?.split(',').map(Number) || [];
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
    
    // Check if it's the player's turn
    if (currentPlayer !== playerColor) {
      playIncorrectMoveSound();
      return;
    }
    
    const [fromRow, fromCol] = e.dataTransfer
      .getData("text")
      .split(",")
      .map(Number);
      
    if (isValidMove(fromRow, fromCol, toRow, toCol)) {
      // Check if there's a piece being captured
      const capturedPiece = board[toRow][toCol];
      if (capturedPiece) {
        playCaptureSound();
        if (onCapture) {
          // If the captured piece is uppercase, it's white
          const isWhitePiece = capturedPiece === capturedPiece.toUpperCase();
          onCapture(capturedPiece, isWhitePiece ? 'white' : 'black');
        }
      }
      movePiece(fromRow, fromCol, toRow, toCol);
      setSelectedPiece(null);
    } else {
      playIncorrectMoveSound();
    }
  };

  const handlePieceClick = (row: number, col: number) => {
    if (board && !board[row][col]) return;
    
    // Check if it's the player's turn
    if (currentPlayer !== playerColor) {
      playIncorrectMoveSound();
      return;
    }

    // Check if the piece belongs to the player
    const isPieceWhite = board[row][col] === board[row][col]?.toUpperCase();
    if ((playerColor === 'white' && !isPieceWhite) || (playerColor === 'black' && isPieceWhite)) {
      playIncorrectMoveSound();
      return;
    }

    // Toggle piece selection
    setSelectedPiece((prev) => {
      if (prev && prev.row === row && prev.col === col) {
        return null; // Deselect if clicking the same piece
      }
      return { row, col }; // Select new piece
    });
  };

  const handleSquareClick = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const piece = board[rowIndex][colIndex];
    const isPieceWhite = piece ? piece === piece.toUpperCase() : false;
    const isCurrentPlayersPiece = piece && 
      ((currentPlayer === playerColor && isPieceWhite) || 
       (currentPlayer === playerColor && !isPieceWhite));

    // Case 1: We have a selected piece
    if (selectedPiece) {
      if (isValidMove(selectedPiece.row, selectedPiece.col, rowIndex, colIndex)) {
        // Check if there's a piece being captured
        const capturedPiece = board[rowIndex][colIndex];
        if (capturedPiece) {
          playCaptureSound();
          if (onCapture) {
            // If the captured piece is uppercase, it's white
            const isWhitePiece = capturedPiece === capturedPiece.toUpperCase();
            onCapture(capturedPiece, isWhitePiece ? 'white' : 'black');
          }
        }
        movePiece(selectedPiece.row, selectedPiece.col, rowIndex, colIndex);
      } else {
        playIncorrectMoveSound();
      }
      setSelectedPiece(null);
      return;
    }

    // Case 2: No selected piece, clicking on our own piece
    if (currentPlayer === playerColor) {
      if (isCurrentPlayersPiece) {
        setSelectedPiece({ row: rowIndex, col: colIndex });
      } else if (piece) {
        playIncorrectMoveSound();
      }
    } else {
      playIncorrectMoveSound();
    }
  };

  // Remove selected piece when current player changes
  useEffect(() => {
    setSelectedPiece(null);
  }, [currentPlayer]);

  if (isLoading) return <LoadingBoard />;

  return (
    <div className="relative w-full flex items-center justify-center p-2 sm:p-4">
      <div 
        className={cn(
          "w-full aspect-square max-w-[min(90vw,90vh,700px)]",
          "grid grid-cols-8 grid-rows-8 border-2 border-gray-800 rounded-lg overflow-hidden",
          "bg-white shadow-xl",
          isBoardFlipped && "rotate-180"
        )}
      >
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected =
              selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
            const isLastMove =
              lastMove &&
              ((lastMove.fromRow === rowIndex && lastMove.fromCol === colIndex) ||
                (lastMove.toRow === rowIndex && lastMove.toCol === colIndex));
            const isValidMoveTarget = 
              selectedPiece && 
              isValidMove(selectedPiece.row, selectedPiece.col, rowIndex, colIndex);
            const isCheck = piece && String(piece) === isKingInCheck;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                data-position={`${rowIndex},${colIndex}`}
                className={cn(
                  "relative w-full h-full",
                  isLight ? boardTheme.light : boardTheme.dark,
                  isSelected && boardTheme.selected,
                  isLastMove && boardTheme.lastMove,
                  isCheck && "bg-red-500/50",
                  {
                    "rounded-tl-lg": rowIndex === 0 && colIndex === 0,
                    "rounded-tr-lg": rowIndex === 0 && colIndex === 7,
                    "rounded-bl-lg": rowIndex === 7 && colIndex === 0,
                    "rounded-br-lg": rowIndex === 7 && colIndex === 7,
                  }
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                onClick={(e) => handleSquareClick(rowIndex, colIndex, e)}
              >
                {isValidMoveTarget && !piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-gray-500 bg-opacity-50" />
                  </div>
                )}
                {isValidMoveTarget && piece && (
                  <div className="absolute inset-0 ring-[10px] ring-gray-500 ring-opacity-50 ring-inset rounded-full" />
                )}
                {piece && (
                  <div 
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      isBoardFlipped && "rotate-180"
                    )}
                  >
                    <ChessPiece
                      type={piece}
                      position={{ row: rowIndex, col: colIndex }}
                      lastMove={lastMove}
                      currentPlayer={currentPlayer}
                      highlight={isSelected}
                      setSelectedPiece={setSelectedPiece}
                      movingPiece={movingPiece}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}