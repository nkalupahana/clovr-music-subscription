import dbConnect from "@/lib/dbConnect";
import { r2 } from "@/lib/r2";
import MusicFile, { MusicFile as MusicFileType } from "@/models/MusicFile";
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

        const downloads = await Download.find({ user: user._id }).populate("file", { name: true, artist: true, albumArtKey: true });
        return res.status(200).json(downloads);
    }

    return res.status(405).send(405);
}