import {
    createMocks,
} from 'node-mocks-http'
import mongoose from "mongoose"
import { MongoMemoryServer } from 'mongodb-memory-server'

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { defaultMockedUser } from '@/testutils/auth';
import webhook from '@/pages/api/stripe/webhook';

let mongod: MongoMemoryServer | undefined = undefined;

// mock micro

jest.mock("micro", () => ({
    buffer: (req: any) => {
        return req.body;
    }
}))

jest.mock('stripe', () => {
    return jest.fn(() => {
        return {
            webhooks: {
                constructEvent: (event: any, sig: string, secret: string) => {
                    if (!sig) throw new Error("No signature")
                    const eventType = event.eventType;
                    if (eventType === "checkout.session.completed") {
                        return {
                            type: eventType,
                            data: {
                                object: {
                                    client_reference_id: "0000cedfa1397c896bbbb82f",
                                    subscription: "mock"
                                }
                            }
                        }
                    } else if (eventType === "customer.subscription.deleted") {
                        return {
                            type: eventType,
                            data: {
                                object: {
                                    id: "mock"
                                }
                            }
                        }
                    } else {
                        return {
                            type: eventType
                        }
                    }
                }
            }
        }
    })
})

describe("/api/stripe/webhook", () => { 
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
            await webhook(req, res)
            expect(res._getStatusCode()).toBe(405)
        }
    })

    it("Should fail without header", async () => {
        const { req, res } = createMocks({
            method: "POST",
        })
        await webhook(req, res)
        expect(res._getStatusCode()).toBe(400)
    })

    it("Should succeed for non-handled event", async () => {
        const { req, res } = createMocks({
            method: "POST",
            headers: {
                "stripe-signature": "mock"
            },
            body: {
                eventType: "fake"
            }
        })
        await webhook(req, res)
        expect(res._getStatusCode()).toBe(200)
    });

    it("Should succeed for checkout.session.completed", async () => {
        const { req, res } = createMocks({
            method: "POST",
            headers: {
                "stripe-signature": "mock"
            },
            body: {
                eventType: "checkout.session.completed"
            }
        })
        await webhook(req, res)
        expect(res._getStatusCode()).toBe(200)
    });

    it("Should succeed for checkout.session.deleted", async () => {
        const { req, res } = createMocks({
            method: "POST",
            headers: {
                "stripe-signature": "mock"
            },
            body: {
                eventType: "customer.subscription.deleted"
            }
        })
        await webhook(req, res)
        expect(res._getStatusCode()).toBe(200)
    });
})