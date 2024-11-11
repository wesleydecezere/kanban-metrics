import { prisma } from "../client/client";
import { getAllIssues } from "../../src/github-gql/command/issue/getAllIssues.js";

// TODO log info
export async function seedIssue() {
  const issues = await getAllIssues();
  await prisma.issue.createMany({
    data: issues,
  });
  return issues;
}
