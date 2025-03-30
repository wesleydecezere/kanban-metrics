import { handlePostRoot } from "./webhook.js";
import * as projectsV2ItemService from "../../github-webhook/service/projectsV2Item/projectsV2Item.js";
import * as projectsV2ItemEditedService from "../../github-webhook/service/projectsV2Item/edited/handleEditedEvent.js";
import { created } from "../../../test/webhook-payloads/created.js";
import { converted } from "../../../test/webhook-payloads/converted.js";
import { titleEdited } from "../../../test/webhook-payloads/edited/title.js";
import { mock } from "jest-mock-extended";
import { Request, Response } from "express";

describe("webhook", () => {
  let mockRequest: Request;
  let mockResponse: Response;

  let spyHandleProjectsV2ItemCreated: jest.SpyInstance;
  let spyHandleProjectsV2ItemConvertedEvent: jest.SpyInstance;
  let spyHandleProjectsV2ItemEditedEvent: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = mock<Request>();
    mockResponse = mock<Response>();

    spyHandleProjectsV2ItemCreated = jest
      .spyOn(projectsV2ItemService, "handleProjectsV2ItemCreatedEvent")
      .mockResolvedValue();
    spyHandleProjectsV2ItemConvertedEvent = jest
      .spyOn(projectsV2ItemService, "handleProjectsV2ItemConvertedEvent")
      .mockResolvedValue();
    spyHandleProjectsV2ItemEditedEvent = jest
      .spyOn(projectsV2ItemEditedService, "handleProjectsV2ItemEditedEvent")
      .mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when event is not a ProjectsV2ItemEvent or IssuesEvent", async () => {
    mockRequest.body = {};

    handlePostRoot(mockRequest, mockResponse);

    expect(spyHandleProjectsV2ItemCreated).not.toHaveBeenCalled();
    expect(spyHandleProjectsV2ItemConvertedEvent).not.toHaveBeenCalled();
    expect(spyHandleProjectsV2ItemEditedEvent).not.toHaveBeenCalled();
  });

  it("should handle projects v2 item created event", async () => {
    mockRequest.body = created;

    handlePostRoot(mockRequest, mockResponse);

    expect(spyHandleProjectsV2ItemCreated).toHaveBeenCalledWith(created);
    expect(spyHandleProjectsV2ItemConvertedEvent).not.toHaveBeenCalled();
    expect(spyHandleProjectsV2ItemEditedEvent).not.toHaveBeenCalled();
  });

  it("should handle projects v2 item converted event", async () => {
    mockRequest.body = converted;

    handlePostRoot(mockRequest, mockResponse);

    expect(spyHandleProjectsV2ItemCreated).not.toHaveBeenCalled();
    expect(spyHandleProjectsV2ItemConvertedEvent).toHaveBeenCalledWith(
      converted
    );
    expect(spyHandleProjectsV2ItemEditedEvent).not.toHaveBeenCalled();
  });

  it("should handle projects v2 item edited event", async () => {
    mockRequest.body = titleEdited;

    handlePostRoot(mockRequest, mockResponse);

    expect(spyHandleProjectsV2ItemCreated).not.toHaveBeenCalled();
    expect(spyHandleProjectsV2ItemConvertedEvent).not.toHaveBeenCalled();
    expect(spyHandleProjectsV2ItemEditedEvent).toHaveBeenCalledWith(
      titleEdited
    );
  });
});
