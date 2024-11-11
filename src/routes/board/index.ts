import { Router } from "express";
import { trackIssueEvolucoesBySprint } from "../../scheduler/jobs/jobs.js";
import { SprintOperations } from "../../../prisma/operations/SprintOperations.js";

export const boardRoutes = Router();

boardRoutes.get("/trackIssueEvolution", async (req, res) => {
  const sprint = await SprintOperations.findByDate(new Date());

  if (!sprint) {
    res.status(404).send("No sprint found for today");
    return;
  }

  const issueEvolutions = await trackIssueEvolucoesBySprint(sprint.id);

  res.send(issueEvolutions);
});
