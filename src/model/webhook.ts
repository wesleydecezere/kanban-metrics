import { ProjectsV2ItemEvent, WebhookEvent } from "@octokit/webhooks-types";

export function isProjectsV2ItemEvent(event: WebhookEvent): event is ProjectsV2ItemEvent {
  return (event as ProjectsV2ItemEvent).projects_v2_item !== undefined;
}