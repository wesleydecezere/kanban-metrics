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
  handleProjectsV2ItemConvertedEvent,
  handleProjectsV2ItemRestoredEvent,
} from "../../github-webhook/service/projectsV2Item/projectsV2Item.js";
import { handleProjectsV2ItemEditedEvent } from "../../github-webhook/service/projectsV2Item/edited/handleEditedEvent.js";
import { Request, Response } from "express";

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

  if (!isProjectsV2ItemEvent(webhookEvent)) {
    console.log("Event is not a ProjectsV2ItemEvent");
    return;
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
