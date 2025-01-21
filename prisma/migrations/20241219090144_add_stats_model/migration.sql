-- CreateTable
CREATE TABLE "Game" (
    "roomId" TEXT NOT NULL,
    "winner" TEXT DEFAULT 'none',
    "status" TEXT NOT NULL DEFAULT 'in-progress',
    "board" TEXT NOT NULL,
    "currentPlayer" TEXT NOT NULL,
    "kingCheckOrMoved" TEXT NOT NULL,
    "rookMoved" TEXT NOT NULL,
    "eliminatedPiece" TEXT NOT NULL,
    "isKingInCheck" TEXT NOT NULL DEFAULT 'noCheck',
    "canPawnPromote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "whiteTime" INTEGER NOT NULL DEFAULT 600,
    "blackTime" INTEGER NOT NULL DEFAULT 600,
    "lastMove" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "drawRequest" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT NOT NULL,
    "name" TEXT,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "whiteWins" INTEGER NOT NULL DEFAULT 0,
    "blackWins" INTEGER NOT NULL DEFAULT 0,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
