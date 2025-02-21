import { ProjectsV2ItemCreatedEvent } from "@octokit/webhooks-types";
import { getIssueByNodeId } from "../../../github-gql/issue.js";
import { handleProjectsV2ItemCreatedEvent } from "./projectsV2Item.js";
import { created } from "../../../../test/webhook-payloads/board-issue/created.js";
import * as projectsV2Item from "../../../github-gql/issue.js";
import { mockPrisma } from "../../../../test/mockPrisma.js";

describe("handleProjectsV2ItemCreatedEvent", () => {
  const contentNodeId = created.projects_v2_item.content_node_id;

  let spyGetIssueByNodeId: jest.SpyInstance;

  beforeEach(() => {
    spyGetIssueByNodeId = jest.spyOn(projectsV2Item, "getIssueByNodeId");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when the item is not an issue", async () => {
    const projectsV2DraftIssueCreatedEvent: ProjectsV2ItemCreatedEvent = {
      ...created,
      projects_v2_item: {
        ...created.projects_v2_item,
        content_type: "DraftIssue",
      },
    };

    await handleProjectsV2ItemCreatedEvent(projectsV2DraftIssueCreatedEvent);

    expect(spyGetIssueByNodeId).not.toHaveBeenCalled();
    expect(mockPrisma.issue.create).not.toHaveBeenCalled();
  });

  it("should do nothing when the issue node is not found", async () => {
    spyGetIssueByNodeId.mockResolvedValue(null);

    await handleProjectsV2ItemCreatedEvent(created);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(mockPrisma.issue.create).not.toHaveBeenCalled();
  });

  it("should create a new issue when handling an project v2 issue creation event", async () => {
    const mockIssue = {
      id: contentNodeId,
      number: 123,
      title: "Mock Issue Title",
    };
    spyGetIssueByNodeId.mockResolvedValue(mockIssue);

    // seria legal não mexer no prisma aqui, só na camada de interface (prisma/operations)
    mockPrisma.issue.create.mockResolvedValue(mockIssue);

    await handleProjectsV2ItemCreatedEvent(created);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(mockPrisma.issue.create).toHaveBeenCalledWith({ data: mockIssue });
  });
});
