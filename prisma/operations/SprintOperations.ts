import { getMoment } from "../../util/date"
import { prisma } from "../client/client"

export class SprintOperations {
  static async createWithDeps(props: {
    number: number
    firstWeek: number
    lastWeek: number
    firstWeekYear: number
    lastWeekYear: number
  }) {
    const { number, firstWeek, lastWeek, firstWeekYear, lastWeekYear } = props

    const firstWeekMoment = getMoment(firstWeekYear, firstWeek)
    const lastWeekMoment = getMoment(lastWeekYear, lastWeek)

    return prisma.sprint.create({
      data: {
        startWeek: {
          create: {
            year: firstWeekYear,
            week: firstWeek,
            start: firstWeekMoment.startOf("week").toDate(),
            end: firstWeekMoment.endOf("week").toDate(),
          },
        },
        endWeek: {
          create: {
            year: lastWeekYear,
            week: lastWeek,
            start: lastWeekMoment.startOf("week").toDate(),
            end: lastWeekMoment.endOf("week").toDate(),
          },
        },
        number,
      },
    })
  }
}
