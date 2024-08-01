import { PrismaClient } from "@prisma/client";

import { logDefinitions, queryLogger } from "./logger";

export const prisma = new PrismaClient({
  log: logDefinitions,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
prisma.$on("query", queryLogger);