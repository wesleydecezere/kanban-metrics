import { ProjectsV2Item } from "@octokit/webhooks-types";

export const isProjectsV2Issue = (projects_v2_item: ProjectsV2Item): boolean =>
  projects_v2_item.content_type === "Issue";
