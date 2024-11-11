import {
  IssueEvolutionCreateProps,
  IssueEvolutionOperations,
} from "../../../prisma/operations/IssueEvolutionOperations.js";
import { IssueOperations } from "../../../prisma/operations/IssueOperations.js";
import { findIssueEvolutionInfo } from "./issueEvolution.js";

// TODO verificar se precisa ser da sprint
/**
 * disparado no início da sprint
 * precisa rodar depois do job issueSprint
 *
 */

// When it returns to the backlog, it is considered out of the sprint => issueSprint should be removed
export async function trackIssueEvolucoesBySprint(sprintId: number) {
  const issues = await IssueOperations.findBySprintId(sprintId);

  const batch: IssueEvolutionCreateProps[] = [];

  // map
  for (const issue of issues) {
    const now = new Date();

    const evolutionInfo = await findIssueEvolutionInfo(issue);

    batch.push({
      issueId: issue.id,
      date: now,
      position: evolutionInfo.POSITION,
      pointsEstimate: evolutionInfo.POINTS_ESTIMATE,
      donePercentage: evolutionInfo.DONE_PERCENTAGE,
    });
  }

  console.log(batch);

  // TODO fix testes
  await IssueEvolutionOperations.createMany(batch);

  return batch;
}

// export function calculateVelocityBySprint(sprintId: string);
