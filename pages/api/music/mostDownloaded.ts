import dbConnect from "@/lib/dbConnect";
import Download from "@/models/Download";
import MusicFile from "@/models/MusicFile";
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        await dbConnect();

        // count is an optional query parameter, but validate if specified
        if (req.query.count && (typeof req.query.count !== "string" || isNaN(parseInt(req.query.count)) || parseInt(req.query.count) <= 0)) {
            return res.status(400).send(400);
        }
        
        // Get music -- no auth required
        let songs = await MusicFile.find();

        // Get counts
        const aggregation = await Download.aggregate([
            {
                "$group": {
                    "_id": "$file",
                    "count": {"$sum": 1}
                }
            }
        ]);
        
        // Create map of counts
        let countMap: any = {};
        for (let item of aggregation) {
            countMap[item._id] = item.count;
        }

        // Insert counts into song data
        for (let i = 0; i < songs.length; i++) {
            songs[i] = songs[i].toObject();
            songs[i].downloadCount = countMap[songs[i]._id] || 0;
        }

        let count = songs.length;
        if (req.query.count) count = parseInt(req.query.count);

        songs.sort((a, b) => {
            return b.downloadCount - a.downloadCount;
        });
        
        return res.json(songs.slice(0, count));
    }

    res.status(405);
}