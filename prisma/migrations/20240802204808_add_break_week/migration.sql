-- CreateTable
CREATE TABLE "BreakWeek" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,

    CONSTRAINT "BreakWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BreakWeek_year_week_key" ON "BreakWeek"("year", "week");
