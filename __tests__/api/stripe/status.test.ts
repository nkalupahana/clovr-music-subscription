import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { defaultJWEContent, defaultMockedUser, encryptJWE } from '@/testutils/auth';
import status from '@/pages/api/stripe/status';

let mongod: MongoMemoryServer | undefined = undefined;

jest.mock('stripe', () => {
    return jest.fn(() => {
        return {
            subscriptions: {
                retrieve: () => {
                    return {
                        status: "active",
                        items: {
                            data: [{
                                quantity: 1
                            }]
                        }
                    }
                }
            }
        }
    })
})

describe("/api/stripe/status", () => { 
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
            await status(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail if mocked user does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET"
        })
        await status(req, res)
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

        await status(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should return as unsubscribed", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await status(req, res)
        expect(res._getStatusCode()).toBe(200)
        expect(res._getJSONData()).toEqual({ status: "unsubscribed" })
    })

    it("Should return subscription details", async () => {
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

        await status(req, res)
        expect(res._getStatusCode()).toBe(200)
        expect(res._getJSONData()).toEqual({ status: "active", quantity: 1 })
    })
})