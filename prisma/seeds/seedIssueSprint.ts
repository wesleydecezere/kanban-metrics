import { IssueOperations } from "../operations/IssueOperations.js";
import { IssueSprintOperations } from "../operations/IssueSprintOperations.js";
import { SprintOperations } from "../operations/SprintOperations.js";

// TODO impl tables for this
export const SPRINT_POSITIONS = ["Ready", "In progress", "In review", "Done"];

// TODO log info and label it
// at this moment, all evolutions should have postition > backlog; after this it isnt true anymore
export async function seedIssueSprint() {
  const now = new Date();
  const sprint = await SprintOperations.findByDate(now);

  if (!sprint) {
    console.log("No sprint found for today");
    return;
  }

  const issuesWithEvolution = await IssueOperations.findByPosition(
    ...SPRINT_POSITIONS
  );

  const promises = issuesWithEvolution.map((issue) =>
    IssueSprintOperations.upsert({ sprintId: sprint.id, issueId: issue.id })
  );

  await Promise.all(promises);
}
