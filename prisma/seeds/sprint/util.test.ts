import { getSprintWeekNumbers } from "./util";

describe("getSprintWeekNumbers", () => {
  it.each([52, 53])(
    "should return an array with the starting and ending week numbers of each sprint of the year",
    (weeksOnYear: number) => {
      const result = getSprintWeekNumbers(weeksOnYear);
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
});
