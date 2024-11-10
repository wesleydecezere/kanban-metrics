import {
  ProjectV2Field,
  ProjectV2IterationField,
  ProjectV2SingleSelectField,
} from "@octokit/graphql-schema/schema.js";
import {
  ProjectV2FieldsByOrganizationProjectPagedDocument,
  ProjectV2FieldsByOrganizationProjectPagedQuery,
  ProjectV2FieldsByOrganizationProjectPagedQueryVariables,
} from "../../generated/graphql/types.js";
import { GithubApolloClient } from "../GithubApolloClient.js";

type ProjectV2FieldResult = NonNullable<
  ReturnType<typeof handleProjectV2Field>
>;

export async function getAllProjectV2Fields(
  batch: ProjectV2FieldResult[] = [],
  lastCursor?: string | null
) {
  const fieldPage = await getProjectV2Fields(lastCursor);

  // TODO Array::isEmpty
  if (!fieldPage.fields) return batch;

  batch = batch.concat(fieldPage.fields);

  if (fieldPage.hasNextPage) {
    return getAllProjectV2Fields(batch, fieldPage.endCursor);
  }

  return batch;
}

/*
 * atualmente o sistema não suporta mais de um projeto
 * seria interessante suportar: instação centralizada + controle de acesso + padronização
 */
async function getProjectV2Fields(lastCursor?: string | null) {
  const {
    data: { organization },
  } = await GithubApolloClient.instance.query<
    ProjectV2FieldsByOrganizationProjectPagedQuery,
    ProjectV2FieldsByOrganizationProjectPagedQueryVariables
  >({
    query: ProjectV2FieldsByOrganizationProjectPagedDocument,
    variables: {
      // TODO rever uso de env + construtor de tipo
      login: String(process.env.GITHUB_ORGANIZATION),
      projectNumber: Number(process.env.GITHUB_PROJECT_NUMBER),
      paseSize: 100,
      lastCursor,
    },
  });

  if (!organization) throw new Error("Organization not found");
  if (!organization.projectV2) throw new Error("Project not found");

  const fieldNodes = organization.projectV2.fields.nodes;
  const pageInfo = organization.projectV2.fields.pageInfo;

  return {
    fields:
      fieldNodes
        ?.map(handleProjectV2Field)
        // TODO Array::filterNotNil
        .filter((field) => field !== null && field !== undefined) ?? [],
    ...pageInfo,
  };
}

const handleProjectV2Field = (
  field: Partial<
    ProjectV2Field | ProjectV2IterationField | ProjectV2SingleSelectField
  > | null
) => {
  if (!field) return undefined;

  if (
    isProjectV2Field(field) ||
    isProjectV2IterationField(field) ||
    isProjectV2SingleSelectField(field)
  ) {
    return { id: field.id, name: field.name, dataType: field.dataType };
  }

  return null;
};

const isProjectV2Field = (value: object): value is ProjectV2Field =>
  "__typename" in value && value.__typename === "ProjectV2Field";

const isProjectV2IterationField = (
  value: object
): value is ProjectV2IterationField =>
  "__typename" in value && value.__typename === "ProjectV2IterationField";

const isProjectV2SingleSelectField = (
  value: object
): value is ProjectV2SingleSelectField =>
  "__typename" in value && value.__typename === "ProjectV2SingleSelectField";
