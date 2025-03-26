import { handleProjectsV2ItemEditedEvent } from "./projectsV2Item.js";
import { getFieldValueByItemNodeIdAndFieldName } from "../../../github-gql/client/projectV2Item/projectV2Item.js";
import * as projectsV2ItemGqlClient from "../../../github-gql/client/projectV2Item/projectV2Item.js";
import { titleEdited } from "../../../../test/webhook-payloads/edited/title.js";
import { numberFieldEdited } from "../../../../test/webhook-payloads/edited/number.js";
import { mockPrisma } from "../../../../test/mockPrisma.js";
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js";

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

  it("should do nothing when the field edited is not an issue title", async () => {
    await handleProjectsV2ItemEditedEvent(numberFieldEdited);

    expect(getFieldValueByItemNodeIdAndFieldName).not.toHaveBeenCalled();
    expect(spyIssueUpdateByTitle).not.toHaveBeenCalled();
  });

  // TODO add demais CDTs
  it("should do nothing when doesn't find the field value on github", () => {});

  it("should do nothing when the field value found isn't of type text", () => {});

  it("should update issue when the field edited is an issue title", async () => {
    const newIssueTitle = "Mock Issue Title";
    const issueId = titleEdited.projects_v2_item.content_node_id;

    spyGetFieldValueByItemNodeIdAndFieldName.mockResolvedValue({
      __typename: "ProjectV2ItemFieldTextValue",
      text: newIssueTitle,
    });
    spyIssueUpdateByTitle.mockResolvedValue({
      id: issueId,
      title: newIssueTitle,
    });

    await handleProjectsV2ItemEditedEvent(titleEdited);

    expect(getFieldValueByItemNodeIdAndFieldName).toHaveBeenCalledWith(
      titleEdited.projects_v2_item.node_id,
      titleEdited.changes.field_value.field_type
    );
    expect(spyIssueUpdateByTitle).toHaveBeenCalledWith(newIssueTitle, issueId);
  });
});
