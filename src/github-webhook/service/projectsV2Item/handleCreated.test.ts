import { ProjectsV2ItemCreatedEvent } from "@octokit/webhooks-types";
import { getIssueByNodeId } from "../../../github-gql/client/issue/issue.js";
import { handleProjectsV2ItemCreatedEvent } from "./projectsV2Item.js";
import { created } from "../../../../test/webhook-payloads/created.js";
import * as issueGqlClient from "../../../github-gql/client/issue/issue.js";
import { IssueOperations } from "../../../../prisma/operations/IssueOperations.js";

describe("handleProjectsV2ItemCreatedEvent", () => {
  const contentNodeId = created.projects_v2_item.content_node_id;

  let spyGetIssueByNodeId: jest.SpyInstance;
  let spyIssueCreateIfAbsent: jest.SpyInstance;

  beforeEach(() => {
    spyGetIssueByNodeId = jest.spyOn(issueGqlClient, "getIssueByNodeId");
    spyIssueCreateIfAbsent = jest.spyOn(IssueOperations, "createIfAbsent");
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
    expect(spyIssueCreateIfAbsent).not.toHaveBeenCalled();
  });

  it("should do nothing when the issue node is not found", async () => {
    spyGetIssueByNodeId.mockResolvedValue(null);

    await handleProjectsV2ItemCreatedEvent(created);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(spyIssueCreateIfAbsent).not.toHaveBeenCalled();
  });

  it("should create a new issue when handling an project v2 issue creation event", async () => {
    const mockIssue = {
      id: contentNodeId,
      number: 123,
      title: "Mock Issue Title",
    };
    spyGetIssueByNodeId.mockResolvedValue(mockIssue);
    spyIssueCreateIfAbsent.mockResolvedValue(mockIssue);

    await handleProjectsV2ItemCreatedEvent(created);

    expect(getIssueByNodeId).toHaveBeenCalledWith(contentNodeId);
    expect(spyIssueCreateIfAbsent).toHaveBeenCalledWith({ ...mockIssue });
  });
});
