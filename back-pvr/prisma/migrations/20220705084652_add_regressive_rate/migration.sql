-- CreateTable
CREATE TABLE "RegressiveRate" (
    "id" SERIAL NOT NULL,
    "gameAmount" INTEGER NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "RegressiveRate_pkey" PRIMARY KEY ("id")
);
