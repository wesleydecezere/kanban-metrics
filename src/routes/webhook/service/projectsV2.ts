import { ProjectsV2ItemCreatedEvent, ProjectsV2ItemEditedEvent } from "@octokit/webhooks-types"
import { IssueByProjectV2ItemNodeIdQuery, IssueByProjectV2ItemNodeIdQueryVariables, IssueByProjectV2ItemNodeIdDocument } from "../../../graphql/generated/types.js"
import { GithubApolloClient } from "../../../github-client/GithubApolloClient.js"
import { FieldValueByFieldNodeIdQuery, FieldValueByFieldNodeIdQueryVariables, FieldValueByFieldNodeIdDocument } from "../../../graphql/generated/types.js"
import { isProjectsV2ItemCustomFieldValueChanges } from "../../../model/webhook/webhook.js"

export async function handleProjectsV2ItemCreated(event: ProjectsV2ItemCreatedEvent) {
    // escolher gh query + result type + prisma operation por  
    // a. tipo do field (webhookEvent.changes.field_value.field_type)
    // b. nome do field (webhookEvent.changes.field_value.field_name)

    // COMO PEGAR FIELD VALUE
    // se changes tiver { from, to }, usar
    // se não, fazer buscar fieldValue pelo nodeId

    const { data } = await GithubApolloClient.instance.query<
        IssueByProjectV2ItemNodeIdQuery, 
        IssueByProjectV2ItemNodeIdQueryVariables
    >({
        query: IssueByProjectV2ItemNodeIdDocument,
        variables: {
            id: '1' //event.changes.field_value.field_node_id
        }
    })

    if (data.item?.__typename === 'ProjectV2Item' && data.item?.content?.__typename === 'Issue') {
        const { number, title } = data.item.content
        console.log(`Created issue #${number} - ${title}`)
    }
}

export async function handleProjectsV2ItemEditedEvent(webhookEvent: ProjectsV2ItemEditedEvent) {
    const fieldValueChanges = webhookEvent.changes.field_value

    if (isProjectsV2ItemCustomFieldValueChanges(fieldValueChanges)) {
        const { field_name, from, to } = fieldValueChanges
        console.log(`Edited field ${field_name} from ${from} to ${to}`)

        // verificar tipo fieldValueChanges.to + valor fieldValueChanges.name pra decidir prisma operation
        return
    }

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