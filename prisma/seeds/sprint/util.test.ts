import { getSprintWeekNumbers } from "./util";
import * as sprintConfig from "../../../resource/sprint.config";

describe("getSprintWeekNumbers", () => {
  it.each([52, 53])(
    "when the year has %d weeks, the sprint has a length of 2 weeks and there are no break weeks, it should return the starting and ending week numbers correctly",
    (weeksOnYear: number) => {
      jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
      jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {});

      const result = getSprintWeekNumbers(
        weeksOnYear,
        sprintConfig.BREAK_WEEKS_BY_YEAR[2025]
      );

      expect(result).toHaveLength(26);
      expect(result).toEqual([
        { first: 1, last: 2 },
        { first: 3, last: 4 },
        { first: 5, last: 6 },
        { first: 7, last: 8 },
        { first: 9, last: 10 },
        { first: 11, last: 12 },
        { first: 13, last: 14 },
        { first: 15, last: 16 },
        { first: 17, last: 18 },
        { first: 19, last: 20 },
        { first: 21, last: 22 },
        { first: 23, last: 24 },
        { first: 25, last: 26 },
        { first: 27, last: 28 },
        { first: 29, last: 30 },
        { first: 31, last: 32 },
        { first: 33, last: 34 },
        { first: 35, last: 36 },
        { first: 37, last: 38 },
        { first: 39, last: 40 },
        { first: 41, last: 42 },
        { first: 43, last: 44 },
        { first: 45, last: 46 },
        { first: 47, last: 48 },
        { first: 49, last: 50 },
        { first: 51, last: 52 },
      ]);
    }
  );

  it.each([52, 53])(
    "when the year has %d weeks, the sprint has a length of 3 weeks and there are no break weeks, it should return the starting and ending week numbers correctly",
    (weeksOnYear: number) => {
      jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 3);
      jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", { 2025: [] });

      const result = getSprintWeekNumbers(
        weeksOnYear,
        sprintConfig.BREAK_WEEKS_BY_YEAR[2025]
      );

      expect(result).toHaveLength(17);
      expect(result).toEqual([
        { first: 1, last: 3 },
        { first: 4, last: 6 },
        { first: 7, last: 9 },
        { first: 10, last: 12 },
        { first: 13, last: 15 },
        { first: 16, last: 18 },
        { first: 19, last: 21 },
        { first: 22, last: 24 },
        { first: 25, last: 27 },
        { first: 28, last: 30 },
        { first: 31, last: 33 },
        { first: 34, last: 36 },
        { first: 37, last: 39 },
        { first: 40, last: 42 },
        { first: 43, last: 45 },
        { first: 46, last: 48 },
        { first: 49, last: 51 },
      ]);
    }
  );

  it("when the year has 52 weeks, the sprint has a length of 2 weeks and there are some break weeks, it should return the starting and ending week numbers correctly", () => {
    const weeksOnYear = 52;
    jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
    jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {
      2025: [1, 15, weeksOnYear],
    });

    const result = getSprintWeekNumbers(
      weeksOnYear,
      sprintConfig.BREAK_WEEKS_BY_YEAR[2025]
    );

    expect(result).toHaveLength(24);
    expect(result).toEqual([
      { first: 2, last: 3 },
      { first: 4, last: 5 },
      { first: 6, last: 7 },
      { first: 8, last: 9 },
      { first: 10, last: 11 },
      { first: 12, last: 13 },
      { first: 14, last: 16 },
      { first: 17, last: 18 },
      { first: 19, last: 20 },
      { first: 21, last: 22 },
      { first: 23, last: 24 },
      { first: 25, last: 26 },
      { first: 27, last: 28 },
      { first: 29, last: 30 },
      { first: 31, last: 32 },
      { first: 33, last: 34 },
      { first: 35, last: 36 },
      { first: 37, last: 38 },
      { first: 39, last: 40 },
      { first: 41, last: 42 },
      { first: 43, last: 44 },
      { first: 45, last: 46 },
      { first: 47, last: 48 },
      { first: 49, last: 50 },
    ]);
  });

  it("when the year has 53 weeks, the sprint has a length of 2 weeks and there are some break weeks, it should return the starting and ending week numbers correctly", () => {
    const weeksOnYear = 53;
    jest.replaceProperty(sprintConfig, "SPRINT_WEEK_LENGHT", 2);
    jest.replaceProperty(sprintConfig, "BREAK_WEEKS_BY_YEAR", {
      2025: [1, 15, weeksOnYear],
    });

    const result = getSprintWeekNumbers(
      weeksOnYear,
      sprintConfig.BREAK_WEEKS_BY_YEAR[2025]
    );

    expect(result).toHaveLength(25);
    expect(result).toEqual([
      { first: 2, last: 3 },
      { first: 4, last: 5 },
      { first: 6, last: 7 },
      { first: 8, last: 9 },
      { first: 10, last: 11 },
      { first: 12, last: 13 },
      { first: 14, last: 16 },
      { first: 17, last: 18 },
      { first: 19, last: 20 },
      { first: 21, last: 22 },
      { first: 23, last: 24 },
      { first: 25, last: 26 },
      { first: 27, last: 28 },
      { first: 29, last: 30 },
      { first: 31, last: 32 },
      { first: 33, last: 34 },
      { first: 35, last: 36 },
      { first: 37, last: 38 },
      { first: 39, last: 40 },
      { first: 41, last: 42 },
      { first: 43, last: 44 },
      { first: 45, last: 46 },
      { first: 47, last: 48 },
      { first: 49, last: 50 },
      { first: 51, last: 52 },
    ]);
  });
});
