import { WebhookEvent } from "@octokit/webhooks-types";
import { Router } from "express";
import {
  isProjectsV2ItemCreatedEvent,
  isProjectsV2ItemEditedEvent,
  isProjectsV2ItemEvent,
  isProjectsV2ItemConvertedEvent,
} from "../../github-webhook/model/event/projectsV2Item.js";
import { isIssuesEvent } from "../../github-webhook/model/event/issues.js";
import {
  handleProjectsV2ItemCreatedEvent,
  handleProjectsV2ItemEditedEvent,
  handleProjectsV2ItemConvertedEvent,
} from "../../github-webhook/service/projectsV2Item/projectsV2Item.js";
import { Request, Response } from "express";

export const webhookRoutes = Router();

webhookRoutes.get("/", (_, res) => {
  console.log("[GET] /webhook");
  res.send("Ok");
});

webhookRoutes.post("/", handlePostRoot);

export function handlePostRoot(req: Request, res: Response) {
  console.log("[POST] /webhook");
  res.send("Ok");

  const webhookEvent = req.body as WebhookEvent;

  if (!isProjectsV2ItemEvent(webhookEvent) && !isIssuesEvent(webhookEvent)) {
    console.log("Event is not a ProjectsV2ItemEvent or IssuesEvent");
    return;
  }

  if (isProjectsV2ItemCreatedEvent(webhookEvent))
    return handleProjectsV2ItemCreatedEvent(webhookEvent);

  if (isProjectsV2ItemConvertedEvent(webhookEvent))
    return handleProjectsV2ItemConvertedEvent(webhookEvent);

  if (isProjectsV2ItemEditedEvent(webhookEvent))
    return handleProjectsV2ItemEditedEvent(webhookEvent);

  // TODO handle ItemRestoredEvent
  return;
}
