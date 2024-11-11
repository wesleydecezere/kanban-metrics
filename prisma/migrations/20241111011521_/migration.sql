/*
  Warnings:

  - The primary key for the `IssueSprint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `IssueSprint` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "IssueSprint_issueId_sprintId_key";

-- AlterTable
ALTER TABLE "IssueSprint" DROP CONSTRAINT "IssueSprint_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "IssueSprint_pkey" PRIMARY KEY ("issueId", "sprintId");
