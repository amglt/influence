-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "recruitmentDate" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Period" ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMP(3);
