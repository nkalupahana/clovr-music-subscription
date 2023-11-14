import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { defaultJWEContent, defaultMockedUser, encryptJWE } from '@/testutils/auth';
import subscribe from '@/pages/api/stripe/subscribe';

let mongod: MongoMemoryServer | undefined = undefined;

describe("/api/stripe/subscribe", () => { 
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await dbConnect(uri);
        await User.create(defaultMockedUser)
        await User.create({
            ...defaultMockedUser,
            email: "sub@user.com",
            subscription: "mock"
        })
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
            await subscribe(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail if mocked user does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET"
        })
        await subscribe(req, res)
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

        await subscribe(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should redirect if unsubscribed", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await subscribe(req, res)
        expect(res._getStatusCode()).toBe(302)
    })

    it("Should not redirect if subscribed", async () => {
        let jwe = {
            ...defaultJWEContent,
            email: "sub@user.com"
        }
        
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(jwe)
            }
        })

        await subscribe(req, res)
        expect(res._getStatusCode()).toBe(200)
    })
})