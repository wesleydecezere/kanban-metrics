import { jest } from "@jest/globals";
import { seedDimSprintWithDeps } from "./dimSprintSeed"; // pega prisma original
import { mockPrisma } from "../../../test/mockPrisma";
import * as util from "./util";

// jest.mock("../operations/DimSprintOperations", () => {
//   return {
//     DimSprintOperations: {
//       propotype: {
//         createWithDeps: jest.fn(),
//       },
//     },
//   };
// });

// teria como mudar implementação dinamicamente?
// jest.mock("./dimSprintSeed", () => {
//   const dimSprintSeedActual =
//     jest.requireActual<typeof import("./dimSprintSeed")>("./dimSprintSeed");

//   return {
//     __esModule: true,
//     ...dimSprintSeedActual,
//     getSprintWeekNumbers: jest.fn().mockReturnValue([
//       { first: 1, last: 2 },
//       // { first: 3, last: 4 },
//       // { first: 5, last: 6 },
//       // { first: 7, last: 8 },
//       // { first: 9, last: 10 },
//       // { first: 11, last: 12 },
//       // { first: 13, last: 14 },
//       // { first: 15, last: 16 },
//       // { first: 17, last: 18 },
//       // { first: 19, last: 20 },
//       // { first: 21, last: 22 },
//       // { first: 23, last: 24 },
//       // { first: 25, last: 26 },
//       // { first: 27, last: 28 },
//       // { first: 29, last: 30 },
//       // { first: 31, last: 32 },
//       // { first: 33, last: 34 },
//       // { first: 35, last: 36 },
//       // { first: 37, last: 38 },
//       // { first: 39, last: 40 },
//       // { first: 41, last: 42 },
//       // { first: 43, last: 44 },
//       // { first: 45, last: 46 },
//       // { first: 47, last: 48 },
//       // { first: 49, last: 50 },
//       // { first: 51, last: 52 },
//     ]),
//   };
// });

describe("seedDimSprintWithDeps", () => {
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

  mockPrisma.dimSprint.create.mockResolvedValue({
    id: 1,
    number: 1,
    endWeekId: 1,
    startWeekId: 2,
  });

  it("should call prisma client with the right parameters", async () => {
    await seedDimSprintWithDeps();

    expect(mockPrisma.dimSprint.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.dimSprint.create).toHaveBeenCalledWith({
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

// describe("getSprintWeekNumbers", () => {});
