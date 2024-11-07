import {
  IssuesEditedEvent,
  IssuesEvent,
  IssuesLabeledEvent,
  WebhookEvent,
} from "@octokit/webhooks-types";

export function isIssuesEvent(event: WebhookEvent): event is IssuesEvent {
  return (event as IssuesEvent).issue !== undefined;
}

export function isIssuesEditedEvent(
  event: WebhookEvent
): event is IssuesEditedEvent {
  return (
    isIssuesEvent(event) && (event as IssuesEditedEvent).action === "edited"
  );
}

export function isIssuesLabeledEvent(
  event: WebhookEvent
): event is IssuesLabeledEvent {
  return (
    isIssuesEvent(event) && (event as IssuesLabeledEvent).action === "labeled"
  );
}
