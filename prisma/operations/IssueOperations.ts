import { Issue } from "@prisma/client";
import { prisma } from "../client/client.js";

export class IssueOperations {
  static async create(props: Issue) {
    return prisma.issue.create({
      data: props,
    });
  }

  static async updateTitleById(title: Issue["title"], id: Issue["id"]) {
    return prisma.issue.update({
      data: {
        title,
      },
      where: {
        id,
      },
    });
  }

  static async findBySprintId(sprintId: number) {
    return prisma.issue.findMany({
      where: {
        sprints: {
          some: {
            sprint: {
              id: sprintId,
            },
          },
        },
      },
    });
  }

  static async findByPosition(...position: string[]) {
    return prisma.issue.findMany({
      where: {
        evolutions: {
          some: {
            position: {
              in: position,
            },
          },
        },
      },
    });
  }
}
