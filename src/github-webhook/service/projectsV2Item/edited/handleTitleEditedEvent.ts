import { ProjectsV2Item } from "@octokit/webhooks-types";
import { IssueOperations } from "../../../../../prisma/operations/IssueOperations.js";
import { getFieldValueByItemNodeIdAndFieldName } from "../../../../github-gql/client/projectV2Item/projectV2Item.js";

// updateIssueTitle/updateProjectsV2ItemTitle: os demais só são handle porque não fazem nada específico

/**tratar edição de issue que ainda não foi salva
 * - procurar valor do campo + tentar atualizar issue + ignorar se não existir: pega dado atualizado somente quando outro fluxo acionar este
 *
 * cria registro quando não existe mas está no board
 * - trata evento do board + procura valores atuais da issue + atualiza/cria: melhor saída, no futuro talvez faça sentido
 * - trata evento da issue: não precisaria de query adicional, mas não tem como saber se a issue pertence ao projeto
 */

export async function handleProjectsV2ItemTitleEditedEvent(
  projects_v2_item: ProjectsV2Item,
  fieldName: string
) {
  const fieldValue = await getFieldValueByItemNodeIdAndFieldName(
    projects_v2_item.node_id,
    fieldName
  );

  if (!fieldValue) {
    console.log("Field value not found");
    return;
  }

  if (
    fieldValue.__typename !== "ProjectV2ItemFieldTextValue" ||
    !fieldValue.text
  ) {
    console.log(
      `Field value is not a text, its type is ${fieldValue?.__typename}`
    );
    return;
  }

  const issue = await IssueOperations.updateTitleById(
    fieldValue.text,
    projects_v2_item.content_node_id
  );

  console.log(`Issue ${issue.id} had title updated to '${issue.title}'`);
}
