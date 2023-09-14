import dbConnect from "@/lib/dbConnect";
import MusicFile from "@/models/MusicFile";
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        await dbConnect();
        
        // Get music -- no auth required
        const songs = await MusicFile.find();
        return res.json(songs);
    }

    res.status(405);
}