import { BREAK_WEEKS_BY_YEAR } from "../../../resource/sprint.config";
import {
  BreakWeekInput,
  BreakWeekOperation,
} from "../../operations/BreakWeekOperation";

export function seedBreakWeek() {
  const batch: BreakWeekInput[] = [];

  Object.entries(BREAK_WEEKS_BY_YEAR).forEach(([year, weeks]) => {
    weeks.forEach((week) => {
      batch.push({
        year: parseInt(year),
        week: week,
      });
    });
  });

  return BreakWeekOperation.createMany(batch);
}
