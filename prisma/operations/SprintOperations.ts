import moment from "moment";
import { prisma } from "../client/client";

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
}
