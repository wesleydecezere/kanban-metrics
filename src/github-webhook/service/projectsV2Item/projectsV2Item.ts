import {
  ProjectsV2ItemConvertedEvent,
  ProjectsV2ItemCreatedEvent,
  ProjectsV2ItemEditedEvent,
} from "@octokit/webhooks-types";
import { isProjectsV2Issue } from "../../model/projectsV2Item.js";
import { getIssueByNodeId } from "../../../github-gql/issue.js";
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js";

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
    console.log("Projects V2 item converted already has been created before");
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

export async function handleProjectsV2ItemEditedEvent(
  event: ProjectsV2ItemEditedEvent
) {
  // TODO
  console.log(event);
}
