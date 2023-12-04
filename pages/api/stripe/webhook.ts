import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import dbConnect from "@/lib/dbConnect";
import stripe from "@/lib/stripe";
import User from "@/models/User";

export const config = {
    api: {
      bodyParser: false
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        await dbConnect();
        let event = undefined;
        const buf = await buffer(req);

        const signature = req.headers['stripe-signature'] as string;
        try {
            event = stripe.webhooks.constructEvent(
                buf,
                signature,
                process.env.STRIPE_ENDPOINT_SECRET ?? ""
            );
        } catch (err: any) {
            console.log("Webhook signature verification failed.", err.message);
            return res.status(400).send(400);
        }

        if (event.type === "checkout.session.completed") {
            const data = event.data.object as Stripe.Checkout.Session;
            // decode base64 data
            const userData = JSON.parse(Buffer.from(data.client_reference_id!, "base64").toString("ascii"));
            const user = await User.findById(userData.id);
            if (user) {
                user.subscription = data.subscription;
                user.channels = userData.channels;
                await user.save();
            } else {
                console.log(`User ${data.client_reference_id} not found.`);
            }
        } else if (event.type === "customer.subscription.deleted") {
            const data = event.data.object as Stripe.Subscription;
            await User.findOneAndUpdate(
                { subscription: data.id },
                { $unset: { subscription: undefined, channels: undefined } }
            );
        }

        return res.status(200).send(200);
    }

    return res.status(405).send(405);
}