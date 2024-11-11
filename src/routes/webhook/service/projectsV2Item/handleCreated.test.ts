import { ProjectsV2ItemCreatedEvent } from "@octokit/webhooks-types";
import { getIssueByNodeId } from "../../../../github-gql/command/issue/getIssueByNodeId.js";
import { handleProjectsV2ItemCreated } from "./projectsV2Item.js";
import { created } from "../../payloads/board-issue/created.js";
import * as projectsV2Item from "../../../../github-gql/command/projectV2Item.js";
import { mockPrisma } from "../../../../../test/mockPrisma.js";

describe("handleProjectsV2ItemCreated", () => {
  const contentNodeId = created.projects_v2_item.content_node_id;

  let spyGetIssueByNodeId: jest.SpyInstance;

  beforeEach(() => {
    spyGetIssueByNodeId = jest.spyOn(projectsV2Item, "getIssueByNodeId");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log a message if the item is not an issue", async () => {
    const projectsV2DraftIssueCreatedEvent: ProjectsV2ItemCreatedEvent = {
      ...created,
      projects_v2_item: {
        ...created.projects_v2_item,
        content_type: "DraftIssue",
      },
    };

    await handleProjectsV2ItemCreated(projectsV2DraftIssueCreatedEvent);

    expect(spyGetIssueByNodeId).not.toHaveBeenCalled();
  });

  it("should log a message if the issue node is not found", async () => {
    spyGetIssueByNodeId.mockResolvedValue(null);

    await handleProjectsV2ItemCreated(created);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
  });

  it("should create a new issue when handling an project v2 issue creation event", async () => {
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

    await handleProjectsV2ItemCreated(created);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(mockPrisma.issue.create).toHaveBeenCalledWith({
      data: {
        ...mockIssue,
      },
    });
  });
});
