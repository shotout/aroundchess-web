"use server";

import { prisma } from '@/lib/db/prisma'
import { pusherServer } from "../../../lib/pusher";
import type { Board, PieceType } from "../../../types/chess";
import { GameState } from "../../../types/onlineChess";
import { checkCastling } from "../../../utils/castle";
import { CheckEnpassant } from "../../../utils/enpassant";
import { isCheckMate, isKingInCheck } from "../../../utils/kingCheck";
import { isMovePossible } from "../../../utils/possibleMove";
import { promotePawn } from "../../../utils/promotePawn";
import { convertBoard } from "../../../types/chess";

interface CastlingData {
  rook: PieceType
  rookCol: number
  newRookCol: number
}

export async function handlePlayerMove(
  gameId: string,
  from: { row: number; col: number },
  to: { row: number; col: number },
  player: "white" | "black"
) {
  try {
    const game = await prisma.game.findUnique({ where: { roomId: gameId } });
    if (!game) throw new Error("Game not found");

    if (player != game.currentPlayer) throw new Error("Not your turn");

    const board: Board = JSON.parse(game.board);
    const lastMove = game.lastMove ? JSON.parse(game.lastMove) : null;
    const rookMoved = JSON.parse(game.rookMoved);
    const kingCheckOrMoved = JSON.parse(game.kingCheckOrMoved);
    const eliminatedPieces = JSON.parse(game.eliminatedPiece);
    const currentPlayer = game.currentPlayer;

    const newBoard = board.map((row) => row.slice());
    const piece = newBoard[from.row][from.col];
    if (!piece) throw new Error("No piece found");

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (currentPlayer === "white" && !isWhitePiece) ||
      (currentPlayer === "black" && isWhitePiece)
    )
      throw new Error("Invalid move");

    let EliminatedPiece = null;

    if (
      isMovePossible(
        newBoard,
        from.row,
        from.col,
        to.row,
        to.col,
        currentPlayer,
        lastMove,
        rookMoved,
        kingCheckOrMoved
      )
    ) {
      if (
        lastMove &&
        CheckEnpassant(
          newBoard,
          {
            fromRow: from.row,
            fromCol: from.col,
            toRow: to.row,
            toCol: to.col,
          },
          lastMove
        )
      ) {
        EliminatedPiece = newBoard[lastMove.toRow][lastMove.toCol];
        newBoard[lastMove.toRow][lastMove.toCol] = null;
      }

      const data = checkCastling(
        from.row,
        from.col,
        to.row,
        to.col,
        newBoard,
        currentPlayer,
        rookMoved,
        kingCheckOrMoved
      );

      if (data) {
        newBoard[from.row][data.rookCol] = null;
        newBoard[from.row][data.newRookCol] = data.rook as PieceType;
      }

      if (newBoard[to.row][to.col]) EliminatedPiece = newBoard[to.row][to.col];
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;

      if (isKingInCheck(newBoard, currentPlayer))
        throw new Error("Invalid move");
    } else throw new Error("Invalid move");

    const newCurrentPlayer = currentPlayer === "white" ? "black" : "white";
    const isOpponentInCheck = isKingInCheck(newBoard, newCurrentPlayer);
    const isCheckMated = isOpponentInCheck && isCheckMate(newBoard, newCurrentPlayer);
    
    console.log('Check status:', {
      isOpponentInCheck,
      isCheckMated,
      newCurrentPlayer
    });

    const canPromotePawn = promotePawn(board, from.row, from.col, to.row, to.col, currentPlayer);

    const gameState: GameState = {
      board: newBoard,
      status: isCheckMated ? "checkmate" : canPromotePawn ? "promote" : "in-progress",
      currentPlayer: canPromotePawn ? currentPlayer : newCurrentPlayer,
      lastMove: {
        type: piece,
        fromRow: from.row,
        fromCol: from.col,
        toRow: to.row,
        toCol: to.col,
      },
      isKingInCheck: isOpponentInCheck 
        ? newCurrentPlayer === "white" ? "K" : "k"
        : "noCheck",
      kingCheckOrMoved: kingCheckOrMoved,
      rookMoved: rookMoved,
      eliminatedPieces: {
        ...eliminatedPieces,
        [currentPlayer === "white" ? "black" : "white"]: [
          ...eliminatedPieces[currentPlayer === "white" ? "black" : "white"],
          EliminatedPiece,
        ],
      },
      canPromotePawn,
      winner: isCheckMated ? currentPlayer : "none",
      movingPiece: null,
    };

    if (isCheckMated) {
      await pusherServer.trigger(`room-${gameId}`, "checkmate", {
        winner: currentPlayer,
        board: newBoard,
        status: "checkmate",
        currentPlayer: newCurrentPlayer
      });
    }

    await pusherServer.trigger(`room-${gameId}`, "move", gameState);

    const winner = gameState.winner;

    await prisma.game.update({
      where: { roomId: gameId },
      data: {
        board: JSON.stringify(newBoard),
        winner: winner,
        currentPlayer: gameState.canPromotePawn
          ? currentPlayer
          : newCurrentPlayer,
        lastMove: JSON.stringify(gameState.lastMove),
        kingCheckOrMoved: JSON.stringify(gameState.kingCheckOrMoved),
        rookMoved: JSON.stringify(gameState.rookMoved),
        isKingInCheck: gameState.isKingInCheck,
        eliminatedPiece: JSON.stringify(gameState.eliminatedPieces),
        canPawnPromote: JSON.stringify(
          gameState.canPromotePawn === null ? {} : gameState.canPromotePawn
        ),
      },
    });

    return "Move successful";
  } catch (error) {
    return "Error";
  }
}
