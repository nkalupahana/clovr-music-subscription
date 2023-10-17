import {
    createMocks,
} from 'node-mocks-http'
import { MongoMemoryServer } from 'mongodb-memory-server'

import upload from '../../music/upload'

describe("/api/music/upload", () => {
    it("Should fail on other request types", async () => {
        const types = ["GET", "PUT", "PATCH", "DELETE"]
        for (let type of types) {
            const { req, res } = createMocks({
                method: type as any
            })
            await upload(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })
})