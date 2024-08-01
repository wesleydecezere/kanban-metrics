import { jest } from "@jest/globals";
import { seedSprintWithDeps } from "./sprintSeed";
import { mockPrisma } from "../../../test/mockPrisma";
import * as util from "./util";

describe("seedSprintWithDeps", () => {
  const mockDate = new Date("2025-07-15");
  const mockYear = mockDate.getUTCFullYear();
  const mockFirstWeekStartDate = new Date("2024-12-29");
  const mockFirstWeekEndDate = new Date("2025-01-04T23:59:59.999Z");
  const mockSecondWeekStartDate = new Date("2025-01-05");
  const mockSecondWeekEndDate = new Date("2025-01-11T23:59:59.999Z");
  jest.useFakeTimers().setSystemTime(mockDate);

  const sprintFirstWeekNumber = 1;
  const sprintLastWeekNumber = 2;

  jest
    .spyOn(util, "getSprintWeekNumbers")
    .mockReturnValue([
      { first: sprintFirstWeekNumber, last: sprintLastWeekNumber },
    ]);

  mockPrisma.sprint.create.mockResolvedValue({
    id: 1,
    number: 1,
    endWeekId: 1,
    startWeekId: 2,
  });

  it("should call prisma client with the right parameters", async () => {
    await seedSprintWithDeps();

    expect(mockPrisma.sprint.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.sprint.create).toHaveBeenCalledWith({
      data: {
        number: 1,
        startWeek: {
          create: {
            week: sprintFirstWeekNumber,
            year: mockYear,
            start: mockFirstWeekStartDate,
            end: mockFirstWeekEndDate,
          },
        },
        endWeek: {
          create: {
            week: sprintLastWeekNumber,
            year: mockYear,
            start: mockSecondWeekStartDate,
            end: mockSecondWeekEndDate,
          },
        },
      },
    });
  });
});
