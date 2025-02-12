import { ProjectsV2Item } from "@octokit/webhooks-types";

// não precisa seguir mesma lógica dos eventos porque não define campo do evento
export const isProjectsV2Issue = (projects_v2_item: ProjectsV2Item): boolean =>
  projects_v2_item.content_type === "Issue";
