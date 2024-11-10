import { prisma } from "../client/client.js";

export class SystemFieldOperations {
  static async findAll() {
    return prisma.systemField.findMany({
      select: { name: true, boardField: { select: { name: true } } },
    });
  }
}
