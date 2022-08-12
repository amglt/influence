/*
  Warnings:

  - The primary key for the `MachineToMachine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MachineToMachine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MachineToMachine" DROP CONSTRAINT "MachineToMachine_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "MachineToMachine_pkey" PRIMARY KEY ("clientId");
