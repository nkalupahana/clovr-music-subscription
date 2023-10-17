import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import play from '../../music/play'
import dbConnect from '@/lib/dbConnect';
import MusicFile from '@/models/MusicFile';

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

describe("/api/music/play", () => {
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
            await play(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should 404 on a non-existent song", async () => {
        const { req, res } = createMocks({
            method: "GET",
            query: {
                id: "mock"
            }
        })
        await play(req, res)
        expect(res._getStatusCode()).toBe(404)
    })

    it("Should redirect to song", async () => {
        const file = await MusicFile.create({
            releaseDate: "2020-01-01",
            albumArtKey: "mock",
            songKey: "mock",
            name: "mock",
            artist: "mock",
            tempo: 120,
        });

        const { req, res } = createMocks({
            method: "GET",
            query: {
                id: file._id
            }
        })
        await play(req, res)
        expect(res._getStatusCode()).toBe(302)
    })
})