import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const sprint = await prisma.sprint.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: "SPRINT-2023-1",
    },
  });
  console.log({ primeira: sprint });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
