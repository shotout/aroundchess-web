"use server";
import { prisma } from '@/lib/db/prisma'
import { pusherServer } from "../../../lib/pusher";
import { isKingInCheck } from "../../../utils/kingCheck";
import { incrementWins } from "../../services/stats";
import type { Board, GameState, PieceType, Winner } from "../../../types/chess"

export async function getGameState(gameId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  const players = await prisma.player.findMany({
    where: { gameId },
  });

  if (!game) throw new Error("Game not found");

  return { gameState: game, players };
}

export async function getPlayerColor(playerId: string) {
  const player = await prisma.player.findUnique({ where: { id: playerId } });
  return player?.color as "white" | "black" | null;
}

export async function serverPawnPromote(
  gameId: string,
  { row, col, piece }: { row: number; col: number; piece: string }
) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  const board: Board = JSON.parse(game.board);
  const lastMove = game.lastMove ? JSON.parse(game.lastMove) : null;
  const rookMoved = JSON.parse(game.rookMoved);
  const kingCheckOrMoved = JSON.parse(game.kingCheckOrMoved);
  const eliminatedPieces = JSON.parse(game.eliminatedPiece);
  const currentPlayer = game.currentPlayer;

  const newBoard = board.map((row) => [...row]);
  newBoard[row][col] = (currentPlayer === "black" ? piece.toLowerCase() : piece) as PieceType;

  const gameState: GameState = {
    board: newBoard as Board,
    currentPlayer: currentPlayer === "white" ? "black" : "white",
    winner: game.winner as Winner,
    isKingInCheck: isKingInCheck(
      newBoard,
      currentPlayer === "white" ? "black" : "white"
    )
      ? currentPlayer === "black"
        ? "K"
        : "k"
      : "noCheck",
    canPromotePawn: null,
    status: "in-progress",
    eliminatedPieces: eliminatedPieces,
    lastMove: lastMove,
    kingCheckOrMoved: kingCheckOrMoved,
    rookMoved: rookMoved,
    movingPiece: null,
  };

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      currentPlayer: currentPlayer === "white" ? "black" : "white",
      board: JSON.stringify(newBoard),
      isKingInCheck: gameState.isKingInCheck,
      canPawnPromote: JSON.stringify({}),
    },
  });

  await pusherServer.trigger(`room-${gameId}`, "promote", gameState);

  return "Pawn promoted successfully";
}

export async function handlePlayerResign(gameId: string, playerId: string) {
  const game = await prisma.game.findUnique({ where: { roomId: gameId } });
  if (!game) throw new Error("Game not found");

  const players = await prisma.player.findMany({ where: { gameId } });
  const resigner = players.find((player: { id: string; color: string }) => player.id === playerId);
  
  if (!resigner) throw new Error("Player not found");
  
  const winner = resigner.color === "white" ? "black" : "white";

  await prisma.game.update({
    where: { roomId: gameId },
    data: {
      winner
    },
  });

  await incrementWins(winner as "white" | "black");

  await pusherServer.trigger(`room-${gameId}`, "resign", {
    winner,
    status: "resigned",
  });
  
  return "Player resigned";
}

export async function deleteGame(gameId: string) {
  try {
    const game = await prisma.game.findUnique({ where: { roomId: gameId } });
    if (!game) throw new Error("Game not found");

    await prisma.player.deleteMany({ where: { gameId } });
    await prisma.game.delete({ where: { roomId: gameId } });
    return "Game deleted";
  } catch (error) {
    return "Error";
  }
}
