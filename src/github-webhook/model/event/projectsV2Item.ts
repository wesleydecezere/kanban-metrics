import {
  ProjectsV2ItemConvertedEvent,
  ProjectsV2ItemCreatedEvent,
  ProjectsV2ItemEditedEvent,
  ProjectsV2ItemEvent,
  WebhookEvent,
} from "@octokit/webhooks-types";

export const isProjectsV2ItemEvent = (
  event: WebhookEvent
): event is ProjectsV2ItemEvent =>
  (event as ProjectsV2ItemEvent).projects_v2_item !== undefined;

export const isProjectsV2ItemCreatedEvent = (
  event: WebhookEvent
): event is ProjectsV2ItemCreatedEvent =>
  isProjectsV2ItemEvent(event) &&
  (event as ProjectsV2ItemCreatedEvent).action === "created";

export const isProjectsV2ItemEditedEvent = (
  event: WebhookEvent
): event is ProjectsV2ItemEditedEvent =>
  isProjectsV2ItemEvent(event) &&
  (event as ProjectsV2ItemEditedEvent).action === "edited";

export const isProjectsV2ItemConvertedEvent = (
  event: WebhookEvent
): event is ProjectsV2ItemConvertedEvent =>
  isProjectsV2ItemEvent(event) &&
  (event as ProjectsV2ItemConvertedEvent).action === "converted";
