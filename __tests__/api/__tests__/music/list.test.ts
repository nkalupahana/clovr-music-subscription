import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import list from '@/pages/api/music/list'
import dbConnect from '@/lib/dbConnect';
import MusicFile from '@/models/MusicFile';

let mongod: MongoMemoryServer | undefined = undefined;

describe("/api/music/list", () => {
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
            await list(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should return an empty list with no items", async () => {
        const { req, res } = createMocks({
            method: "GET"
        })
        const resp = await list(req, res)
        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual([])
    })

    it("Should return a list with one item", async () => {
        await MusicFile.create({
            releaseDate: "2020-01-01",
            albumArtKey: "mock",
            songKey: "mock",
            name: "mock",
            artist: "mock",
            tempo: 120,
        });

        const { req, res } = createMocks({
            method: "GET"
        })
        const resp = await list(req, res)
        expect(res._getStatusCode()).toBe(200)
        const data = JSON.parse(res._getData());
        expect(data).toHaveLength(1)
        expect(data[0]).toEqual(
            expect.objectContaining({
                releaseDate: "2020-01-01",
                albumArtKey: "mock",
                songKey: "mock",
                name: "mock",
                artist: "mock",
                tempo: 120,
            })
        )
    })

    it("Should return a list with 100 items", async () => {
        for (let i = 0; i < 100; i++) {
            await MusicFile.create({
                releaseDate: "2020-01-01",
                albumArtKey: "mock",
                songKey: "mock",
                name: "mock",
                artist: "mock",
                tempo: 120,
            });
        }

        const { req, res } = createMocks({
            method: "GET"
        })
        const resp = await list(req, res)
        expect(res._getStatusCode()).toBe(200)
        const data = JSON.parse(res._getData());
        expect(data).toHaveLength(100)
    })
})