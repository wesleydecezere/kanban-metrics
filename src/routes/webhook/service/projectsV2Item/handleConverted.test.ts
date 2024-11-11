import { converted } from "../../payloads/board-issue/converted.js";
import * as projectsV2Item from "../../../../github-gql/command/projectV2Item.js";
import { handleProjectsV2ItemConvertedEvent } from "./projectsV2Item.js";
import { getIssueByNodeId } from "../../../../github-gql/command/issue/getIssueByNodeId.js";
import { mockPrisma } from "../../../../../test/mockPrisma.js";

describe("handleProjectsV2ItemConverted", () => {
  const contentNodeId = converted.projects_v2_item.content_node_id;

  let spyGetIssueByNodeId: jest.SpyInstance;

  beforeEach(() => {
    spyGetIssueByNodeId = jest.spyOn(projectsV2Item, "getIssueByNodeId");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log a message if the issue node is not found", async () => {
    spyGetIssueByNodeId.mockResolvedValue(null);

    await handleProjectsV2ItemConvertedEvent(converted);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
  });

  it("should create a new issue when handling an project v2 converted event", async () => {
    const mockIssue = {
      id: contentNodeId,
      number: 123,
      title: "Mock Issue Title",
    };
    spyGetIssueByNodeId.mockResolvedValue(mockIssue);

    // seria legal não mexer no prisma aqui, só na camada de interface (prisma/operations)
    mockPrisma.issue.create.mockResolvedValue({
      ...mockIssue,
    });

    await handleProjectsV2ItemConvertedEvent(converted);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(mockPrisma.issue.create).toHaveBeenCalledWith({
      data: {
        ...mockIssue,
      },
    });
  });
});
