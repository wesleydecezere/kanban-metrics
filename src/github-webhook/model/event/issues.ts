import { IssuesEvent, WebhookEvent } from "@octokit/webhooks-types";

export function isIssuesEvent(event: WebhookEvent): event is IssuesEvent {
  return (event as IssuesEvent).issue !== undefined;
}
