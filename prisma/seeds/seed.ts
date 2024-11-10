import moment from "moment";
import { seedSprintWithDeps } from "./sprint/sprintSeed.js";
import { prisma } from "../client/client.js";
import { seedSystemField } from "./systemField/systemFieldSeed.js";
import { seedBoardField } from "./boardField/boardFieldSeed.js";

moment.locale("pt-br", {
  week: {
    dow: 1,
  },
});

async function main() {
  await seedSprintWithDeps();
  await seedBoardField();
  await seedSystemField();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
