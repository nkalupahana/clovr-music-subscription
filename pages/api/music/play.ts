import dbConnect from "@/lib/dbConnect";
import { r2 } from "@/lib/r2";
import MusicFile from "@/models/MusicFile";
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        await dbConnect();
        const file = await MusicFile.findById(req.query.id);
        if (!file) return res.status(404).send("Music file not found");

        const url = await r2.getSignedUrlPromise("getObject", { Bucket: process.env.R2_BUCKET, Key: file.songKey });
        return res.redirect(url);
    }

    return res.status(405).send(405);
}