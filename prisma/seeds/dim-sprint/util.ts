const SPRINT_LENGTH = 2;

export const getSprintWeekNumbers = (
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
