import { IssueOperations } from "../../../prisma/operations/IssueOperations.js";
import {
  findIssueEvolutionInfo,
  saveIssueEvolution,
} from "./issueEvolution.js";

export async function trackIssueEvolucoesBySprint(sprintId: number) {
  // busca no db id issues da sprint
  const issues = await IssueOperations.findBySprintId(sprintId);

  // para cada issue
  for (const issue of issues) {
    const evolutionInfo = await findIssueEvolutionInfo(issue);
    // TODO tratar erro
    // TODO mudar pra batch
    await saveIssueEvolution(issue, evolutionInfo);
  }
}

// export function calculateVelocityBySprint(sprintId: string);
