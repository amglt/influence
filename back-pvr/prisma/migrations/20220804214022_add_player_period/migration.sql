-- CreateTable
CREATE TABLE "PlayerPeriod" (
    "id" SERIAL NOT NULL,
    "playerId" TEXT NOT NULL,
    "periodId" INTEGER NOT NULL,
    "totalPoints" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PlayerPeriod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerPeriod" ADD CONSTRAINT "PlayerPeriod_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
