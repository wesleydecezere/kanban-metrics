import moment, { type Moment } from "moment"

export const getWeeksInYear = (year: number): number =>
  moment.utc().year(year).isoWeeksInYear()

export const getMoment = (year: number, week: number): Moment =>
  moment.utc().year(year).week(week)
