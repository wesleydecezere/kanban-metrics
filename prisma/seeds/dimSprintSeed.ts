import moment from "moment";
import { DimSprintOperations } from "../operations/DimSprintOperations.js";
import chalk from "chalk";

import { performance } from "perf_hooks";

/* TODO
 - [ ] remove logs after add tests
  */

const TIMER_LABEL = "seed:dimSprintWithDeps";
const LABEL_CHALKED = chalk.gray(TIMER_LABEL);

export async function seedDimSprintWithDeps() {
  const year = moment.utc().year();
  const weeksOnYear = moment.utc().isoWeeksInYear();

  performance.mark("start");
  console.info(LABEL_CHALKED, `Starting process.`);

  const sprintWeeks = getSprintWeekNumbers(weeksOnYear);

  console.info(LABEL_CHALKED, sprintWeeks);

  const promises = sprintWeeks.map(async ({ first, last }, idx) => {
    return DimSprintOperations.createWithDeps({
      number: idx + 1,
      year,
      firstWeek: first,
      lastWeek: last,
    });
  });

  console.info(LABEL_CHALKED, `${promises.length} promises created.`);

  return Promise.all(promises)
    .then(() => {
      const duration = performance.measure("p", "start").duration;
      const milis = moment(duration).format("SSS");

      console.info(LABEL_CHALKED, `${promises.length} nested writes done!`);
      console.info(LABEL_CHALKED, `Finished in ${milis} ms.`);
    })
    .catch(() => {
      console.error(`${TIMER_LABEL} Process finished with error!`);
    });
}

/* TODO
  - [ ] add FIRST_WORK_WEEK 
  - [ ] fix sprint ends on next year (sprintsOnYear non integer)
*/

const SPRINT_LENGTH = 2;

const getSprintWeekNumbers = (
  weeksOnYear: number
): Array<{
  first: number;
  last: number;
}> => {
  const sprintsOnYear = weeksOnYear / SPRINT_LENGTH;

  return Array.from({ length: sprintsOnYear }, (_, idx) => {
    const offset = idx * SPRINT_LENGTH;

    return {
      first: offset + 1,
      last: offset + SPRINT_LENGTH,
    };
  });
};
