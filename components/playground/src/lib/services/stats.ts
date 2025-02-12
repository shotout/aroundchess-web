import { prisma } from '@/lib/db/prisma'

export async function incrementDraws() {
  try {
    const existingStats = await (prisma as any).stats.findFirst();
    if (existingStats) {
      await (prisma as any).stats.update({
        where: { id: existingStats.id },
        data: {
          draws: { increment: 1 },
          totalGames: { increment: 1 },
        },
      });
    } else {
      await (prisma as any).stats.create({
        data: {
          draws: 1,
          totalGames: 1,
        },
      });
    }
  } catch (error) {
    console.error("Failed to update stats:", error);
  }
}

export async function incrementWins(winner: "white" | "black") {
  try {
    const existingStats = await (prisma as any).stats.findFirst();
    if (existingStats) {
      await (prisma as any).stats.update({
        where: { id: existingStats.id },
        data: {
          [winner === "white" ? "whiteWins" : "blackWins"]: { increment: 1 },
          totalGames: { increment: 1 },
        },
      });
    } else {
      await (prisma as any).stats.create({
        data: {
          [winner === "white" ? "whiteWins" : "blackWins"]: 1,
          totalGames: 1,
        },
      });
    }
  } catch (error) {
    console.error("Failed to update stats:", error);
  }
}

export async function incrementTotalGames() {
  try {
    const existingStats = await (prisma as any).stats.findFirst();
    if (!existingStats) {
      await (prisma as any).stats.create({
        data: {
          totalGames: 1,
        },
      });
    } else {
      await (prisma as any).stats.update({
        where: { id: existingStats.id },
        data: {
          totalGames: { increment: 1 },
        },
      });
    }
  } catch (error) {
    console.error("Failed to update stats:", error);
  }
} 