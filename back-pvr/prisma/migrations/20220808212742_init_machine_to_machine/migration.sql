-- CreateTable
CREATE TABLE "MachineToMachine" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "clientSecret" TEXT NOT NULL,

    CONSTRAINT "MachineToMachine_pkey" PRIMARY KEY ("id")
);
