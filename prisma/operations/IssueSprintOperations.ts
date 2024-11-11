import { prisma } from "../client/client";

export class IssueSprintOperations {
  static async upsert(sprintId: number, issueId: string) {
    return prisma.issueSprint.upsert({
      where: {
        issueId_sprintId: {
          sprintId,
          issueId,
        },
      },
      create: {
        sprintId,
        issueId,
      },
      update: {},
    });
  }
}
