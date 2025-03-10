"use server";

import {
  initialBoard,
  initialRookMoved,
  intitialkingCheckOrMoved,
} from "../../../utils/initialSetup";
import { prisma } from '@/lib/db/prisma'
import { incrementTotalGames } from "../../services/stats";

export async function CreateRoom(
  roomId: string,
  whitePlayerId: string,
  blackPlayerId: string
) {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  await prisma.player.deleteMany({
    where: {
      game: {
        createdAt: {
          lt: fifteenMinutesAgo,
        },
      },
    },
  });

  await prisma.game.deleteMany({
    where: {
      createdAt: {
        lt: fifteenMinutesAgo,
      },
    },
  });

  const createdRoom = await prisma.game.create({
    data: {
      roomId,
      board: JSON.stringify(initialBoard),
      currentPlayer: "white",
      lastMove: JSON.stringify({}),
      eliminatedPiece: JSON.stringify({ white: [], black: [] }),
      kingCheckOrMoved: JSON.stringify(intitialkingCheckOrMoved),
      rookMoved: JSON.stringify(initialRookMoved),
      canPawnPromote: JSON.stringify({}),
      whitePlayer: whitePlayerId,
      blackPlayer: blackPlayerId,
    },
  });

  const player = await prisma.player.create({
    data: {
      color: "white",
      game: {
        connect: { roomId: createdRoom.roomId },
      },
    },
  });

  // Use the stats service
  await incrementTotalGames();

  return { roomId: createdRoom.roomId, playerId: player.id };
}
