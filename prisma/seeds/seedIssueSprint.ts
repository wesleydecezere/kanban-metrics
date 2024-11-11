import { IssueOperations } from "../operations/IssueOperations.js";
import { IssueSprintOperations } from "../operations/IssueSprintOperations.js";
import { SprintOperations } from "../operations/SprintOperations.js";

// TODO log info and label it
// at this moment, all evolutions should have postition > backlog; after this it isnt true anymore
export async function seedIssueSprint() {
  const now = new Date();
  const sprint = await SprintOperations.findByDate(now);

  if (!sprint) {
    console.log("No sprint found for today");
    return;
  }

  const issuesWithEvolution = await IssueOperations.findAllWithEvolution();

  const promises = issuesWithEvolution.map((issue) =>
    IssueSprintOperations.upsert(sprint.id, issue.id)
  );

  await Promise.all(promises);
}
