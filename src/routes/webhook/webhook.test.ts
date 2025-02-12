import { handlePostRoot } from "./webhook.js";
import * as projectsV2Serice from "../../github-webhook/service/projectsV2Item/projectsV2Item.js";
import { created } from "../../../test/webhook-payloads/board-issue/created.js";
import { converted } from "../../../test/webhook-payloads/board-issue/converted.js";
import { titleEdited } from "../../../test/webhook-payloads/board-issue/edited.js";

describe("webhook", () => {
  let mockResponse: { send: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockResponse = { send: jest.fn() };
  });

  it("should handle projects v2 item created event", async () => {
    // não deveria precisar definir implementação, jest.mock deveria funcionar
    const spyHandleProjectsV2ItemCreated = jest
      .spyOn(projectsV2Serice, "handleProjectsV2ItemCreatedEvent")
      .mockImplementation(jest.fn());
    handlePostRoot({ body: created }, mockResponse);
    expect(spyHandleProjectsV2ItemCreated).toHaveBeenCalledWith(created);
  });

  it("should handle projects v2 item edited event", async () => {
    const spyHandleProjectsV2ItemEditedEvent = jest
      .spyOn(projectsV2Serice, "handleProjectsV2ItemEditedEvent")
      .mockImplementation(jest.fn());
    handlePostRoot({ body: titleEdited }, mockResponse);
    expect(spyHandleProjectsV2ItemEditedEvent).toHaveBeenCalledWith(
      titleEdited
    );
  });

  it("should handle projects v2 item converted event", async () => {
    const spyHandleProjectsV2ItemConvertedEvent = jest
      .spyOn(projectsV2Serice, "handleProjectsV2ItemConvertedEvent")
      .mockImplementation(jest.fn());
    handlePostRoot({ body: converted }, mockResponse);
    expect(spyHandleProjectsV2ItemConvertedEvent).toHaveBeenCalledWith(
      converted
    );
  });
});
