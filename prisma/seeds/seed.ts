import moment from "moment"
import { seedSprintWithDeps } from "./sprint/sprintSeed.js"
import { prisma } from "../client/client.js"
import { seedBreakWeek } from "./breakWeek/breakWeekSeed.js"

moment.locale("pt-br", {
  week: {
    dow: 1,
  },
})

async function main() {
  await seedBreakWeek()
  await seedSprintWithDeps()
}

main()
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
