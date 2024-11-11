import {
  IssuesByOrganizationProjectV2PagedDocument,
  IssuesByOrganizationProjectV2PagedQuery,
  IssuesByOrganizationProjectV2PagedQueryVariables,
  ProjectV2ItemContent,
  ProjectV2ItemFieldTextValue,
} from "../../../generated/graphql/types.js";
import { Issue, ProjectV2ItemFieldValue } from "@octokit/graphql-schema";
import { GithubApolloClient } from "../../GithubApolloClient.js";
import { PAGE_SIZE_DEFAULT } from "../util.js";
import { TIssue } from "../../../../prisma/client/types.js";

// TODO generic getAll<T>(lastCursor?: string | null, getT: (lastCursor?: string | null) => Promise<T[]>)
export async function getAllIssues(
  lastCursor?: string | null
): Promise<TIssue[]> {
  const { issues, hasNextPage, endCursor } = await getIssuePaged(lastCursor);

  if (hasNextPage) {
    const nextIssues = await getAllIssues(endCursor);
    return [...issues, ...nextIssues];
  }

  return issues;
}

async function getIssuePaged(lastCursor?: string | null) {
  const {
    data: { organization },
  } = await GithubApolloClient.instance.query<
    IssuesByOrganizationProjectV2PagedQuery,
    IssuesByOrganizationProjectV2PagedQueryVariables
  >({
    query: IssuesByOrganizationProjectV2PagedDocument,
    variables: {
      login: String(process.env.GITHUB_ORGANIZATION),
      projectNumber: Number(process.env.GITHUB_PROJECT_NUMBER),
      paseSize: PAGE_SIZE_DEFAULT,
      lastCursor,
    },
  });

  if (!organization) throw new Error("Organization not found");
  if (!organization.projectV2) throw new Error("Project not found");

  const itemNodes = organization.projectV2.items.nodes;
  const pageInfo = organization.projectV2.items.pageInfo;

  if (!itemNodes)
    return {
      issues: [],
      ...pageInfo,
    };

  return {
    issues: itemNodes
      .filter((item) => item?.type === "ISSUE")
      .map((item) => {
        const id = item?.id;
        const title = handleProjectV2ItemFieldValue(item?.title);
        const number = handleProjectV2ItemContent(item?.content);

        if (!id || !title || !number) return null;

        return {
          id,
          title,
          number,
        };
      })
      .filter((item) => item !== null && item !== undefined),
    ...pageInfo,
  };
}

// TODO generic handle<T>(typeChecker, mapFn: (T) => U)
function handleProjectV2ItemContent(
  content: Partial<ProjectV2ItemContent> | null | undefined
) {
  if (!content) return undefined;
  if (isIssue(content)) return content.number;
  return null;
}

function handleProjectV2ItemFieldValue(
  value: Partial<ProjectV2ItemFieldValue> | null | undefined
) {
  if (!value) return undefined;
  if (isProjectV2ItemFieldTextValue(value)) return value.text;
  return null;
}

const isIssue = (value: object): value is Issue =>
  "__typename" in value && value.__typename === "Issue";

const isProjectV2ItemFieldTextValue = (
  value: object
): value is ProjectV2ItemFieldTextValue =>
  "__typename" in value && value.__typename === "ProjectV2ItemFieldTextValue";
