import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user)
      return res.status(401).json({ message: "Unauthorized" });
    if (!session.user.isAdmin)
      return res.status(403).json({ message: "Forbidden" });

    try {
      const { id } = req.query;
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
