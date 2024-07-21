import { SPRINT_WEEK_LENGHT } from "../../../resource/sprint.config";

export const getSprintWeekNumbers = (
  weeksOnYear: number,
  breakWeeks: number[] | undefined
): Array<{
  first: number;
  last: number;
}> => {
  const weekNumbers = Array.from({ length: weeksOnYear }, (_, idx) => idx + 1);
  const workWeekNumbers = weekNumbers
    .filter((week) => !breakWeeks?.includes(week))
    .sort((a, b) => a - b);

  const sprintsOnYear = workWeekNumbers.length / SPRINT_WEEK_LENGHT;

  return Array.from({ length: sprintsOnYear }, (_, idx) => {
    const offset = idx * SPRINT_WEEK_LENGHT;

    return {
      first: workWeekNumbers[offset],
      last: workWeekNumbers[offset + SPRINT_WEEK_LENGHT - 1],
    };
  });
};
