import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

import { prisma } from "../prisma/client/client";

// fazer isso em todo teste também funciona
jest.mock("../prisma/client/client", () => {
  console.log("mocked");

  return {
    prisma: mockDeep<PrismaClient>(),
  };
});

console.log(Object.keys(prisma));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
