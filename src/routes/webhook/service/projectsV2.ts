import { ProjectsV2ItemConvertedEvent, ProjectsV2ItemCreatedEvent, ProjectsV2ItemEditedEvent } from "@octokit/webhooks-types"
import { GithubApolloClient } from "../../../github-gql/GithubApolloClient.js"
import { FieldValueByFieldNodeIdQuery, FieldValueByFieldNodeIdQueryVariables, FieldValueByFieldNodeIdDocument } from "../../../graphql/generated/types.js"
import { isProjectsV2Issue, isProjectsV2ItemCustomFieldValueChanges } from "../../../model/webhook/projectsV2Item.js"
import { getIssueByProjectV2ItemNodeId } from "../../../github-gql/command/projectsV2Item.js"
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js"

export async function handleProjectsV2ItemCreated({ projects_v2_item }: ProjectsV2ItemCreatedEvent) {
    if (!isProjectsV2Issue(projects_v2_item)) {
        console.log('Projects V2 item created is not an issue')
        return
    }

    // não poderia ser getIssueByNodeId? aí passaria o projects_v2_item.content_node_id
    const issue = await getIssueByProjectV2ItemNodeId(projects_v2_item.node_id)

    if (!issue) {
        console.log('Issue not found')
        return
    }

    const { id } = await IssueOperations.create({ ...issue})

    console.log(`Created issue db record with id ${id}`)
}


export function handleProjectsV2ItemConvertedEvent(event: ProjectsV2ItemConvertedEvent) {
    // TODO talvez seja só chamar a handleProjectsV2ItemCreated
}

export async function handleProjectsV2ItemEditedEvent(event: ProjectsV2ItemEditedEvent) {
    const fieldValueChanges = event.changes.field_value

    // não precisa 
    if (isProjectsV2ItemCustomFieldValueChanges(fieldValueChanges)) {
        const { field_name, from, to } = fieldValueChanges
        console.log(`Edited field ${field_name} from ${from} to ${to}`)

        // verificar tipo fieldValueChanges.to + valor fieldValueChanges.name pra decidir prisma operation
        return
    }


    // escolher gh query + result type + prisma operation por  
    // a. tipo do field (webhookEvent.changes.field_value.field_type)
    // b. nome do field (webhookEvent.changes.field_value.field_name)

    // COMO PEGAR FIELD VALUE
    // se changes tiver { from, to }, usar
    // se não, fazer buscar fieldValue pelo nodeId

     // event.changes.field_value.field_node_id

    // como chamar UncustomFields? seriam somente os próprios da issue?
    const { data } = await GithubApolloClient.instance.query<
        FieldValueByFieldNodeIdQuery,
        FieldValueByFieldNodeIdQueryVariables
    >({
        query: FieldValueByFieldNodeIdDocument,
        variables: {
            id: fieldValueChanges.field_node_id,
        }
    })

    data.node?.__typename === 'ProjectV2Field' && console.log(`Edited field ${data.node.field}`)
    data.node?.__typename === 'ProjectV2ItemFieldTextValue' && console.log(`Edited field ${data.node.text}`)
    data.node?.__typename === 'ProjectV2ItemFieldSingleSelectValue' && console.log(`Edited field ${data.node.name}`)
    data.node?.__typename === 'ProjectV2ItemFieldNumberValue' && console.log(`Edited field ${data.node.number}`)
    data.node?.__typename === 'ProjectV2ItemFieldIterationValue' && console.log(`Edited field ${data.node.title}`)
    data.node?.__typename === 'ProjectV2ItemFieldDateValue' && console.log(`Edited field ${data.node.date}`)
}
