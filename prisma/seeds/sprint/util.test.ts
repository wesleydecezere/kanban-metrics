import { getSprintWeekNumbers } from "./util";
import * as sprintConfig from "../../../resource/sprint.config";

describe("getSprintWeekNumbers", () => {
  it.each([52, 53])(
    "when the year has %d weeks, the sprint has a length of 2 weeks and there are no break weeks, it should return the starting and ending week numbers correctly",
    (weeksInYear: number) => {
      let year: number;

      if (weeksInYear === 52) {
        year = 2031;
      } else {
        year = 2032;
      }

      jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
      jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {});

      const result = getSprintWeekNumbers(year);

      expect(result).toEqual([
        { firstWeek: 1, lastWeek: 2 },
        { firstWeek: 3, lastWeek: 4 },
        { firstWeek: 5, lastWeek: 6 },
        { firstWeek: 7, lastWeek: 8 },
        { firstWeek: 9, lastWeek: 10 },
        { firstWeek: 11, lastWeek: 12 },
        { firstWeek: 13, lastWeek: 14 },
        { firstWeek: 15, lastWeek: 16 },
        { firstWeek: 17, lastWeek: 18 },
        { firstWeek: 19, lastWeek: 20 },
        { firstWeek: 21, lastWeek: 22 },
        { firstWeek: 23, lastWeek: 24 },
        { firstWeek: 25, lastWeek: 26 },
        { firstWeek: 27, lastWeek: 28 },
        { firstWeek: 29, lastWeek: 30 },
        { firstWeek: 31, lastWeek: 32 },
        { firstWeek: 33, lastWeek: 34 },
        { firstWeek: 35, lastWeek: 36 },
        { firstWeek: 37, lastWeek: 38 },
        { firstWeek: 39, lastWeek: 40 },
        { firstWeek: 41, lastWeek: 42 },
        { firstWeek: 43, lastWeek: 44 },
        { firstWeek: 45, lastWeek: 46 },
        { firstWeek: 47, lastWeek: 48 },
        { firstWeek: 49, lastWeek: 50 },
        { firstWeek: 51, lastWeek: 52 },
      ]);
    }
  );

  it.each([52, 53])(
    "when the year has %d weeks, the sprint has a length of 3 weeks and there are no break weeks, it should return the starting and ending week numbers correctly",
    (weeksInYear) => {
      let year: number;

      if (weeksInYear === 52) {
        year = 2031;
      } else {
        year = 2032;
      }

      jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 3);
      jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", { 2025: [] });

      const result = getSprintWeekNumbers(year);

      expect(result).toEqual([
        { firstWeek: 1, lastWeek: 3 },
        { firstWeek: 4, lastWeek: 6 },
        { firstWeek: 7, lastWeek: 9 },
        { firstWeek: 10, lastWeek: 12 },
        { firstWeek: 13, lastWeek: 15 },
        { firstWeek: 16, lastWeek: 18 },
        { firstWeek: 19, lastWeek: 21 },
        { firstWeek: 22, lastWeek: 24 },
        { firstWeek: 25, lastWeek: 27 },
        { firstWeek: 28, lastWeek: 30 },
        { firstWeek: 31, lastWeek: 33 },
        { firstWeek: 34, lastWeek: 36 },
        { firstWeek: 37, lastWeek: 39 },
        { firstWeek: 40, lastWeek: 42 },
        { firstWeek: 43, lastWeek: 45 },
        { firstWeek: 46, lastWeek: 48 },
        { firstWeek: 49, lastWeek: 51 },
      ]);
    }
  );

  it("when the year has 52 weeks, the sprint has a length of 2 weeks and there are some break weeks on current year, it should return the starting and ending week numbers correctly", () => {
    const year = 2031;

    jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
    jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {
      [year]: [1, 15, 52],
    });

    const result = getSprintWeekNumbers(year);

    expect(result).toEqual([
      { firstWeek: 2, lastWeek: 3 },
      { firstWeek: 4, lastWeek: 5 },
      { firstWeek: 6, lastWeek: 7 },
      { firstWeek: 8, lastWeek: 9 },
      { firstWeek: 10, lastWeek: 11 },
      { firstWeek: 12, lastWeek: 13 },
      { firstWeek: 14, lastWeek: 16 },
      { firstWeek: 17, lastWeek: 18 },
      { firstWeek: 19, lastWeek: 20 },
      { firstWeek: 21, lastWeek: 22 },
      { firstWeek: 23, lastWeek: 24 },
      { firstWeek: 25, lastWeek: 26 },
      { firstWeek: 27, lastWeek: 28 },
      { firstWeek: 29, lastWeek: 30 },
      { firstWeek: 31, lastWeek: 32 },
      { firstWeek: 33, lastWeek: 34 },
      { firstWeek: 35, lastWeek: 36 },
      { firstWeek: 37, lastWeek: 38 },
      { firstWeek: 39, lastWeek: 40 },
      { firstWeek: 41, lastWeek: 42 },
      { firstWeek: 43, lastWeek: 44 },
      { firstWeek: 45, lastWeek: 46 },
      { firstWeek: 47, lastWeek: 48 },
      { firstWeek: 49, lastWeek: 50 },
    ]);
  });

  it("when the year has 53 weeks, the sprint has a length of 2 weeks and there are some break weeks on current year, it should return the starting and ending week numbers correctly", () => {
    const year = 2032;

    jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
    jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {
      [year]: [1, 15, 53],
    });

    const result = getSprintWeekNumbers(year);

    expect(result).toEqual([
      { firstWeek: 2, lastWeek: 3 },
      { firstWeek: 4, lastWeek: 5 },
      { firstWeek: 6, lastWeek: 7 },
      { firstWeek: 8, lastWeek: 9 },
      { firstWeek: 10, lastWeek: 11 },
      { firstWeek: 12, lastWeek: 13 },
      { firstWeek: 14, lastWeek: 16 },
      { firstWeek: 17, lastWeek: 18 },
      { firstWeek: 19, lastWeek: 20 },
      { firstWeek: 21, lastWeek: 22 },
      { firstWeek: 23, lastWeek: 24 },
      { firstWeek: 25, lastWeek: 26 },
      { firstWeek: 27, lastWeek: 28 },
      { firstWeek: 29, lastWeek: 30 },
      { firstWeek: 31, lastWeek: 32 },
      { firstWeek: 33, lastWeek: 34 },
      { firstWeek: 35, lastWeek: 36 },
      { firstWeek: 37, lastWeek: 38 },
      { firstWeek: 39, lastWeek: 40 },
      { firstWeek: 41, lastWeek: 42 },
      { firstWeek: 43, lastWeek: 44 },
      { firstWeek: 45, lastWeek: 46 },
      { firstWeek: 47, lastWeek: 48 },
      { firstWeek: 49, lastWeek: 50 },
      { firstWeek: 51, lastWeek: 52 },
    ]);
  });

  it("when the year has 52 weeks, the sprint has a length of 2 weeks and there are some break weeks on next year, it should return the starting and ending week numbers correctly", () => {
    const year = 2031;

    jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
    jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {
      [year]: [1, 15, 52],
      [year + 1]: [1],
    });

    const result = getSprintWeekNumbers(year);

    expect(result).toEqual([
      { firstWeek: 2, lastWeek: 3 },
      { firstWeek: 4, lastWeek: 5 },
      { firstWeek: 6, lastWeek: 7 },
      { firstWeek: 8, lastWeek: 9 },
      { firstWeek: 10, lastWeek: 11 },
      { firstWeek: 12, lastWeek: 13 },
      { firstWeek: 14, lastWeek: 16 },
      { firstWeek: 17, lastWeek: 18 },
      { firstWeek: 19, lastWeek: 20 },
      { firstWeek: 21, lastWeek: 22 },
      { firstWeek: 23, lastWeek: 24 },
      { firstWeek: 25, lastWeek: 26 },
      { firstWeek: 27, lastWeek: 28 },
      { firstWeek: 29, lastWeek: 30 },
      { firstWeek: 31, lastWeek: 32 },
      { firstWeek: 33, lastWeek: 34 },
      { firstWeek: 35, lastWeek: 36 },
      { firstWeek: 37, lastWeek: 38 },
      { firstWeek: 39, lastWeek: 40 },
      { firstWeek: 41, lastWeek: 42 },
      { firstWeek: 43, lastWeek: 44 },
      { firstWeek: 45, lastWeek: 46 },
      { firstWeek: 47, lastWeek: 48 },
      { firstWeek: 49, lastWeek: 50 },
      { firstWeek: 51, lastWeek: 2, isBetweenYears: true },
    ]);
  });

  it("when the year has 53 weeks, the sprint has a length of 2 weeks and there are some break weeks on next year, it should return the starting and ending week numbers correctly", () => {
    const year = 2032;

    jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
    jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {
      [year]: [1, 15, 53],
      [year + 1]: [1],
    });

    const result = getSprintWeekNumbers(year);

    expect(result).toEqual([
      { firstWeek: 2, lastWeek: 3 },
      { firstWeek: 4, lastWeek: 5 },
      { firstWeek: 6, lastWeek: 7 },
      { firstWeek: 8, lastWeek: 9 },
      { firstWeek: 10, lastWeek: 11 },
      { firstWeek: 12, lastWeek: 13 },
      { firstWeek: 14, lastWeek: 16 },
      { firstWeek: 17, lastWeek: 18 },
      { firstWeek: 19, lastWeek: 20 },
      { firstWeek: 21, lastWeek: 22 },
      { firstWeek: 23, lastWeek: 24 },
      { firstWeek: 25, lastWeek: 26 },
      { firstWeek: 27, lastWeek: 28 },
      { firstWeek: 29, lastWeek: 30 },
      { firstWeek: 31, lastWeek: 32 },
      { firstWeek: 33, lastWeek: 34 },
      { firstWeek: 35, lastWeek: 36 },
      { firstWeek: 37, lastWeek: 38 },
      { firstWeek: 39, lastWeek: 40 },
      { firstWeek: 41, lastWeek: 42 },
      { firstWeek: 43, lastWeek: 44 },
      { firstWeek: 45, lastWeek: 46 },
      { firstWeek: 47, lastWeek: 48 },
      { firstWeek: 49, lastWeek: 50 },
      { firstWeek: 51, lastWeek: 52 },
    ]);
  });
});
