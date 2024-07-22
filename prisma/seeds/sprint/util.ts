import moment from "moment";
import {
  BREAK_WEEKS_BY_YEAR,
  SPRINT_WEEK_LENGHT,
} from "../../../resource/sprint.config";
import { getRange } from "../../../util/array.util";

type SprintWeekNumber = {
  firstWeek: number;
  lastWeek: number;
  isBetweenYears?: boolean;
};

export const getSprintWeekNumbers = (year: number): Array<SprintWeekNumber> => {
  const nextYear = year + 1;

  const { sprints, hasMissingWeeks } = getSprintsInYear(year);

  if (hasMissingWeeks && hasBreakWeek(nextYear))
    return [...sprints, getSprintBetweenYears(nextYear, sprints.last())];

  return sprints;
};

const getSprintsInYear = (
  year: number
): { sprints: Array<SprintWeekNumber>; hasMissingWeeks: boolean } => {
  const weeks = getWeeksInYear(year);
  const breakWeeks = BREAK_WEEKS_BY_YEAR[year] ?? [];

  const hasMissingWeeks = (weeks - breakWeeks.length) % SPRINT_WEEK_LENGHT > 0;

  const sprints = getRange({ start: 1, end: weeks })
    .remove(BREAK_WEEKS_BY_YEAR[year])
    .partition(SPRINT_WEEK_LENGHT)
    .filter((part) => part.length === SPRINT_WEEK_LENGHT)
    .map(
      (part): SprintWeekNumber => ({
        firstWeek: part.first(),
        lastWeek: part.last(),
      })
    );

  return {
    sprints,
    hasMissingWeeks,
  };
};

const getSprintBetweenYears = (
  nextYear: number,
  lastSprintInCurrentYear: SprintWeekNumber
): SprintWeekNumber => {
  const weeksInNextYear = getWeeksInYear(nextYear);
  const breakWeeksInNextYear = BREAK_WEEKS_BY_YEAR[nextYear];

  const firstWorkWeekInNextYear = getRange({
    start: 1,
    length: weeksInNextYear,
  }).find((week) => !breakWeeksInNextYear.includes(week));

  return {
    firstWeek: lastSprintInCurrentYear.lastWeek + 1,
    lastWeek: firstWorkWeekInNextYear!,
    isBetweenYears: true,
  };
};

const hasBreakWeek = (year: number) => BREAK_WEEKS_BY_YEAR[year]?.length > 0;
const getWeeksInYear = (year: number) =>
  moment.utc().year(year).isoWeeksInYear();
