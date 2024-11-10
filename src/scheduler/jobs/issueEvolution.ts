import { TIssue, TSystemFieldName } from "../../../prisma/client/types.js";
import {
  getFieldValueBy,
  GetFieldValueByResult,
} from "../../github-gql/command/projectsV2Item.js";
import { SystemFieldOperations } from "../../../prisma/operations/SystemFieldOperations.js";
import { IssueEvolutionOperations } from "../../../prisma/operations/IssueEvolutionOperations.js";

type IssueEvolutionInfo = Partial<
  Record<TSystemFieldName, GetFieldValueByResult>
>;

export async function findIssueEvolutionInfo(issue: TIssue) {
  const systemFields = await SystemFieldOperations.findAll();

  const issueEvolutionFieldValueByName: IssueEvolutionInfo = {};

  systemFields.forEach(async (systemField) => {
    const fieldValue = await getFieldValueBy({
      itemNodeId: issue.id,
      fieldName: systemField.boardField.name,
    });

    issueEvolutionFieldValueByName[systemField.name] = fieldValue;
  });

  return issueEvolutionFieldValueByName;
}

export async function saveIssueEvolution(
  issue: TIssue,
  issueEvolucaoFieldValueByName: IssueEvolutionInfo
) {
  await IssueEvolutionOperations.create({
    issueId: issue.id,
    // se for por webhook, usar data do evento
    date: new Date(),
    position: issueEvolucaoFieldValueByName.POSITION,
    pointsEstimate: issueEvolucaoFieldValueByName.POINTS_ESTIMATE,
    donePercentage: issueEvolucaoFieldValueByName.DONE_PERCENTAGE,
  });
}
