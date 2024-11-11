import {
  ProjectV2Field,
  ProjectV2IterationField,
  ProjectV2SingleSelectField,
} from "@octokit/graphql-schema/schema.js";
import {
  ProjectV2FieldsByOrganizationProjectV2PagedDocument,
  ProjectV2FieldsByOrganizationProjectV2PagedQuery,
  ProjectV2FieldsByOrganizationProjectV2PagedQueryVariables,
} from "../../generated/graphql/types.js";
import { GithubApolloClient } from "../GithubApolloClient.js";
import { PAGE_SIZE_DEFAULT } from "./util.js";

type ProjectV2FieldResult = NonNullable<
  ReturnType<typeof handleProjectV2Field>
>;

export async function getAllProjectV2Fields(
  lastCursor?: string | null
): Promise<ProjectV2FieldResult[]> {
  const { fields, hasNextPage, endCursor } = await getProjectV2FieldsPaged(
    lastCursor
  );

  if (hasNextPage) {
    const nextFields = await getAllProjectV2Fields(endCursor);
    return [...fields, ...nextFields];
  }

  return fields;
}

/*
 * atualmente o sistema não suporta mais de um projeto
 * seria interessante suportar: instação centralizada + controle de acesso + padronização
 */
async function getProjectV2FieldsPaged(lastCursor?: string | null) {
  const {
    data: { organization },
  } = await GithubApolloClient.instance.query<
    ProjectV2FieldsByOrganizationProjectV2PagedQuery,
    ProjectV2FieldsByOrganizationProjectV2PagedQueryVariables
  >({
    query: ProjectV2FieldsByOrganizationProjectV2PagedDocument,
    variables: {
      // TODO rever uso de env + construtor de tipo
      login: String(process.env.GITHUB_ORGANIZATION),
      projectNumber: Number(process.env.GITHUB_PROJECT_NUMBER),
      paseSize: PAGE_SIZE_DEFAULT,
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
