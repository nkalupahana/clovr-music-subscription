import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        // Get music -- no auth required
        return res.status(200);
    }

    return res.status(405);

}