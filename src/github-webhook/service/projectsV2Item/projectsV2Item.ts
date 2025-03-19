import {
  ProjectsV2Item,
  ProjectsV2ItemConvertedEvent,
  ProjectsV2ItemCreatedEvent,
  ProjectsV2ItemEditedEvent,
  ProjectsV2ItemRestoredEvent,
} from "@octokit/webhooks-types";
import { isProjectsV2Issue } from "../../model/projectsV2Item.js";
import { getIssueByNodeId } from "../../../github-gql/client/issue/issue.js";
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js";
import { getFieldValueByItemNodeIdAndFieldName } from "../../../github-gql/client/projectV2Item/projectV2Item.js";

export async function handleProjectsV2ItemCreatedEvent({
  projects_v2_item,
}: ProjectsV2ItemCreatedEvent) {
  return handleProjectsV2IssueEvent(projects_v2_item);
}

export async function handleProjectsV2ItemRestoredEvent({
  projects_v2_item,
}: ProjectsV2ItemRestoredEvent) {
  return handleProjectsV2IssueEvent(projects_v2_item);
}

export async function handleProjectsV2ItemConvertedEvent({
  projects_v2_item,
  changes,
}: ProjectsV2ItemConvertedEvent) {
  if (changes.content_type.from === null) {
    console.log("Projects V2 item converted has already been created before");
    return;
  }
  await findIssueAndCreateRecord(projects_v2_item.content_node_id);
}

async function handleProjectsV2IssueEvent(projects_v2_item: ProjectsV2Item) {
  if (!isProjectsV2Issue(projects_v2_item)) {
    console.log("Projects V2 item created is not an issue");
    return;
  }
  await findIssueAndCreateRecord(projects_v2_item.content_node_id);
}

async function findIssueAndCreateRecord(nodeId: string) {
  const issue = await getIssueByNodeId(nodeId);

  if (!issue) {
    console.log("Issue not found on GitHub");
    return;
  }

  const { id } = await IssueOperations.createIfAbsent({ id: nodeId, ...issue });

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
  // TODO criar tipo adaptado de graphql-schema::ProjectV2FieldType
  const fieldType: string = event.changes.field_value.field_type;

  if (fieldType !== "title") {
    console.log(
      `The updated field is not an issue title, its type is ${fieldType}`
    );
    return;
  }

  const fieldValue = await getFieldValueByItemNodeIdAndFieldName(
    event.projects_v2_item.node_id,
    fieldType
  );

  if (!fieldValue) {
    console.log("Field value not found");
    return;
  }

  if (
    fieldValue.__typename !== "ProjectV2ItemFieldTextValue" ||
    !fieldValue.text
  ) {
    console.log(
      `Field value is not a text, its type is ${fieldValue?.__typename}`
    );
    return;
  }

  const issue = await IssueOperations.updateTitleById(
    fieldValue.text,
    event.projects_v2_item.content_node_id
  );

  console.log(`Issue ${issue.id} had title updated to '${issue.title}'`);
}
