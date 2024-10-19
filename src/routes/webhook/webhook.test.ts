import { handlePostRoot } from "./webhook.js"
import * as projectsV2Serice from "./service/projectsV2.js"
import { created } from "./payloads/board-issue/created.js"
import entered from "./payloads/board-issue/entered.json"
import edited from "./payloads/board-issue/edited.json"
import converted from "./payloads/board-issue/converted.json"

describe('webhooks', () => {
    let mockResponse: { send: jest.Mock }

    beforeEach(() => {
        jest.clearAllMocks()
        mockResponse = { send: jest.fn() }
    })

    it.each([created, entered])('should handle projects v2 item created event', async (json) => {
        // não deveria precisar definir implementação, jest;mock deveria funcionar
        const spyHandleProjectsV2ItemCreated = jest.spyOn(projectsV2Serice, 'handleProjectsV2ItemCreated').mockImplementation(jest.fn())
        handlePostRoot({ body: json }, mockResponse)
        expect(spyHandleProjectsV2ItemCreated).toHaveBeenCalledWith(json)
    })
    it('should handle projects v2 item edited event', async () => {
        const spyHandleProjectsV2ItemEditedEvent = jest.spyOn(projectsV2Serice, 'handleProjectsV2ItemEditedEvent').mockImplementation(jest.fn())
        handlePostRoot({ body: edited }, mockResponse)
        expect(spyHandleProjectsV2ItemEditedEvent).toHaveBeenCalledWith(edited)
    })
    it('should handle projects v2 item converted event', async () => {
        const spyHandleProjectsV2ItemConvertedEvent = jest.spyOn(projectsV2Serice, 'handleProjectsV2ItemConvertedEvent').mockImplementation(jest.fn())
        handlePostRoot({ body: converted }, mockResponse)
        expect(spyHandleProjectsV2ItemConvertedEvent).toHaveBeenCalledWith(converted)
    })
})