import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import downloads from '@/pages/api/my/downloads'
import dbConnect from '@/lib/dbConnect';
import MusicFile from '@/models/MusicFile';
import User from '@/models/User';
import { defaultJWEContent, defaultMockedUser, encryptJWE } from '@/testutils/auth';
import download from '@/pages/api/music/download';

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

describe("/api/my/downloads", () => { 
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
        jest.resetAllMocks()
    })

    it("Should fail on other request types", async () => {
        const types = ["POST", "PUT", "PATCH", "DELETE"]
        for (let type of types) {
            const { req, res } = createMocks({
                method: type as any
            })
            await downloads(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail if mocked user does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET"
        })
        await downloads(req, res)
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

        await downloads(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should show no downloads", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await downloads(req, res)
        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual([])
    })

    it("Should show one download", async () => {
        {
            // Create download
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
        }

        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await downloads(req, res)
        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toHaveLength(1)
    })
})