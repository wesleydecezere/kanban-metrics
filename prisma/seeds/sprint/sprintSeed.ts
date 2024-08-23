import moment from "moment";
import { SprintOperations } from "../../operations/SprintOperations.js";
import chalk from "chalk";

import { performance } from "perf_hooks";
import { getSprintWeekNumbers } from "./util.js";

const TIMER_LABEL = "seed:sprintWithDeps";
const LABEL_CHALKED = chalk.gray(TIMER_LABEL);

export async function seedSprintWithDeps() {
  const year = moment.utc().year();
  const weeksOnYear = moment.utc().isoWeeksInYear();

  performance.mark("start");
  console.info(LABEL_CHALKED, `Starting process.`);

  const sprintWeeks = getSprintWeekNumbers(weeksOnYear);

  const promises = sprintWeeks.map(async ({ first, last }, idx) => {
    return SprintOperations.createWithDeps({
      number: idx + 1,
      year,
      firstWeek: first,
      lastWeek: last,
    });
  });

  return Promise.all(promises)
    .then(() => {
      const duration = performance.measure("p", "start").duration;
      const milis = moment(duration).format("SSS");

      console.info(LABEL_CHALKED, `${promises.length} nested writes done!`);
      console.info(LABEL_CHALKED, `Finished in ${milis} ms.`);
    })
    .catch(() => {
      console.error(
        LABEL_CHALKED,
        `${TIMER_LABEL} Process finished with error!`
      );
    });
}
