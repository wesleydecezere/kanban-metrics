import { IssueEvolution } from "@prisma/client";
import { prisma } from "../client/client.js";

type IssueEvolutionCreateProps = Omit<IssueEvolution, "id">;

export class IssueEvolutionOperations {
  static async create(props: IssueEvolutionCreateProps) {
    return prisma.issueEvolution.create({
      data: props,
    });
  }
}
