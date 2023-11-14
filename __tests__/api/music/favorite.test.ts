import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import dbConnect from '@/lib/dbConnect';
import MusicFile from '@/models/MusicFile';
import User from '@/models/User';
import { defaultJWEContent, defaultMockedUser, encryptJWE } from '@/testutils/auth';
import favorite from '@/pages/api/music/favorite';
import Favorite from '@/models/Favorite';

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

describe("/api/music/favorite", () => { 
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
            await favorite(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail if mocked user does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET"
        })
        await favorite(req, res)
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

        await favorite(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should fail if song id is not given", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await favorite(req, res)
        expect(res._getStatusCode()).toBe(400)
    })

    it("Should fail if song id is poorly formatted", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            },
            query: {
                id: "fake"
            }
        })

        await favorite(req, res)
        expect(res._getStatusCode()).toBe(400)
    })

    it("Should fail if song id does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            },
            query: {
                id: "0000cedfa1397c896bbbb82f"
            }
        })

        await favorite(req, res)
        expect(res._getStatusCode()).toBe(404)
    })

    it("Should fail if set is not set correctly", async () => {
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
                id: String(file._id),
                set: "nothing"
            }
        })

        await favorite(req, res)
        expect(res._getStatusCode()).toBe(400)
    })

    it("Should set favorite ", async () => {
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
                id: String(file._id),
                set: "true"
            }
        })

        await favorite(req, res)
        expect(res._getStatusCode()).toBe(200)
        
        const favorites = await Favorite.find({});
        expect(favorites).toHaveLength(1);
        const fav = favorites[0];
        expect(String(fav.file)).toBe(String(file._id));
    })

    it("Should delete favorite", async () => {
        const bFavorites = await Favorite.find({});
        expect(bFavorites).toHaveLength(1);
        const fav = bFavorites[0];

        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            },
            query: {
                id: String(fav.file),
                set: "false"
            }
        })

        await favorite(req, res)
        expect(res._getStatusCode()).toBe(200)
        
        const aFavorites = await Favorite.find({});
        expect(aFavorites).toHaveLength(0);
    })
})