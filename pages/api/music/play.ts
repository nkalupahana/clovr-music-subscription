import MusicFile from "@/models/MusicFile";
import { S3 } from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next"

const r2 = new S3({
    endpoint: `https://566ccbfc5b9008e65ab6490435cda9a3.r2.cloudflarestorage.com`,
    accessKeyId: process.env.R2_KEY_ID,
    secretAccessKey: process.env.R2_KEY_SECRET,
    signatureVersion: "v4",
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const file = await MusicFile.findById(req.query.id);
        if (!file) return res.status(404).send(404);

        const url = await r2.getSignedUrlPromise("getObject", { Bucket: "clovr-test-music", Key: file.location });
        return res.redirect(url);
    }

    return res.status(405).send(405);
}