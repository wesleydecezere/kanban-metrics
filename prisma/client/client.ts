import { PrismaClient } from "@prisma/client";

import { logDefinitions, queryLogger } from "./logger";

export const prisma = new PrismaClient({
  log: logDefinitions,
});

prisma.$on("query", queryLogger);
