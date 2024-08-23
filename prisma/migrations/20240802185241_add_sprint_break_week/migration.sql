-- CreateTable
CREATE TABLE "Sprint" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "startWeekId" INTEGER NOT NULL,
    "endWeekId" INTEGER NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YearWeek" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,

    CONSTRAINT "YearWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_startWeekId_endWeekId_key" ON "Sprint"("startWeekId", "endWeekId");

-- CreateIndex
CREATE UNIQUE INDEX "YearWeek_year_week_key" ON "YearWeek"("year", "week");

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_startWeekId_fkey" FOREIGN KEY ("startWeekId") REFERENCES "YearWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_endWeekId_fkey" FOREIGN KEY ("endWeekId") REFERENCES "YearWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
