/**
 * EVENTOS DE INTERESSE
 *
 *
 * project_v2_item
 * - [ok] criação de issue
 * - [ok] conversão para issue (se criação não for chamada por tabela)
 * - restauração de issue (se criação não for chamada no lugar)
 * - edição de qualquer campo
 *
 * - > [ok] título
 * - > campos personalizados
 *
 *
 * issue (talvez não seja interessante pra algo que roda em cima do board)
 * - criação
 * - edição de título
 *
 */

/**
 * também tem que verificar se evento é de um board específico
 */

/**
 * ETAPAS
 * 
 * [ok] 1. identificar cada tipo de evento e chamar o handler
 * [ok] 2. (condicional) para eventos de edição, identificar o que foi alterado
 * [ok] 3. chamar serviço da aplicação para atualizar o banco de dados (vai ser endpoint só depois)

*/

/**
 * principais: ProjectsV2ItemCreatedEvent, ProjectsV2ItemEditedEvent
 * outros: ProjectsV2ItemArchivedEvent, ProjectsV2ItemReorderedEvent, ProjectsV2ItemConvertedEvent, ProjectsV2ItemRestoredEvent, ProjectsV2ItemDeletedEvent
 */
/**
 
/**
 * pelo jeito precisa usar a api (
   The project item itself. To find more information about the project item, you can use `node_id` (the node ID of the project item) and `project_node_id` (the node ID of the project)
    to query information in the GraphQL API. For more information, see "[Using the API to manage projects](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/using-the-api-to-manage-projects)."
  )
* event::field_value::field_node_id
* event::item::content_node_id
*/

/**
 * mapeamento ação no board x webhook event
 *
 * draft->issue: ProjectsV2ItemConvertedEvent
 * novo card issue: ProjectsV2ItemCreatedEvent
 * card issue edited: ProjectsV2ItemEditedEvent + IssesEditedEvent
 * card issue repo->board: ProjectsV2ItemCreatedEvent
 */
