import { ProjectV2Item } from "@octokit/graphql-schema/schema.js";

export const isProjectsV2Issue = (projectsV2Item: ProjectV2Item): projectsV2Item is ProjectV2Item => 
  projectsV2Item.content?.__typename === 'Issue';