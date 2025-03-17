import {
  ProjectsV2Item,
  ProjectsV2ItemConvertedEvent,
  ProjectsV2ItemCreatedEvent,
  ProjectsV2ItemEditedEvent,
  ProjectsV2ItemRestoredEvent,
} from "@octokit/webhooks-types";
import { isProjectsV2Issue } from "../../model/projectsV2Item.js";
import { getIssueByNodeId } from "../../../github-gql/issue.js";
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js";

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

export async function handleProjectsV2ItemEditedEvent(
  event: ProjectsV2ItemEditedEvent
) {
  // TODO needs to verify if the content_type is issue
  console.log(event);
}
