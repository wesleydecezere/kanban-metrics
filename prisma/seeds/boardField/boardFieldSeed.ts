import { getAllProjectV2Fields } from "../../../src/github-gql/command/projectV2FIeld.js";
import { BoardFieldOperations } from "../../../prisma/operations/BoardFieldOperations.js";

export async function seedBoardField() {
  const fields = (await getAllProjectV2Fields()).map((field) => ({
    id: field.id,
    name: field.name,
  }));

  // por que não dá problema parâmetro tiver propriedades a mais do que as esperadas???
  await BoardFieldOperations.createMany(fields);
}
