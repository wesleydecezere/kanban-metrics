import { handlePostRoot } from "./webhook.js"
import * as projectsV2Serice from "./service/projectsV2.js"
import json from "./payloads/board-issue/created.json"

describe('webhooks', () => {
    it('should handle projects v2 item created event', async () => {
        // const eventJson = await fetch('./payloads/board-issue/created.json').then(res => res.json()) ?? ""
        const spyHandleProjectsV2ItemCreated = jest.spyOn(projectsV2Serice, 'handleProjectsV2ItemCreated')

        handlePostRoot({ body: json }, {  })

        expect(spyHandleProjectsV2ItemCreated).toHaveBeenCalledWith(json)
    })
})