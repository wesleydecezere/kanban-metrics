import { getFieldValueByItemNodeIdAndFieldName } from "../../../../github-gql/client/projectV2Item/projectV2Item.js";
import * as projectsV2ItemGqlClient from "../../../../github-gql/client/projectV2Item/projectV2Item.js";
import { titleEdited } from "../../../../../test/webhook-payloads/edited/title.js";
import { numberFieldEdited } from "../../../../../test/webhook-payloads/edited/number.js";
import { IssueOperations } from "../../../../../prisma/operations/IssueOperations.js";
import { handleProjectsV2ItemTitleEditedEvent } from "./handleTitleEditedEvent.js";

// TODO reavaliar como deixar os mocks typesafe

describe("handleProjectsV2ItemEditedEvent", () => {
  let spyGetFieldValueByItemNodeIdAndFieldName: jest.SpyInstance;
  let spyIssueUpdateByTitle: jest.SpyInstance;

  beforeEach(() => {
    spyGetFieldValueByItemNodeIdAndFieldName = jest.spyOn(
      projectsV2ItemGqlClient,
      "getFieldValueByItemNodeIdAndFieldName"
    );
    spyIssueUpdateByTitle = jest.spyOn(IssueOperations, "updateTitleById");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when doesn't find the field value on github", async () => {
    const projects_v2_item = titleEdited.projects_v2_item;
    const fieldName = titleEdited.changes.field_value.field_type;

    spyGetFieldValueByItemNodeIdAndFieldName.mockResolvedValue(null);

    await handleProjectsV2ItemTitleEditedEvent(projects_v2_item, fieldName);

    expect(getFieldValueByItemNodeIdAndFieldName).toHaveBeenCalledWith(
      projects_v2_item.node_id,
      fieldName
    );
    expect(spyIssueUpdateByTitle).not.toHaveBeenCalled();
  });

  it("should do nothing when the field value found isn't of type text", () => {
    const projects_v2_item = numberFieldEdited.projects_v2_item;
    const fieldName = numberFieldEdited.changes.field_value.field_type;

    spyGetFieldValueByItemNodeIdAndFieldName.mockResolvedValue({
      __typename: "ProjectV2ItemFieldNumberValue",
      number: 123,
    });

    handleProjectsV2ItemTitleEditedEvent(projects_v2_item, fieldName);

    expect(getFieldValueByItemNodeIdAndFieldName).toHaveBeenCalledWith(
      projects_v2_item.node_id,
      fieldName
    );
    expect(spyIssueUpdateByTitle).not.toHaveBeenCalled();
  });

  it("should update issue when the field edited is an issue title", async () => {
    const newIssueTitle = "Mock Issue Title";

    const projects_v2_item = titleEdited.projects_v2_item;
    const issueId = projects_v2_item.content_node_id;
    const fieldName = titleEdited.changes.field_value.field_type;

    spyGetFieldValueByItemNodeIdAndFieldName.mockResolvedValue({
      __typename: "ProjectV2ItemFieldTextValue",
      text: newIssueTitle,
    });
    spyIssueUpdateByTitle.mockResolvedValue({
      id: issueId,
      title: newIssueTitle,
    });

    await handleProjectsV2ItemTitleEditedEvent(projects_v2_item, fieldName);

    expect(getFieldValueByItemNodeIdAndFieldName).toHaveBeenCalledWith(
      projects_v2_item.node_id,
      fieldName
    );
    expect(spyIssueUpdateByTitle).toHaveBeenCalledWith(newIssueTitle, issueId);
  });
});
