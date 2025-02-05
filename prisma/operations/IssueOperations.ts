import { prisma } from "../client/client.js";

type IssueProps = {
  id: string;
  number: number;
  title: string;
};

export class IssueOperations {
  static async create(props: IssueProps) {
    return prisma.issue.create({
      data: props,
    });
  }
}
