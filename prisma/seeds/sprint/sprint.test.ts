import { jest } from "@jest/globals"
import { mockPrisma } from "../../../test/mockPrisma"
import { seedSprintWithDeps } from "./sprint"
import * as sprintWeek from "./sprintWeeks"

describe("seedSprintWithDeps - should call prisma client with the right parameters", () => {
  const mockDate = new Date("2025-07-15")
  const mockYear = mockDate.getUTCFullYear()

  beforeEach(() => {
    jest.resetAllMocks()
    jest.useFakeTimers().setSystemTime(mockDate)
    mockPrisma.sprint.create.mockResolvedValue({
      id: 1,
      number: 1,
      endWeekId: 1,
      startWeekId: 2,
    })
  })

  it("sprint weeks in same year", async () => {
    const mockFirstWeekStartDate = new Date("2024-12-29")
    const mockFirstWeekEndDate = new Date("2025-01-04T23:59:59.999Z")
    const mockSecondWeekStartDate = new Date("2025-01-05")
    const mockSecondWeekEndDate = new Date("2025-01-11T23:59:59.999Z")
    const sprintFirstWeekNumber = 1
    const sprintLastWeekNumber = 2

    jest.spyOn(sprintWeek, "getSprintWeekNumbers").mockResolvedValue([
      {
        firstWeek: sprintFirstWeekNumber,
        lastWeek: sprintLastWeekNumber,
        isBetweenYears: false,
      },
    ])

    await seedSprintWithDeps()

    expect(mockPrisma.sprint.create).toHaveBeenCalledTimes(1)
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
    })
  })

  it("sprint weeks beetwen years", async () => {
    const mockFirstWeekStartDate = new Date("2025-12-21")
    const mockFirstWeekEndDate = new Date("2025-12-27T23:59:59.999Z")
    const mockSecondWeekStartDate = new Date("2025-12-28")
    const mockSecondWeekEndDate = new Date("2026-01-03T23:59:59.999Z")
    const sprintFirstWeekNumber = 52
    const sprintLastWeekNumber = 1

    jest.spyOn(sprintWeek, "getSprintWeekNumbers").mockResolvedValue([
      {
        firstWeek: sprintFirstWeekNumber,
        lastWeek: sprintLastWeekNumber,
        isBetweenYears: true,
      },
    ])

    await seedSprintWithDeps()

    expect(mockPrisma.sprint.create).toHaveBeenCalledTimes(1)
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
            year: mockYear + 1,
            start: mockSecondWeekStartDate,
            end: mockSecondWeekEndDate,
          },
        },
      },
    })
  })
})
