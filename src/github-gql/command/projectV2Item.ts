import { GithubApolloClient } from "../GithubApolloClient.js";
import {
  FieldValueByProjectV2ItemNodeIdAndFieldNameDocument,
  FieldValueByProjectV2ItemNodeIdAndFieldNameQuery,
  FieldValueByProjectV2ItemNodeIdAndFieldNameQueryVariables,
} from "../../generated/graphql/types.js";
import { ProjectV2ItemFieldValue } from "@octokit/graphql-schema/schema.js";

export type GetFieldValueByResult = ReturnType<
  typeof handleProjectV2ItemFieldValue
>;

export type GetFieldValueInput = Parameters<typeof getFieldValueBy>[0];

// TODO receive T to cast if handle doesnt returns nil (cast if is T, else return null)
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
    fetchPolicy: "no-cache",
  });

  console.log(data);

  if (!data?.node || data.node.__typename !== "ProjectV2Item") return null;

  return handleProjectV2ItemFieldValue(data.node.fieldValueByName);
}

// TODO type guard que verifique __typename
/**
 * se retornar null, campo pode
 * - não existir
 * - ter valor null (acontece na prática? sim!)
 * - ser de um tipo inesperado
 * se retornar undefined
 * - tipo de campo não acessado na query (tipo inesperado)
 */
function handleProjectV2ItemFieldValue(
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
