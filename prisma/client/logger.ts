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
    `(${duration}) ms with params ${params}`;

  console.log(chalk.magenta(`prisma:query`), message);
};
