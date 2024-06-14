/*
  Warnings:

  - You are about to drop the `Sprint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Sprint";

-- CreateTable
CREATE TABLE "DimSprint" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "startWeekId" INTEGER NOT NULL,
    "endWeekId" INTEGER NOT NULL,

    CONSTRAINT "DimSprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DimYearWeek" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,

    CONSTRAINT "DimYearWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreakWeek" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "BreakWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DimSprint_startWeekId_endWeekId_key" ON "DimSprint"("startWeekId", "endWeekId");

-- CreateIndex
CREATE UNIQUE INDEX "DimYearWeek_year_week_key" ON "DimYearWeek"("year", "week");

-- AddForeignKey
ALTER TABLE "DimSprint" ADD CONSTRAINT "DimSprint_startWeekId_fkey" FOREIGN KEY ("startWeekId") REFERENCES "DimYearWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DimSprint" ADD CONSTRAINT "DimSprint_endWeekId_fkey" FOREIGN KEY ("endWeekId") REFERENCES "DimYearWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakWeek" ADD CONSTRAINT "BreakWeek_id_fkey" FOREIGN KEY ("id") REFERENCES "DimYearWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
