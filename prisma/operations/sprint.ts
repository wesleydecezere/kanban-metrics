import { prisma } from "../client/client";

export const createSprint = () => {
  console.log(Object.keys(prisma));

  return prisma.sprint.create({
    data: {
      name: "foo",
    },
  });
};
