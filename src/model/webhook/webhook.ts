import { Label, ProjectsV2ItemCreatedEvent, ProjectsV2ItemEditedEvent, ProjectsV2ItemEvent, WebhookEvent } from "@octokit/webhooks-types";

type ProjectsV2ItemFieldValueChanges = ProjectsV2ItemEditedEvent['changes']['field_value']
type ProjectsV2ItemCustomFieldValueChanges = ProjectsV2ItemFieldValueChanges & {
  field_name: string
  from: ProjectsV2ItemFieldValue | null
  to: ProjectsV2ItemFieldValue | null
}
type ProjectsV2ItemFieldValue = string | ProjectsV2ItemLabelField | ProjectsV2ItemIterationField 
type ProjectsV2ItemLabelField = Pick<Label, "id" | "name" | 'description' | 'color'>
type ProjectsV2ItemIterationField = {
  id: string
  title: string
  duration: number
  start_date: string
}

export function isProjectsV2ItemEvent(event: WebhookEvent): event is ProjectsV2ItemEvent {
  return (event as ProjectsV2ItemEvent).projects_v2_item !== undefined;
}

export function isProjectsV2ItemCreatedEvent(event: WebhookEvent): event is ProjectsV2ItemCreatedEvent {
  return isProjectsV2ItemEvent(event) && (event as ProjectsV2ItemCreatedEvent).action === "created";
}

export function isProjectsV2ItemEditedEvent(event: WebhookEvent): event is ProjectsV2ItemEditedEvent {
  return isProjectsV2ItemEvent(event) && (event as ProjectsV2ItemEditedEvent).action === "edited";
}

export function isProjectsV2ItemCustomFieldValueChanges(changes: ProjectsV2ItemFieldValueChanges): changes is ProjectsV2ItemCustomFieldValueChanges {
  return (changes as ProjectsV2ItemCustomFieldValueChanges).to !== undefined;
}
