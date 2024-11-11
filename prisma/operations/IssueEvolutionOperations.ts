import { IssueEvolution } from "@prisma/client";
import { prisma } from "../client/client.js";

export type IssueEvolutionCreateProps = Omit<IssueEvolution, "id">;

export class IssueEvolutionOperations {
  static async create(props: IssueEvolutionCreateProps) {
    return prisma.issueEvolution.create({
      data: props,
    });
  }

  static async createMany(props: IssueEvolutionCreateProps[]) {
    return prisma.issueEvolution.createMany({
      data: props,
    });
  }
}
