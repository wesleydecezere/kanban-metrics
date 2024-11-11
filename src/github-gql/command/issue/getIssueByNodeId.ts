import {
  IssueByNodeIdQuery,
  IssueByNodeIdQueryVariables,
  IssueByNodeIdDocument,
} from "../../../generated/graphql/types.js";
import { GithubApolloClient } from "../../GithubApolloClient.js";

export async function getIssueByNodeId(id: string) {
  const {
    data: { node },
  } = await GithubApolloClient.instance.query<
    IssueByNodeIdQuery,
    IssueByNodeIdQueryVariables
  >({
    query: IssueByNodeIdDocument,
    variables: {
      id,
    },
  });

  if (node?.__typename !== "Issue") return;

  return { number: node.number, title: node.title };
}
