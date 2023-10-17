import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import download from '../../music/download'
import dbConnect from '@/lib/dbConnect';
import MusicFile from '@/models/MusicFile';
import User from '@/models/User';

let mongod: MongoMemoryServer | undefined = undefined;

jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => {
            return {
                getSignedUrlPromise: jest.fn().mockResolvedValue("https://r2.dev/mock"),
                promise: jest.fn().mockReturnThis(),
                catch: jest.fn(),
            }
        })
    }
})

describe("/api/music/download", () => { 
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await dbConnect(uri);
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongod?.stop();
    })

    afterEach(async () => {
        await MusicFile.deleteMany({})
        jest.resetAllMocks()
    })

    it("Should fail on other request types", async () => {
        const types = ["POST", "PUT", "PATCH", "DELETE"]
        for (let type of types) {
            const { req, res } = createMocks({
                method: type as any
            })
            await download(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail if mocked user does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET"
        })
        await download(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    // todo: fixup
    it("Should fail if song id does not exist", async () => {
        await User.create({
            name: "Mocked User",
            email: "mocked@user.com"
        })

        const { req, res } = createMocks({
            method: "GET"
        })
        await download(req, res)
        expect(res._getStatusCode()).toBe(401)
    })
})