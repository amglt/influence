/*
  Warnings:

  - Added the required column `amount` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "amount" INTEGER NOT NULL;
