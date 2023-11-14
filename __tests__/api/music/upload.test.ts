import {
    createMocks
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { defaultJWEContent, defaultMockedUser, encryptJWE } from '@/testutils/auth';
import upload from '@/pages/api/music/upload';
import fs from "fs"

let mongod: MongoMemoryServer | undefined = undefined;

jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => {
            return {
                getSignedUrlPromise: jest.fn().mockResolvedValue("https://r2.dev/mock"),
                promise: jest.fn().mockReturnThis(),
                catch: jest.fn(),
                putObject: () =>{
                    return {
                        promise: jest.fn()
                    }
                }
            }
        })
    }
})

jest.mock("formidable", () => {
    return () => {
        return {
            parse: (req: any) => {
                return [req.body.f1, req.body.f2]
            }
        }
    }
})

const defaultAdminJWEContent = {
    ...defaultJWEContent,
    isAdmin: true
}

describe("/api/music/upload", () => { 
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
        const types = ["GET", "PUT", "PATCH", "DELETE"]
        for (let type of types) {
            const { req, res } = createMocks({
                method: type as any
            })
            await upload(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail if mocked user does not exist", async () => {
        const { req, res } = createMocks({
            method: "POST"
        })
        await upload(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should fail if user is not admin", async () => {
        const { req, res } = createMocks({
            method: "POST",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await upload(req, res)
        expect(res._getStatusCode()).toBe(403)
    })


    it("Should fail if user id does not exist", async () => {
        let jweContent = {
            ...defaultAdminJWEContent,
            email: "dne@user.com"
        };

        const { req, res } = createMocks({
            method: "POST",
            cookies: {
                "next-auth.session-token": await encryptJWE(jweContent)
            }
        })

        await upload(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should succeed with valid data", async () => {
        let data = {
            f1: {
                songname: ["Mock"],
                duration: ["120"],
                artist: ["Mock"],
                releaseDate: ["2021-01-01"],
            },
            f2: {
                musicFile: [{
                    newFilename: "mock",
                    mimetype: "audio/wav",
                    filepath: "__tests__/test.wav"
                }],
                albumArtFile: [{
                    newFilename: "mock",
                    mimetype: "image/webp",
                    filepath: "__tests__/test.webp"
                }]
            }
        }

        const { req, res } = createMocks({
            method: "POST",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultAdminJWEContent)
            },
            body: data
        })
        await upload(req, res)
        expect(res._getStatusCode()).toBe(302)
        expect(res._getRedirectUrl()).toContain("success")
    })
})