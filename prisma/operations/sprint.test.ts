import { mockPrisma } from "../../test/mockPrisma";

import { createSprint } from "./sprint";

it("should create new sprint", async () => {
  const expected = {
    id: 1,
    name: "SPRINT-2023-1",
  };

  mockPrisma.sprint.create.mockResolvedValue(expected);

  await expect(createSprint()).resolves.toEqual(expected);
});
