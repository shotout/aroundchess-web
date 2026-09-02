"use server";

import { prisma } from '@/lib/db/prisma'
import { pusherServer } from "../../../lib/pusher";
import { incrementDraws } from "../../services/stats";

export async function handleDrawRequest(gameId: string, playerId: string) {
  try {
    const game = await prisma.game.findUnique({
      where: { roomId: gameId },
      include: { players: true },
    });

    if (!game) throw new Error("Game not found");

    const player = await prisma.player.update({
      where: { id: playerId },
      data: { drawRequest: true },
    });

    await pusherServer.trigger(`game-${gameId}`, "draw-request", {
      playerId: player.id,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function drawAccepted(gameId: string) {
  return handleDrawAccept(gameId);
}

export async function drawDeclined(gameId: string, playerId: string) {
  try {
    await prisma.player.update({
      where: { id: playerId },
      data: { drawRequest: false },
    });

    await pusherServer.trigger(`game-${gameId}`, "draw-declined", {});
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function handleDrawAccept(gameId: string) {
  try {
    const game = await prisma.game.update({
      where: { roomId: gameId },
      data: {
        winner: "draw"
      },
      include: {
        players: true,
      },
    });

    // Use the stats service instead
    await incrementDraws();

    await pusherServer.trigger(`game-${gameId}`, "draw-accepted", {});
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
