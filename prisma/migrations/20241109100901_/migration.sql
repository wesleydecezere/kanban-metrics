/*
  Warnings:

  - The primary key for the `Issue` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Issue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Issue_id_seq";

-- CreateTable
CREATE TABLE "IssueSprint" (
    "id" SERIAL NOT NULL,
    "issueId" TEXT NOT NULL,
    "sprintId" INTEGER NOT NULL,

    CONSTRAINT "IssueSprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueEvolution" (
    "id" SERIAL NOT NULL,
    "issueId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "position" INTEGER NOT NULL,
    "donePercentage" INTEGER NOT NULL,
    "pointsEstimate" INTEGER NOT NULL,

    CONSTRAINT "IssueEvolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BoardField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "boardFieldId" TEXT NOT NULL,

    CONSTRAINT "SystemField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IssueSprint_issueId_sprintId_key" ON "IssueSprint"("issueId", "sprintId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemField_boardFieldId_key" ON "SystemField"("boardFieldId");

-- AddForeignKey
ALTER TABLE "IssueSprint" ADD CONSTRAINT "IssueSprint_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueSprint" ADD CONSTRAINT "IssueSprint_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueEvolution" ADD CONSTRAINT "IssueEvolution_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemField" ADD CONSTRAINT "SystemField_boardFieldId_fkey" FOREIGN KEY ("boardFieldId") REFERENCES "BoardField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
