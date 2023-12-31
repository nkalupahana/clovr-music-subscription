import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import download from '@/pages/api/music/download'
import dbConnect from '@/lib/dbConnect';
import MusicFile from '@/models/MusicFile';
import User from '@/models/User';
import { defaultJWEContent, defaultMockedUser, encryptJWE } from '@/testutils/auth';

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
        await User.create(defaultMockedUser)
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

    it("Should fail if user id does not exist", async () => {
        let jweContent = {
            ...defaultJWEContent,
            email: "dne@user.com"
        };

        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(jweContent)
            }
        })

        await download(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should fail if song id is not given", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await download(req, res)
        expect(res._getStatusCode()).toBe(400)
    })

    it("Should fail if song id does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            },
            query: {
                id: "fake"
            }
        })

        await download(req, res)
        expect(res._getStatusCode()).toBe(404)
    })

    it("Should succeed if song exists", async () => {
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
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            },
            query: {
                id: String(file._id)
            }
        })

        await download(req, res)
        expect(res._getStatusCode()).toBe(302)
    })
})