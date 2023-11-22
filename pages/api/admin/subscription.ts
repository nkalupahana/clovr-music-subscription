import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import stripe from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await dbConnect();
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) return res.status(401).send(401);
    if (!session.user.isAdmin)
      return res.status(403).json({ message: "Forbidden" });
    try {
      const { subscriptionId } = req.query;
      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId as string
      );
      return res.json({
        status: subscription.status,
        quantity: subscription.items.data[0].quantity,
        cancelAt: subscription.cancel_at,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
