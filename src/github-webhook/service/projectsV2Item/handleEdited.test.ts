import { handleProjectsV2ItemEditedEvent } from "./projectsV2Item.js";
import { getFieldValueByItemNodeIdAndFieldName } from "../../../github-gql/client/projectV2Item/projectV2Item.js";
import * as projectsV2ItemGqlClient from "../../../github-gql/client/projectV2Item/projectV2Item.js";
import { titleEdited } from "../../../../test/webhook-payloads/board-issue/edited.js";
import { numberFieldEdited } from "../../../../test/webhook-payloads/board-field/number.js";
import { mockPrisma } from "../../../../test/mockPrisma.js";

// TODO adaptar com padrão dos outros testes (sem manipular prisma)

describe("handleProjectsV2ItemEditedEvent", () => {
  let spyGetFieldValueByItemNodeIdAndFieldName: jest.SpyInstance;

  beforeEach(() => {
    spyGetFieldValueByItemNodeIdAndFieldName = jest.spyOn(
      projectsV2ItemGqlClient,
      "getFieldValueByItemNodeIdAndFieldName"
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when the field edited is not an issue title", async () => {
    await handleProjectsV2ItemEditedEvent(numberFieldEdited);

    expect(getFieldValueByItemNodeIdAndFieldName).not.toHaveBeenCalled();
    expect(mockPrisma.issue.update).not.toHaveBeenCalled();
  });

  it("should update issue when the field edited is an issue title", async () => {
    const newIssueTitle = "Mock Issue Title";
    const issueId = titleEdited.projects_v2_item.content_node_id;

    spyGetFieldValueByItemNodeIdAndFieldName.mockResolvedValue({
      __typename: "ProjectV2ItemFieldTextValue",
      text: newIssueTitle,
    });
    mockPrisma.issue.update.mockResolvedValue({
      id: issueId,
      number: 1,
      title: newIssueTitle,
    });

    await handleProjectsV2ItemEditedEvent(titleEdited);

    expect(getFieldValueByItemNodeIdAndFieldName).toHaveBeenCalledWith(
      titleEdited.projects_v2_item.node_id,
      titleEdited.changes.field_value.field_type
    );
    expect(mockPrisma.issue.update).toHaveBeenCalledWith({
      data: { title: newIssueTitle },
      where: { id: issueId },
    });
  });
});
