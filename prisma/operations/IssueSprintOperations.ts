import { prisma } from "../client/client.js";

export class IssueSprintOperations {
  static async upsert(args: { sprintId: number; issueId: string }) {
    const { sprintId, issueId } = args;

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

  static async delete(args: { sprintId: number; issueId: string }) {
    const { sprintId, issueId } = args;

    return prisma.issueSprint.delete({
      where: {
        issueId_sprintId: {
          sprintId,
          issueId,
        },
      },
    });
  }
}
