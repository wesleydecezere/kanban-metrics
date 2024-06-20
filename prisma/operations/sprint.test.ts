import { prismaMock } from "../../test/prismaMock"; // se ficar depois do import do prisma, não pega mock

import { createSprint } from "./sprint";

it("should create new sprint", async () => {
  const expected = {
    id: 1,
    name: "SPRINT-2023-1",
  };

  prismaMock.sprint.create.mockResolvedValue(expected);

  await expect(createSprint()).resolves.toEqual(expected);
});
