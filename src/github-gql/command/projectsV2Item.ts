import { GithubApolloClient } from "../GithubApolloClient.js";
import { IssueByProjectV2ItemNodeIdDocument, IssueByProjectV2ItemNodeIdQuery, IssueByProjectV2ItemNodeIdQueryVariables } from "../../graphql/generated/types.js";

export async function getIssueByProjectV2ItemNodeId(id: string) {
    const { data: { node } } = await GithubApolloClient.instance.query<
        IssueByProjectV2ItemNodeIdQuery, 
        IssueByProjectV2ItemNodeIdQueryVariables
    >({
        query: IssueByProjectV2ItemNodeIdDocument,
        variables: {
            id
        }
    })

    if (node?.__typename === 'ProjectV2Item' && node?.content?.__typename === 'Issue') {
        return { number: node.content.number, title: node.content.title }
    }

    return null
}