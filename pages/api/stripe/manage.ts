import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import User from "@/models/User";
import stripe from "@/lib/stripe";
import Stripe from "stripe";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        await dbConnect();

        const session = await getServerSession(req, res, authOptions)
        if (!session || !session.user) return res.status(401).send(401);
        const user = await User.findOne({ email: session.user.email });
        if (!user) return res.status(401).send(401);
        if (!user.subscription) return res.send("You are not subscribed!");

        const subscription = await stripe.subscriptions.retrieve(user.subscription);

        const { op } = req.query;
        if (typeof op !== "string" || !op) return res.status(400).send("Invalid operation");

        if (["payment_method_update", "subscription_cancel", "subscription_update"].includes(op)) {
            let data: any = {
                customer: subscription.customer as string,
                return_url: process.env.NEXTAUTH_URL + "/subscriptions?update=true",
                flow_data: {
                    type: op as any, // typescript :/
                    after_completion: {
                        type: "redirect",
                        redirect: {
                            return_url: process.env.NEXTAUTH_URL + "/subscriptions?update=true"
                        }
                    }
                }
            };

            if (op === "subscription_update") {
                data.flow_data.subscription_update = {
                    subscription: subscription.id,
                }
            } else if (op === "subscription_cancel") {
                data.flow_data.subscription_cancel = {
                    subscription: subscription.id,
                }
            }

            const session = await stripe.billingPortal.sessions.create(data);
            return res.redirect(session.url);
        } else {
            return res.status(400).send("Invalid operation");
        }
    }

    return res.status(405).send(405);
}