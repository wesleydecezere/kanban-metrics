import { titleEdited } from "../../../../../test/webhook-payloads/edited/title.js";
import { numberFieldEdited } from "../../../../../test/webhook-payloads/edited/number.js";
import { handleProjectsV2ItemEditedEvent } from "./handleEditedEvent.js";
import * as handleTitleEditedEvent from "./handleTitleEditedEvent.js";

// TODO reavaliar como deixar os mocks typesafe

describe("handleProjectsV2ItemEditedEvent", () => {
  let spyHandleProjectsV2ItemTitleEditedEvent: jest.SpyInstance;

  beforeEach(() => {
    spyHandleProjectsV2ItemTitleEditedEvent = jest.spyOn(
      handleTitleEditedEvent,
      "handleProjectsV2ItemTitleEditedEvent"
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when the field edited is not an issue title", async () => {
    await handleProjectsV2ItemEditedEvent(numberFieldEdited);
    expect(spyHandleProjectsV2ItemTitleEditedEvent).not.toHaveBeenCalled();
  });

  it("should update issue when the field edited is an issue title", async () => {
    spyHandleProjectsV2ItemTitleEditedEvent.mockResolvedValue({});

    await handleProjectsV2ItemEditedEvent(titleEdited);

    expect(spyHandleProjectsV2ItemTitleEditedEvent).toHaveBeenCalledWith(
      titleEdited.projects_v2_item,
      titleEdited.changes.field_value.field_type
    );
  });
});
