import { Label, ProjectsV2Item, ProjectsV2ItemEditedEvent } from "@octokit/webhooks-types";

type ProjectsV2ItemFieldValueChanges = ProjectsV2ItemEditedEvent['changes']['field_value']
type ProjectsV2ItemCustomFieldValueChanges = ProjectsV2ItemFieldValueChanges & {
  field_name: string
  from: ProjectsV2ItemFieldValue | null
  to: ProjectsV2ItemFieldValue | null
}
type ProjectsV2ItemFieldValue = string | ProjectsV2ItemLabelField | ProjectsV2ItemIterationField 
type ProjectsV2ItemLabelField = Pick<Label, "id" | "name" | 'description' | 'color'>
type ProjectsV2ItemIterationField = {
  id: string
  title: string
  duration: number
  start_date: string
}

// repensar se preicsa ficar aqui
export const isProjectsV2ItemCustomFieldValueChanges = (changes: ProjectsV2ItemFieldValueChanges): changes is ProjectsV2ItemCustomFieldValueChanges => 
    (changes as ProjectsV2ItemCustomFieldValueChanges).to !== undefined;

// não precisa seguir mesma lógica dos eventos porque não define campo do evento 
export const isProjectsV2Issue = (projects_v2_item: ProjectsV2Item): boolean => 
    projects_v2_item.content_type === 'Issue';