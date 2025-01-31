import {
  ProjectsV2ItemConvertedEvent,
  ProjectsV2ItemCreatedEvent,
  ProjectsV2ItemEditedEvent,
} from "@octokit/webhooks-types";
import { isProjectsV2Issue } from "../../../../model/webhook/projectsV2Item.js";
import { getFieldValueBy } from "../../../../github-gql/command/projectV2Item.js";
import { getIssueByNodeId } from "../../../../github-gql/command/issue/getIssueByNodeId.js";
import { IssueOperations } from "../../../../../prisma/operations/IssueOperations.js";
import { ProjectV2FieldType } from "@octokit/graphql-schema";
import { SystemFieldOperations } from "../../../../../prisma/operations/SystemFieldOperations.js";
import { TSystemFieldName } from "../../../../../prisma/client/types.js";
import { SprintOperations } from "../../../../../prisma/operations/SprintOperations.js";
import { IssueSprintOperations } from "../../../../../prisma/operations/IssueSprintOperations.js";
import { SPRINT_POSITIONS } from "../../../../../prisma/seeds/seedIssueSprint.js";

export async function handleProjectsV2ItemCreated({
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

type RealProjectV2FieldType = Lowercase<ProjectV2FieldType>;

export async function handleProjectsV2ItemEditedEvent(
  event: ProjectsV2ItemEditedEvent
) {
  // TODO criar tipo adaptado de graphql-schema::ProjectV2FieldType
  const fieldType = event.changes.field_value
    .field_type as RealProjectV2FieldType;

  if (fieldType !== "title" && fieldType !== "single_select") {
    console.log(
      `The updated field is not an issue title or a single select field, its type is ${fieldType}`
    );
    return;
  }

  const projectV2ItemId = event.projects_v2_item.node_id;
  const issueId = event.projects_v2_item.content_node_id;
  const fieldName = event.changes.field_value.;


  const fieldValue = await getFieldValueBy({
    itemNodeId: projectV2ItemId,
    fieldName: fieldType, // TÁ ERRADO AQUI, DEVE TER MAIS COSA ERRADA DEPOIS
  });

  if (!fieldValue) {
    console.log("Field value not found");
    return;
  }

  // dúvida: não deveria ser o changes.field_values.field_node_id?
  const fieldId = event.projects_v2_item.content_node_id;

  // como identificar que o single_select é o status?

  // poderia ser extensível para qualquer campo da issue
  // esses campos tem node_id fora da issue?
  if (fieldType === "title") {
    const issue = await IssueOperations.updateTitleById(
      fieldValue.text,
      fieldId
    );

    console.log(`Issue ${issue.id} had title updated to '${issue.title}'`);

    return;
  }

  // ou qualquer outro do board
  if (fieldType === "single_select") {
    // pega system_field by board_field_id
    const systemFieldName = await SystemFieldOperations.findByBoardFieldId(
      fieldId
    );

    // chama handle de acordo com system_field
    if (systemFieldName?.name === TSystemFieldName.POSITION) {
      await handleIssueStatusEdited(fieldValue, issueId);
    }

    return;
  }
}

async function handleIssueStatusEdited(fieldValue: string, issueId: string) {
  const currentSprint = await SprintOperations.findCurrent();

  if (currentSprint === null) {
    throw new Error("No current sprint found");
  }

  if (SPRINT_POSITIONS.includes(fieldValue)) {
    await IssueSprintOperations.upsert({
      issueId,
      sprintId: currentSprint.id,
    });

    return;
  }

  await IssueSprintOperations.delete({
    issueId,
    sprintId: currentSprint.id,
  });
}
