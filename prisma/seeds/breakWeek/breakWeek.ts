import { BREAK_WEEKS_BY_YEAR } from "../../../config/sprint"
import {
  type BreakWeekInput,
  BreakWeekOperation,
} from "../../operations/BreakWeekOperation"

export function seedBreakWeek() {
  const batch: BreakWeekInput[] = []

  for (const [year, weeks] of Object.entries(BREAK_WEEKS_BY_YEAR)) {
    for (const week of weeks) {
      batch.push({
        year: Number.parseInt(year),
        week: week,
      })
    }
  }

  return BreakWeekOperation.createMany(batch)
}
