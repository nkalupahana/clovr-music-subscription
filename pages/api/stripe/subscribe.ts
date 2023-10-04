import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import User from "@/models/User";

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
        if (user.subscription) return res.send("You are already subscribed!");

        return res.redirect(`https://buy.stripe.com/test_00g1639zc11k57adQQ?prefilled_email=${user.email}&client_reference_id=${user._id}`);
    }

    return res.status(405).send(405);
}