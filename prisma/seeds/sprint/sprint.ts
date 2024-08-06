import chalk from "chalk"
import moment from "moment"
import { SprintOperations } from "../../operations/SprintOperations.js"
import { getSprintWeekNumbers } from "./sprintWeeks.js"

const TIMER_LABEL = "seed:sprintWithDeps"
const LABEL_CHALKED = chalk.gray(TIMER_LABEL)

export async function seedSprintWithDeps() {
  performance.mark("start")
  console.info(LABEL_CHALKED, "Starting process.")

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
      const duration = performance.measure("p", "start").duration
      const milis = moment(duration).format("SSS")

      console.info(LABEL_CHALKED, `${promises.length} nested writes done!`)
      console.info(LABEL_CHALKED, `Finished in ${milis} ms.`)
    })
    .catch(() => {
      console.error(
        LABEL_CHALKED,
        `${TIMER_LABEL} Process finished with error!`,
      )
    })
}
