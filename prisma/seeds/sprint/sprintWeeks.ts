import { SPRINT_WEEK_LENGHT } from "../../../config/sprint"
import { getRange } from "../../../util/array"
import { getWeeksInYear } from "../../../util/date.util"
import { BreakWeekOperation } from "../../operations/BreakWeekOperation"

type SprintWeekNumber = {
  firstWeek: number
  lastWeek: number
  isBetweenYears?: boolean
}

// query break weeks because it will be seeded via API
export const getSprintWeekNumbers = async (
  year: number,
): Promise<Array<SprintWeekNumber>> => {
  const { sprints, hasMissingWeeks } = await getSprintsInYear(year)
  if (!hasMissingWeeks) return sprints

  const sprintBetweenYears = await getSprintBetweenYears(
    year + 1,
    sprints.last(),
  )
  return sprints.concatNotNull(sprintBetweenYears)
}

const getSprintsInYear = async (
  year: number,
): Promise<{ sprints: Array<SprintWeekNumber>; hasMissingWeeks: boolean }> => {
  const weeks = getWeeksInYear(year)
  const breakWeeks = await BreakWeekOperation.getByYear(year)
  const workWeeks = getRange({ start: 1, end: weeks }).remove(breakWeeks)

  const hasMissingWeeks = workWeeks.length % SPRINT_WEEK_LENGHT > 0
  const sprints = workWeeks
    .partition(SPRINT_WEEK_LENGHT)
    .filter(part => part.length === SPRINT_WEEK_LENGHT)
    .map(
      (part): SprintWeekNumber => ({
        firstWeek: part.first(),
        lastWeek: part.last(),
      }),
    )

  return {
    hasMissingWeeks,
    sprints,
  }
}

const getSprintBetweenYears = async (
  nextYear: number,
  lastSprintInCurrentYear: SprintWeekNumber,
): Promise<SprintWeekNumber | null> => {
  const weeksInNextYear = getWeeksInYear(nextYear)
  const breakWeeksInNextYear = await BreakWeekOperation.getByYear(nextYear)

  if (breakWeeksInNextYear.length === 0) return null

  const firstWorkWeekInNextYear = getRange({
    start: 1,
    end: weeksInNextYear,
  })
    .remove(breakWeeksInNextYear)
    .first()

  return {
    firstWeek: lastSprintInCurrentYear.lastWeek + 1,
    lastWeek: firstWorkWeekInNextYear,
    isBetweenYears: true,
  }
}
