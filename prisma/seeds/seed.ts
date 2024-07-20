import moment from "moment";
import { seedDimSprintWithDeps } from "./dim-sprint/dimSprintSeed.js";
import { prisma } from "../client/client.js";

moment.locale("pt-br", {
  week: {
    dow: 1,
  },
});

async function main() {
  await seedDimSprintWithDeps();
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
