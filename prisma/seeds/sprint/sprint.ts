import chalk from "chalk"
import moment from "moment"
import { SprintOperations } from "../../operations/SprintOperations.js"
import { ProcessLogger } from "../../util/Logger.js"
import { getSprintWeekNumbers } from "./sprintWeeks.js"

export async function seedSprintWithDeps() {
  const logger = new ProcessLogger("seed:sprintWithDeps", chalk.gray)

  logger.start()
  const year = moment().utc().year()
  const sprintWeeks = await getSprintWeekNumbers(year)

  const promises = sprintWeeks.map(
    async ({ firstWeek, lastWeek, isBetweenYears }, idx) => {
      const lastWeekYear = isBetweenYears ? year + 1 : year

      return SprintOperations.createWithDeps({
        number: idx + 1,
        firstWeek,
        lastWeek,
        firstWeekYear: year,
        lastWeekYear,
      })
    },
  )

  return Promise.all(promises)
    .then(() => {
      console.info(logger.label, `${promises.length} nested writes done!`)
      logger.end()
    })
    .catch(e => logger.error(e))
}
