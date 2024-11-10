import { BoardField } from "@prisma/client";
import { prisma } from "../client/client.js";

export type BoardFieldCreateProps = Pick<BoardField, "id" | "name">;

export class BoardFieldOperations {
  static async create({ id, name }: BoardFieldCreateProps) {
    return prisma.boardField.create({
      data: {
        id,
        name,
      },
    });
  }

  static async upsert({ id, name }: BoardFieldCreateProps) {
    return prisma.boardField.upsert({
      create: {
        id,
        name,
      },
      update: {
        name,
      },
      where: {
        id,
      },
    });
  }

  static async createMany(boardFields: { id: string; name: string }[]) {
    return prisma.boardField.createMany({
      data: boardFields,
    });
  }
}
