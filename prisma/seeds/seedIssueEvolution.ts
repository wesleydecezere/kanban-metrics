import { Issue } from "@prisma/client";
import { getFieldValueBy } from "../../src/github-gql/command/projectV2Item.js";
import {
  FieldIdsBySystemFieldName,
  SeedSystemFieldResult,
} from "./systemField/systemFieldSeed.js";
import {
  IssueEvolutionCreateProps,
  IssueEvolutionOperations,
} from "../operations/IssueEvolutionOperations.js";

// TODO impl tables for this
const POSITION_OUT_SPRINT = "Backlog";

export type SeedIssueEvolutionResult = ReturnType<typeof seedIssueEvolution>;

// TODO label errors, log info
// TODO break into small fn
export async function seedIssueEvolution(
  issues: Issue[],
  systemFields: Awaited<SeedSystemFieldResult> | undefined
) {
  if (!systemFields) {
    throw new Error("System fields not found");
  }

  // TODO map? groupBy?
  const positionFieldName = systemFields.find(
    ({ boardField }) =>
      boardField.id === FieldIdsBySystemFieldName.POSITION.boardFieldId
  );
  const pointsFieldName = systemFields.find(
    ({ boardField }) =>
      boardField.id === FieldIdsBySystemFieldName.POINTS_ESTIMATE.boardFieldId
  );
  const donePercentageFieldName = systemFields.find(
    ({ boardField }) =>
      boardField.id === FieldIdsBySystemFieldName.DONE_PERCENTAGE.boardFieldId
  );

  if (!positionFieldName) {
    throw new Error("Position board field not found");
  }

  const issueEvolutionBatch: IssueEvolutionCreateProps[] = [];

  for (const issue of issues) {
    const positionValue = await getFieldValueBy({
      itemNodeId: issue.id,
      fieldName: positionFieldName.boardField.name,
    });

    if (positionValue !== POSITION_OUT_SPRINT) continue;

    const pointsEstimateValue =
      pointsFieldName &&
      (await getFieldValueBy({
        itemNodeId: issue.id,
        fieldName: pointsFieldName.boardField.name,
      }));

    const donePercentageValue =
      donePercentageFieldName &&
      (await getFieldValueBy({
        itemNodeId: issue.id,
        fieldName: donePercentageFieldName.boardField.name,
      }));

    const now = new Date();

    issueEvolutionBatch.push({
      issueId: issue.id,
      date: now,
      position: positionValue,
      pointsEstimate: pointsEstimateValue,
      donePercentage: donePercentageValue,
    });
  }

  await IssueEvolutionOperations.createMany(issueEvolutionBatch);
}
