import dbConnect from "@/lib/dbConnect";
import MusicFile from "@/models/MusicFile";
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import User from "@/models/User";
import Favorite from "@/models/Favorite";

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

        if (!req.query.id || typeof req.query.id !== "string") return res.status(400).send("Invalid ID");

        try {
            const file = await MusicFile.findById(req.query.id);
            if (!file) return res.status(404).send("Music file not found");

            if (req.query.set === "true") {
                await Favorite.create({
                    user: user._id,
                    file: file._id,
                });
            } else if (req.query.set === "false") {
                await Favorite.deleteOne({
                    user: user._id,
                    file: file._id,
                });
            } else {
                return res.status(400).send("Invalid set value");
            }
        } catch (e) {
            return res.status(400).send("Invalid, rejected.");
        }

        return res.status(200).send(200);
    }

    return res.status(405).send(405);
}