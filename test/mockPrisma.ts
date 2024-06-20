import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { jest } from "@jest/globals";

import { prisma } from "../prisma/client/client.js";

jest.mock("../prisma/client/client", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(mockPrisma);
});

export const mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
