import { GithubApolloClient } from "../GithubApolloClient.js";
import {
  FieldValueByProjectV2ItemNodeIdAndFieldNameDocument,
  FieldValueByProjectV2ItemNodeIdAndFieldNameQuery,
  FieldValueByProjectV2ItemNodeIdAndFieldNameQueryVariables,
} from "../../../generated/graphql/types.js";

// TODO type guard que verifique __typename
export async function getFieldValueByItemNodeIdAndFieldName(
  itemNodeId: string,
  fieldName: string
) {
  const { data } = await GithubApolloClient.instance.query<
    FieldValueByProjectV2ItemNodeIdAndFieldNameQuery,
    FieldValueByProjectV2ItemNodeIdAndFieldNameQueryVariables
  >({
    query: FieldValueByProjectV2ItemNodeIdAndFieldNameDocument,
    variables: {
      id: itemNodeId,
      name: fieldName,
    },
  });

  if (!data?.node || data.node.__typename !== "ProjectV2Item") return null;

  return data.node.fieldValueByName;
}
