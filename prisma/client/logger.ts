import { Prisma } from "@prisma/client";
import chalk from "chalk";

export const logDefinitions: Prisma.LogDefinition[] = [
  {
    emit: "event",
    level: "query",
  },
  {
    emit: "stdout",
    level: "error",
  },
  {
    emit: "stdout",
    level: "info",
  },
  {
    emit: "stdout",
    level: "warn",
  },
];

export const queryLogger = ({ query, duration, params }: Prisma.QueryEvent) => {
  if (!query.startsWith("INSERT")) return;

  const relation = query.match(/INTO "public"\."(?<relation>.*)" \(/)?.groups
    ?.relation;

  const message =
    `Insert into ${chalk.bold(relation)} ` +
    `with params ${params} (${duration} ms)`;

  console.log(chalk.magenta(`prisma:query`), message);
};
