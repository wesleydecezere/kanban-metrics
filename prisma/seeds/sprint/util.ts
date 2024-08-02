import moment from "moment";
import {
  BREAK_WEEKS_BY_YEAR,
  SPRINT_WEEK_LENGHT,
} from "../../../resource/sprint.config";
import { getRange } from "../../../util/array.util";
import { BreakWeekOperation } from "../../operations/BreakWeekOperation";

type SprintWeekNumber = {
  firstWeek: number;
  lastWeek: number;
  isBetweenYears?: boolean;
};

/**
 * Query break weeks because it will be seed via API
 */
export const getSprintWeekNumbers = async (
  year: number
): Promise<Array<SprintWeekNumber>> => {
  const nextYear = year + 1;

  const { sprints, hasMissingWeeks } = await getSprintsInYear(year);

  if (hasMissingWeeks && hasBreakWeek(nextYear))
    return [...sprints, await getSprintBetweenYears(nextYear, sprints.last())];

  return sprints;
};

const getSprintsInYear = async (
  year: number
): Promise<{ sprints: Array<SprintWeekNumber>; hasMissingWeeks: boolean }> => {
  const weeks = getWeeksInYear(year);
  const breakWeeks = (await BreakWeekOperation.getByYear(year)) ?? [];

  const hasMissingWeeks = (weeks - breakWeeks.length) % SPRINT_WEEK_LENGHT > 0;

  const sprints = getRange({ start: 1, end: weeks })
    .remove(breakWeeks)
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

const getSprintBetweenYears = async (
  nextYear: number,
  lastSprintInCurrentYear: SprintWeekNumber
): Promise<SprintWeekNumber> => {
  const weeksInNextYear = getWeeksInYear(nextYear);
  const breakWeeksInNextYear = await BreakWeekOperation.getByYear(nextYear);

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
