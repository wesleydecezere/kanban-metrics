import { handleProjectsV2ItemEditedEvent } from "./projectsV2Item.js";
import { getFieldValueBy } from "../../../../github-gql/command/projectsV2Item.js";
import * as projectsV2Item from "../../../../github-gql/command/projectsV2Item.js";
import { titleEdited } from "../../payloads/board-issue/edited.js";
import { numberFieldEdited } from "../../payloads/board-field/number.js";
import { mockPrisma } from "../../../../../test/mockPrisma.js";

describe("handleProjectsV2ItemEditedEvent", () => {
  let spyGetFieldValueBy: jest.SpyInstance;

  beforeEach(() => {
    spyGetFieldValueBy = jest.spyOn(projectsV2Item, "getFieldValueBy");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when the field edited is not an issue title", async () => {
    await handleProjectsV2ItemEditedEvent(numberFieldEdited);

    expect(getFieldValueBy).not.toHaveBeenCalled();
    expect(mockPrisma.issue.update).not.toHaveBeenCalled();
  });

  it("should update issue when the field edited is an issue title", async () => {
    const newIssueTitle = "Mock Issue Title";
    const issueId = titleEdited.projects_v2_item.content_node_id;

    spyGetFieldValueBy.mockResolvedValue({
      __typename: "ProjectV2ItemFieldTextValue",
      text: newIssueTitle,
    });
    mockPrisma.issue.update.mockResolvedValue({
      id: issueId,
      number: 1,
      title: newIssueTitle,
    });

    await handleProjectsV2ItemEditedEvent(titleEdited);

    expect(getFieldValueBy).toHaveBeenCalledWith({
      itemNodeId: titleEdited.projects_v2_item.node_id,
      fieldName: titleEdited.changes.field_value.field_type,
    });
    expect(mockPrisma.issue.update).toHaveBeenCalledWith({
      data: { title: newIssueTitle },
      where: { id: issueId },
    });
  });
});
