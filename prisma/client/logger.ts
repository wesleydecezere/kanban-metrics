import type { Prisma } from "@prisma/client"
import chalk from "chalk"

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
]

export const queryLogger = ({ query, duration }: Prisma.QueryEvent) => {
  if (!query.startsWith("INSERT")) return

  const relation = query.match(/INTO "public"\."(?<relation>.*)" \(/)?.groups
    ?.relation

  console.log(
    chalk.magenta("prisma:query"),
    `Insert into ${chalk.bold(relation)} (${duration} ms)`,
  )
}
