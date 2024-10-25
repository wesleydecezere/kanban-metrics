import { GithubApolloClient } from "../GithubApolloClient.js";
import { FieldValueByProjectV2ItemNodeIdAndFieldNameDocument, FieldValueByProjectV2ItemNodeIdAndFieldNameQuery, FieldValueByProjectV2ItemNodeIdAndFieldNameQueryVariables, IssueByNodeIdQueryVariables, IssueByNodeIdDocument, IssueByNodeIdQuery } from "../../graphql/generated/types.js";

export async function getIssueByNodeId(id: string) {
    const { data: { node } } = await GithubApolloClient.instance.query<
        IssueByNodeIdQuery, 
        IssueByNodeIdQueryVariables
    >({
        query: IssueByNodeIdDocument,
        variables: {
            id
        }
    })

    if (node?.__typename !== 'Issue') return

    return { number: node.number, title: node.title }
}

// TODO type guard que verifique __typename
export async function getFieldValueByItemNodeIdAndFieldName(itemNodeId: string, fieldName: string) {
    const { data } = await GithubApolloClient.instance.query<
        FieldValueByProjectV2ItemNodeIdAndFieldNameQuery,
        FieldValueByProjectV2ItemNodeIdAndFieldNameQueryVariables
    >({
        query: FieldValueByProjectV2ItemNodeIdAndFieldNameDocument,
        variables: {
            id: itemNodeId,
            name: fieldName
        }
    })

    if (!data?.node || data.node.__typename !== 'ProjectV2Item') return null

    return data.node.fieldValueByName
}