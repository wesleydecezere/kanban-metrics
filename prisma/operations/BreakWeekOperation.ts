import { Prisma } from "@prisma/client";
import { prisma } from "../client/client";

export type BreakWeekInput = Prisma.BreakWeekCreateManyInput;

export class BreakWeekOperation {
  static async createMany(data: BreakWeekInput[]) {
    return prisma.breakWeek.createMany({ data });
  }

  static async getByYear(year: number) {
    return prisma.breakWeek
      .findMany({
        select: {
          week: true,
        },
        where: {
          year,
        },
      })
      .then((breakWeeks) => breakWeeks.map((breakWeek) => breakWeek.week));
  }
}
