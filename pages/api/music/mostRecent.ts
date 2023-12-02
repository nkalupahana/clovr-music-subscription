import dbConnect from "@/lib/dbConnect";
import Download from "@/models/Download";
import MusicFile from "@/models/MusicFile";
import { PipelineStage } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        await dbConnect();

        if (req.query.count && (typeof req.query.count !== "string" || isNaN(parseInt(req.query.count)) || parseInt(req.query.count) <= 0)) {
            return res.status(400).send(400);
        }
        
        let aggOptions: PipelineStage[] = [
            {
                "$sort": {
                    "releaseDate": -1,
                }
            }
        ];

        if (req.query.count) {
            aggOptions.push({
                "$limit": parseInt(req.query.count)
            });
        }

        // Get counts
        const aggregation = await MusicFile.aggregate(aggOptions);
        
        return res.json(aggregation);
    }

    res.status(405);
}