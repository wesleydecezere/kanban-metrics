import { IssuesEditedEvent, IssuesLabeledEvent } from "@octokit/webhooks-types";

export function handleIssuesLabeledEvent(event: IssuesLabeledEvent) {
    console.log(`Issue #${event.issue.number} has been labeled at ${event.issue.updated_at}`);
    event.label?.name && console.log(`Label added: ${event.label.name}`);
    return;
}

export function handleIssuesEditedEvent(event: IssuesEditedEvent) {
    const changes = event.changes;

    console.log(`Issue #${event.issue.number} has been edited`);
    changes.body && console.log(`Body has changed from ${changes.body.from} to ${event.issue.body}`);
    changes.title && console.log(`Title has changed from ${changes.title.from} to ${event.issue.title}`);
}