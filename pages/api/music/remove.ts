import dbConnect from "@/lib/dbConnect";
import { r2 } from "@/lib/r2";
import MusicFile from "@/models/MusicFile";

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

    const { songId } = req.query;
    if (!songId)
      return res.status(400).json({ message: "Song ID is required" });

    try {
      // Find the song in the database
      const song = await MusicFile.findById(songId);
      if (!song) return res.status(404).json({ message: "Song not found" });

      // Delete the song from the S3 bucket
      await r2
        .deleteObject({
          Bucket: process.env.R2_BUCKET ?? "",
          Key: song.songKey,
        })
        .promise();

      // Delete the album art from the S3 bucket
      await r2
        .deleteObject({
          Bucket: process.env.R2_PUBLIC_BUCKET ?? "",
          Key: song.albumArtKey,
        })
        .promise();

      // Delete the song record from the database
      await MusicFile.deleteOne({ _id: songId });

      return res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
