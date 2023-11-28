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
        
        return res.json(songs);
    }

    res.status(405);
}