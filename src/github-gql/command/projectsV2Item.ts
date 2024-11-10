import { GithubApolloClient } from "../GithubApolloClient.js";
import {
  FieldValueByProjectV2ItemNodeIdAndFieldNameDocument,
  FieldValueByProjectV2ItemNodeIdAndFieldNameQuery,
  FieldValueByProjectV2ItemNodeIdAndFieldNameQueryVariables,
  IssueByNodeIdQueryVariables,
  IssueByNodeIdDocument,
  IssueByNodeIdQuery,
} from "../../generated/graphql/types.js";
import { ProjectV2ItemFieldValue } from "@octokit/graphql-schema/schema.js";

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

export type GetFieldValueByResult = ReturnType<
  typeof getProjectV2ItemFieldValue
>;

export async function getFieldValueBy(args: {
  itemNodeId: string;
  fieldName: string;
}) {
  const { data } = await GithubApolloClient.instance.query<
    FieldValueByProjectV2ItemNodeIdAndFieldNameQuery,
    FieldValueByProjectV2ItemNodeIdAndFieldNameQueryVariables
  >({
    query: FieldValueByProjectV2ItemNodeIdAndFieldNameDocument,
    variables: {
      id: args.itemNodeId,
      name: args.fieldName,
    },
  });

  if (!data?.node || data.node.__typename !== "ProjectV2Item") return null;

  return getProjectV2ItemFieldValue(data.node.fieldValueByName);
}

// TODO type guard que verifique __typename
/**
 * se retornar null, campo pode
 * - não existir
 * - não ter atributo utilizado
 * - ter valor null
 * - ser de um tipo inesperado
 */
function getProjectV2ItemFieldValue(
  fieldValue: Partial<ProjectV2ItemFieldValue> | null | undefined
) {
  if (!fieldValue) return null;

  if (fieldValue?.__typename === "ProjectV2ItemFieldTextValue")
    return fieldValue.text;

  if (fieldValue?.__typename === "ProjectV2ItemFieldSingleSelectValue")
    return fieldValue.name;

  if (fieldValue?.__typename === "ProjectV2ItemFieldNumberValue")
    return fieldValue.number;

  if (fieldValue?.__typename === "ProjectV2ItemFieldIterationValue")
    return fieldValue.title;

  if (fieldValue?.__typename === "ProjectV2ItemFieldDateValue")
    return fieldValue.date;

  return null;
}
