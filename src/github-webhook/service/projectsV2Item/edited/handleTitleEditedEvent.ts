import { ProjectsV2Item } from "@octokit/webhooks-types";
import { IssueOperations } from "../../../../../prisma/operations/IssueOperations.js";
import { getFieldValueByItemNodeIdAndFieldName } from "../../../../github-gql/client/projectV2Item/projectV2Item.js";

// updateIssueTitle/updateProjectsV2ItemTitle: os demais só são handle porque não fazem nada específico
export async function handleProjectsV2ItemTitleEditedEvent(
  projects_v2_item: ProjectsV2Item,
  fieldType: string
) {
  const fieldValue = await getFieldValueByItemNodeIdAndFieldName(
    projects_v2_item.node_id,
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
    projects_v2_item.content_node_id
  );

  console.log(`Issue ${issue.id} had title updated to '${issue.title}'`);
}
