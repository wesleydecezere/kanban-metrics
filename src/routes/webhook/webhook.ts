import { WebhookEvent } from "@octokit/webhooks-types";
import { Router } from "express";
import {
  isProjectsV2ItemCreatedEvent,
  isProjectsV2ItemEditedEvent,
  isProjectsV2ItemEvent,
  isProjectsV2ItemConvertedEvent,
  isProjectsV2ItemRestoredEvent,
} from "../../github-webhook/model/event/projectsV2Item.js";
import {
  handleProjectsV2ItemCreatedEvent,
  handleProjectsV2ItemEditedEvent,
  handleProjectsV2ItemConvertedEvent,
  handleProjectsV2ItemRestoredEvent,
} from "../../github-webhook/service/projectsV2Item/projectsV2Item.js";
import { Request, Response } from "express";

import {
  isIssuesEditedEvent,
  isIssuesEvent,
  isIssuesLabeledEvent,
} from "../../github-webhook/model/event/issues.js";
import {
  handleIssuesEditedEvent,
  handleIssuesLabeledEvent,
} from "../../github-webhook/service/issues.js";

export const webhookRoutes = Router();

webhookRoutes.get("/", (req, res) => {
  console.log("[GET] /webhook");
  res.send("Wellcome, webhook!");
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

  if (isIssuesEditedEvent(webhookEvent)) {
    return handleIssuesEditedEvent(webhookEvent);
  }

  // identificar blocked/standby (na real não precisa pra velocity)
  if (isIssuesLabeledEvent(webhookEvent)) {
    return handleIssuesLabeledEvent(webhookEvent);
  }

  if (isProjectsV2ItemCreatedEvent(webhookEvent))
    return handleProjectsV2ItemCreatedEvent(webhookEvent);

  if (isProjectsV2ItemConvertedEvent(webhookEvent))
    return handleProjectsV2ItemConvertedEvent(webhookEvent);

  if (isProjectsV2ItemEditedEvent(webhookEvent))
    return handleProjectsV2ItemEditedEvent(webhookEvent);

  if (isProjectsV2ItemRestoredEvent(webhookEvent))
    return handleProjectsV2ItemRestoredEvent(webhookEvent);
}
