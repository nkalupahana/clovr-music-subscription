import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { defaultJWEContent, defaultMockedUser, encryptJWE } from '@/testutils/auth';
import manage from '@/pages/api/stripe/manage';

let mongod: MongoMemoryServer | undefined = undefined;

jest.mock('stripe', () => {
    return jest.fn(() => {
        return {
            subscriptions: {
                retrieve: () => {
                    return {
                        status: "active",
                        customer: "cus_mock",
                    }
                },
                update: jest.fn(),
            },
            billingPortal: {
                sessions: {
                    create: () => {
                        return {
                            url: "https://example.com"
                        }
                    }
                }
            }
        }
    })
})

describe("/api/stripe/manage", () => { 
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await dbConnect(uri);
        await User.create({
            ...defaultMockedUser,
            email: "nosub@user.com",
        })
        await User.create({
            ...defaultMockedUser,
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
            await manage(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail if mocked user does not exist", async () => {
        const { req, res } = createMocks({
            method: "GET"
        })
        await manage(req, res)
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

        await manage(req, res)
        expect(res._getStatusCode()).toBe(401)
    })

    it("Should show no subscription", async () => {
        let jweContent = {
            ...defaultJWEContent,
            email: "nosub@user.com"
        };

        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(jweContent)
            }
        })

        await manage(req, res)
        expect(res._getStatusCode()).toBe(200)
    })

    it("Should fail if no operation given", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            }
        })

        await manage(req, res)
        expect(res._getStatusCode()).toBe(400)
    })

    it("Should fail if bad operation given", async () => {
        const { req, res } = createMocks({
            method: "GET",
            cookies: {
                "next-auth.session-token": await encryptJWE(defaultJWEContent)
            },
            query: {
                op: "mock"
            }
        })

        await manage(req, res)
        expect(res._getStatusCode()).toBe(400)
    })
    

    it("Should redirect for standard operations", async () => {
        for (let op of ["uncancel", "payment_method_update", "subscription_cancel", "subscription_update"]) {
            const { req, res } = createMocks({
                method: "GET",
                cookies: {
                    "next-auth.session-token": await encryptJWE(defaultJWEContent)
                },
                query: {
                    op
                }
            })

            await manage(req, res)
            expect(res._getStatusCode()).toBe(302)
        }
    })
})