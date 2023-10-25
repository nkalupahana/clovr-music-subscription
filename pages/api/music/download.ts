import dbConnect from "@/lib/dbConnect";
import { r2 } from "@/lib/r2";
import MusicFile from "@/models/MusicFile";
import type { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import User from "@/models/User";
import Download from "@/models/Download";

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

        let file = undefined;
        try {
            file = await MusicFile.findById(req.query.id);
        } catch {}
        if (!file) return res.status(404).send("Music file not found");

        await Download.create({
            user: user._id,
            file: file._id,
        });

        const url = await r2.getSignedUrlPromise("getObject", { Bucket: process.env.R2_BUCKET, Key: file.songKey });
        return res.redirect(url);
    }

    return res.status(405).send(405);
}