import { converted } from "../../../../test/webhook-payloads/board-issue/converted.js";
import * as projectsV2Item from "../../../github-gql/issue.js";
import { handleProjectsV2ItemConvertedEvent } from "./projectsV2Item.js";
import { getIssueByNodeId } from "../../../github-gql/issue.js";
import { mockPrisma } from "../../../../test/mockPrisma.js";
import { ProjectsV2ItemConvertedEvent } from "@octokit/webhooks-types";

describe("handleProjectsV2ItemConvertedEvent", () => {
  const contentNodeId = converted.projects_v2_item.content_node_id;

  let spyGetIssueByNodeId: jest.SpyInstance;

  beforeEach(() => {
    spyGetIssueByNodeId = jest.spyOn(projectsV2Item, "getIssueByNodeId");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // when insertion on board, an issue creation event is triggered also
  it("should do nothing when converting from null", async () => {
    const projectsV2IssueFromNullConvertedEvent: ProjectsV2ItemConvertedEvent =
      {
        ...converted,
        changes: {
          content_type: {
            ...converted.changes.content_type,
            // @ts-expect-error @octokit/webhooks-types is not full up to date
            from: null,
          },
        },
      };

    await handleProjectsV2ItemConvertedEvent(
      projectsV2IssueFromNullConvertedEvent
    );

    expect(getIssueByNodeId).not.toHaveBeenCalled();
    expect(mockPrisma.issue.create).not.toHaveBeenCalled();
  });

  it("should do nothing when the issue node is not found", async () => {
    spyGetIssueByNodeId.mockResolvedValue(null);

    await handleProjectsV2ItemConvertedEvent(converted);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(mockPrisma.issue.create).not.toHaveBeenCalled();
  });

  it("should create a new issue when handling an project v2 converted event", async () => {
    const mockIssue = {
      id: contentNodeId,
      number: 123,
      title: "Mock Issue Title",
    };
    spyGetIssueByNodeId.mockResolvedValue(mockIssue);

    // seria legal não mexer no prisma aqui, só na camada de interface (prisma/operations)
    mockPrisma.issue.create.mockResolvedValue(mockIssue);

    await handleProjectsV2ItemConvertedEvent(converted);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(mockPrisma.issue.create).toHaveBeenCalledWith({ data: mockIssue });
  });
});
