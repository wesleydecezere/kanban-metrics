
import { ProjectsV2ItemCreatedEvent } from "@octokit/webhooks-types";
import { getIssueByProjectV2ItemNodeId } from "../../../github-gql/command/projectsV2.js"
import { handleProjectsV2ItemCreated } from './projectsV2.js'
import { created } from '../payloads/board-issue/created.js'
import * as projectsV2  from "../../../github-gql/command/projectsV2.js"; 

describe('handleProjectsV2ItemCreated', () => {
  const nodeId = created.projects_v2_item.node_id;

  let spyGetIssueByProjectV2ItemNodeId: jest.SpyInstance

  beforeEach(() => {
    spyGetIssueByProjectV2ItemNodeId = jest.spyOn(projectsV2, 'getIssueByProjectV2ItemNodeId');
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should log a message if the item is not an issue', async () => {
    const projectsV2DraftIssueCreatedEvent: ProjectsV2ItemCreatedEvent = {      
      ...created,
      projects_v2_item: {
        ...created.projects_v2_item,
        content_type: 'DraftIssue',
      },
    };

    await handleProjectsV2ItemCreated(projectsV2DraftIssueCreatedEvent);

    expect(spyGetIssueByProjectV2ItemNodeId).not.toHaveBeenCalled();
  });

  it('should log a message if the issue node is not found', async () => {
    spyGetIssueByProjectV2ItemNodeId.mockResolvedValue(null);

    await handleProjectsV2ItemCreated(created);

    expect(getIssueByProjectV2ItemNodeId).toHaveBeenCalledWith(nodeId);
  });

  it('should create a new issue when it is an issue creatin event in project v2', async () => {
    const mockIssue = { number: 123, title: 'Mock Issue Title' };
    spyGetIssueByProjectV2ItemNodeId.mockResolvedValue(mockIssue);

    await handleProjectsV2ItemCreated(created);

    expect(getIssueByProjectV2ItemNodeId).toHaveBeenCalledWith(created.projects_v2_item.node_id);
  });
});
