import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user)
      return res.status(401).json({ message: "Unauthorized" });
    if (!session.user.isAdmin)
      return res.status(403).json({ message: "Forbidden" });

    try {
      const users = await User.find();
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
