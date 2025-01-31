import moment from "moment";
import { prisma } from "../client/client.js";

export class SprintOperations {
  static async createWithDeps(props: {
    number: number;
    year: number;
    firstWeek: number;
    lastWeek: number;
  }) {
    const { number, year, firstWeek, lastWeek } = props;

    const firstWeekMoment = moment.utc().year(year).week(firstWeek);
    const lastWeekMoment = moment.utc().year(year).week(lastWeek);

    return prisma.sprint.create({
      data: {
        startWeek: {
          create: {
            year: year,
            week: firstWeek,
            start: firstWeekMoment.startOf("week").toDate(),
            end: firstWeekMoment.endOf("week").toDate(),
          },
        },
        endWeek: {
          create: {
            year: year,
            week: lastWeek,
            start: lastWeekMoment.startOf("week").toDate(),
            end: lastWeekMoment.endOf("week").toDate(),
          },
        },
        number,
      },
    });
  }

  static async findByDate(date: Date) {
    return prisma.sprint.findFirst({
      where: {
        AND: [
          {
            startWeek: {
              start: {
                lte: date,
              },
            },
          },
          {
            endWeek: {
              end: {
                gte: date,
              },
            },
          },
        ],
      },
    });
  }

  static async findCurrent() {
    return this.findByDate(new Date());
  }
}
