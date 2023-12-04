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
        if (!req.query.channels || typeof req.query.channels !== "string") return res.status(400).send("No channels specified");

        try {
            const data = Buffer.from(req.query.channels, "base64").toString("ascii");
            const channels = JSON.parse(data);
            if (!Array.isArray(channels)) return res.status(400).send("Invalid channel data");
            if (![1, 3, 5].includes(channels.length)) return res.status(400).send("Invalid channel data");
            for (let item of channels) {
                if (typeof item !== "string" || !item.startsWith("https://www.youtube.com/@")) return res.status(400).send("Invalid channels");
            }

            const clientData = {
                id: user._id,
                channels
            }
            const encodedData = Buffer.from(JSON.stringify(clientData)).toString("base64");

            return res.redirect(`https://buy.stripe.com/test_00g1639zc11k57adQQ?prefilled_email=${user.email}&client_reference_id=${encodedData}`);
        } catch {
            return res.status(400).send("Invalid channel data");
        }
    }

    return res.status(405).send(405);
}