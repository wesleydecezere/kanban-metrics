import {
  ProjectsV2Item,
  ProjectsV2ItemConvertedEvent,
  ProjectsV2ItemCreatedEvent,
  ProjectsV2ItemRestoredEvent,
} from "@octokit/webhooks-types";
import { isProjectsV2Issue } from "../../model/projectsV2Item.js";
import { getIssueByNodeId } from "../../../github-gql/client/issue/issue.js";
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js";

/** TODO melhorar organização
 * mudar nomes: handleIssueCreationEvents / handleFieldEditionEvents ou algo assim
 * uma função em cada aquivo + common (arquivos pequenos)
 * repensar testes: testar só uma vez cada funcionalidade
 */

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
