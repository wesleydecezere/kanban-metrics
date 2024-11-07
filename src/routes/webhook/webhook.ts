import { WebhookEvent } from "@octokit/webhooks-types";
import { Router } from "express";
import {
  isProjectsV2ItemCreatedEvent,
  isProjectsV2ItemEditedEvent,
  isProjectsV2ItemEvent,
  isProjectsV2ItemConvertedEvent,
} from "../../model/webhook/event.js";
import {
  isIssuesEditedEvent,
  isIssuesEvent,
  isIssuesLabeledEvent,
} from "../../model/webhook/issues.js";
import {
  handleIssuesEditedEvent,
  handleIssuesLabeledEvent,
} from "./service/issues.js";
import {
  handleProjectsV2ItemCreated,
  handleProjectsV2ItemEditedEvent,
  handleProjectsV2ItemConvertedEvent,
} from "./service/projectsV2Item/projectsV2Item.js";

export const webhookRoutes = Router();

webhookRoutes.get("/", (req, res) => {
  console.log("[GET] /webhook");
  res.send("Wellcome, webhook!");
});

webhookRoutes.post("/", handlePostRoot);

// @ts-expect-error - TS7006: Parameter 'req' implicitly has an 'any' type.
export function handlePostRoot(req, res) {
  console.log("[POST] /webhook");

  const webhookEvent = req.body as WebhookEvent;

  if (!isProjectsV2ItemEvent(webhookEvent) && !isIssuesEvent(webhookEvent)) {
    console.log("Event is not a ProjectsV2ItemEvent or IssuesEvent");
    res.send("Ok");
    return;
  }

  if (isIssuesEditedEvent(webhookEvent)) {
    return handleIssuesEditedEvent(webhookEvent);
  }

  // identificar blocked/standby (na real não precisa pra velocity)
  if (isIssuesLabeledEvent(webhookEvent)) {
    return handleIssuesLabeledEvent(webhookEvent);
  }

  // melhorar identificação issue
  if (
    isProjectsV2ItemCreatedEvent(webhookEvent) &&
    webhookEvent.projects_v2_item.content_type === "Issue"
  ) {
    return handleProjectsV2ItemCreated(webhookEvent);
  }

  if (
    isProjectsV2ItemEditedEvent(webhookEvent) &&
    webhookEvent.projects_v2_item.content_type === "Issue"
  ) {
    return handleProjectsV2ItemEditedEvent(webhookEvent);
  }

  if (
    isProjectsV2ItemConvertedEvent(webhookEvent) &&
    webhookEvent.projects_v2_item.content_type === "Issue"
  ) {
    return handleProjectsV2ItemConvertedEvent(webhookEvent);
  }

  // precisa restored?

  res.send("/webhook fallback");
  return;
}
