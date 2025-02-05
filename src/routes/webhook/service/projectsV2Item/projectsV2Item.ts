import {
  ProjectsV2ItemConvertedEvent,
  ProjectsV2ItemCreatedEvent,
  ProjectsV2ItemEditedEvent,
} from "@octokit/webhooks-types";
import { isProjectsV2Issue } from "../../../../model/webhook/projectsV2Item.js";
import { getIssueByNodeId } from "../../../../github-gql/command/projectsV2Item.js";
import { IssueOperations } from "../../../../../prisma/operations/IssueOperations.js";

export async function handleProjectsV2ItemCreatedEvent({
  projects_v2_item,
}: ProjectsV2ItemCreatedEvent) {
  if (!isProjectsV2Issue(projects_v2_item)) {
    console.log("Projects V2 item created is not an issue");
    return;
  }
  await findIssueAndCreateRecord(projects_v2_item.content_node_id);
}

export async function handleProjectsV2ItemConvertedEvent({
  projects_v2_item,
  changes,
}: ProjectsV2ItemConvertedEvent) {
  if (changes.content_type.from === null) {
    console.log("Projects V2 item converted is has been created before");
    return;
  }

  await findIssueAndCreateRecord(projects_v2_item.content_node_id);
}

async function findIssueAndCreateRecord(nodeId: string) {
  const issue = await getIssueByNodeId(nodeId);

  if (!issue) {
    console.log("Issue not found on Github");
    return;
  }

  const { id } = await IssueOperations.create({ id: nodeId, ...issue });

  console.log(`Created issue db record with id ${id}`);
}

// -----------------------------------------------------

/**
 * escolher gh query + result type + prisma operation por
 * a. tipo do field
 *    - webhookEvent.changes.field_value.field_type
 *    - pode assumir todos os valores de graphql-schema::ProjectV2FieldType em lowercase)
 * b. nome do field (webhookEvent.changes.field_value.field_name)
 * c. id do field (webhookEvent.changes.field_value.field_node_id) ~ nunca muda!
 */

/**
 * OPÇÕES PARA PEGAR FIELD VALUE
 * se changes tiver { from, to }, usar
 * se não, fazer buscar fieldValue pelo nodeId
 */

// posso criar os campos buscando por todos ProjectV2[]Field no ProjectV2

export async function handleProjectsV2ItemEditedEvent(
  event: ProjectsV2ItemEditedEvent
) {
  // TODO
}
