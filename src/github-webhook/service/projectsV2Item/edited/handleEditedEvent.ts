import { ProjectsV2ItemEditedEvent } from "@octokit/webhooks-types";
import { handleProjectsV2ItemTitleEditedEvent } from "./handleTitleEditedEvent.js";
import { IProjectsV2ItemEditedField } from "../../../model/projectsV2Item.js";

export async function handleProjectsV2ItemEditedEvent(
  event: ProjectsV2ItemEditedEvent
) {
  // TODO criar tipo adaptado de graphql-schema::ProjectV2FieldType
  const fieldValue = event.changes.field_value as IProjectsV2ItemEditedField;

  if (fieldValue.field_type !== "title" || !fieldValue.field_name) {
    console.log(
      `The updated field is not an issue title, its type is ${fieldValue.field_type}`
    );
    return;
  }

  await handleProjectsV2ItemTitleEditedEvent(
    event.projects_v2_item,
    fieldValue.field_name
  );
}
