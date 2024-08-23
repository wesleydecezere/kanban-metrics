import { prisma } from "../client/client";

export const createSprint = () => {
  return prisma.sprint.create({
    data: {
      name: "foo",
    },
  });
};
