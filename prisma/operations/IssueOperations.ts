import { prisma } from "../client/client.js";

type IssueProps = {
  id: string;
  number: number;
  title: string;
};

export class IssueOperations {
  static async createIfAbsent(props: IssueProps) {
    return prisma.issue.upsert({
      where: { id: props.id },
      update: {},
      create: props,
    });
  }

  static async updateTitleById(
    title: IssueProps["title"],
    id: IssueProps["id"]
  ) {
    return prisma.issue.update({
      where: { id },
      data: { title },
    });
  }

  static async updateTitleOrCreate(props: IssueProps) {
    return prisma.issue.upsert({
      where: { id: props.id },
      update: { title: props.title },
      create: props,
    });
  }
}
