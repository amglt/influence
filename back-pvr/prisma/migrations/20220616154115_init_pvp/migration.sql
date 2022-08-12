-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opponent" (
    "id" SERIAL NOT NULL,
    "percoWinPoints" INTEGER NOT NULL,
    "percoNDPoints" INTEGER NOT NULL,
    "percoLoosePoints" INTEGER NOT NULL,
    "prismWinPoints" INTEGER NOT NULL,
    "prismNDPoints" INTEGER NOT NULL,
    "prismLoosePoints" INTEGER NOT NULL,
    "avaWin" INTEGER NOT NULL,
    "avaLoose" INTEGER NOT NULL,

    CONSTRAINT "Opponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PVPGame" (
    "id" SERIAL NOT NULL,
    "earnedPoints" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "player1" TEXT NOT NULL,
    "player2" TEXT,
    "player3" TEXT,
    "player4" TEXT,
    "player5" TEXT,
    "opponentId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,

    CONSTRAINT "PVPGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PVPGame" ADD CONSTRAINT "PVPGame_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PVPGame" ADD CONSTRAINT "PVPGame_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Opponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
