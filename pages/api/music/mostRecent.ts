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

        // count is an optional query parameter, but validate if specified
        if (req.query.count && (typeof req.query.count !== "string" || isNaN(parseInt(req.query.count)) || parseInt(req.query.count) <= 0)) {
            return res.status(400).send(400);
        }
        
        // Get songs with limit and sort
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

        const aggregation = await MusicFile.aggregate(aggOptions);
        
        return res.json(aggregation);
    }

    res.status(405);
}