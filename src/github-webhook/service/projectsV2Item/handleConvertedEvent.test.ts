import { converted } from "../../../../test/webhook-payloads/converted.js";
import * as issueGqlClient from "../../../github-gql/client/issue/issue.js";
import { handleProjectsV2ItemConvertedEvent } from "./projectsV2Item.js";
import { ProjectsV2ItemConvertedEvent } from "@octokit/webhooks-types";
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js";

describe("handleProjectsV2ItemConvertedEvent", () => {
  const contentNodeId = converted.projects_v2_item.content_node_id;

  let spyGetIssueByNodeId: jest.SpyInstance;
  let spyIssueCreateIfAbsent: jest.SpyInstance;

  beforeEach(() => {
    spyGetIssueByNodeId = jest.spyOn(issueGqlClient, "getIssueByNodeId");
    spyIssueCreateIfAbsent = jest.spyOn(IssueOperations, "createIfAbsent");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // when inserted into the board, a created event is also triggered
  it("should do nothing when converting from null", async () => {
    const projectsV2IssueFromNullConvertedEvent: ProjectsV2ItemConvertedEvent =
      {
        ...converted,
        changes: {
          content_type: {
            ...converted.changes.content_type,
            // @ts-expect-error "@octokit/webhooks-types" package is not fully up to date
            from: null,
          },
        },
      };

    await handleProjectsV2ItemConvertedEvent(
      projectsV2IssueFromNullConvertedEvent
    );

    expect(spyGetIssueByNodeId).not.toHaveBeenCalled();
    expect(spyIssueCreateIfAbsent).not.toHaveBeenCalled();
  });

  it("should do nothing when the issue node is not found", async () => {
    spyGetIssueByNodeId.mockResolvedValue(null);

    await handleProjectsV2ItemConvertedEvent(converted);

    expect(spyGetIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(spyIssueCreateIfAbsent).not.toHaveBeenCalled();
  });

  it("should create a new issue when handling an project v2 converted event", async () => {
    const mockIssue = {
      id: contentNodeId,
      number: 123,
      title: "Mock Issue Title",
    };
    spyGetIssueByNodeId.mockResolvedValue(mockIssue);
    spyIssueCreateIfAbsent.mockResolvedValue(mockIssue);

    await handleProjectsV2ItemConvertedEvent(converted);

    expect(spyGetIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(spyIssueCreateIfAbsent).toHaveBeenCalledWith({ ...mockIssue });
  });
});
