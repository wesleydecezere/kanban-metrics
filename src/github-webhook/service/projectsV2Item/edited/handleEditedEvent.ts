import { ProjectsV2ItemEditedEvent } from "@octokit/webhooks-types";
import { handleProjectsV2ItemTitleEditedEvent } from "./handleTitleEditedEvent.js";

// -----------------------------------------------------
/**
 * escolher gh query + result type + prisma operation por
 * a. tipo do field
 *    - webhookEvent.changes.field_value.field_type
 *    - pode assumir todos os valores de graphql-schema::ProjectV2FieldType em lowercase)
 * b. nome do field (webhookEvent.changes.field_value.field_name)
 * c. id do field (webhookEvent.changes.field_value.field_node_id) ~ nunca muda!
 */

// posso criar os campos buscando por todos ProjectV2[]Field no ProjectV2

export async function handleProjectsV2ItemEditedEvent(
  event: ProjectsV2ItemEditedEvent
) {
  // TODO criar tipo adaptado de graphql-schema::ProjectV2FieldType
  const fieldType: string = event.changes.field_value.field_type;

  if (fieldType !== "title") {
    console.log(
      `The updated field is not an issue title, its type is ${fieldType}`
    );
    return;
  }

  await handleProjectsV2ItemTitleEditedEvent(event.projects_v2_item, fieldType);
}
