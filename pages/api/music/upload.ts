import dbConnect from "@/lib/dbConnect";
import { r2 } from "@/lib/r2";
import MusicFile from "@/models/MusicFile";
import formidable from "formidable";
import fs from "fs";
import Sharp from "sharp";
import { DateTime } from "luxon";

import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
    api: {
      bodyParser: false
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        await dbConnect();
        const form = formidable({ multiples: false });
        try {
            const [fields, files] = await form.parse(req);
            if (!fields.songname || fields.songname.length !== 1 || !fields.songname[0] || typeof fields.songname[0] !== "string") {
                return res.redirect("/?message=Invalid song name!")
            }
            
            if (!fields.duration || fields.duration.length !== 1 || !fields.duration[0] || typeof fields.duration[0] !== "string" || fields.duration[0] !== String(Number(fields.duration[0]))) {
                return res.redirect("/?message=Invalid tempo!")
            }

            if (!fields.artist || fields.artist.length !== 1 || !fields.artist[0] || typeof fields.artist[0] !== "string" || fields.artist[0].length > 1000) {
                return res.redirect("/?message=Invalid artist name!")
            }

            if (!fields.releaseDate || fields.releaseDate.length !== 1 || !fields.releaseDate[0] || typeof fields.releaseDate[0] !== "string") {
                return res.redirect("/?message=Invalid release date!")
            }

            const releaseDate = DateTime.fromISO(fields.releaseDate[0]);
            if (!releaseDate.isValid) {
                return res.redirect("/?message=Invalid release date!")
            }

            if (!files.musicFile || files.musicFile.length !== 1 || !files.musicFile[0] || typeof files.musicFile[0] !== "object" || files.musicFile[0].mimetype !== "audio/wav") {
                return res.redirect("/?message=Invalid music file!")
            }

            if (!files.albumArtFile || files.albumArtFile.length !== 1 || !files.albumArtFile[0] || typeof files.albumArtFile[0] !== "object" || !files.albumArtFile[0].mimetype?.startsWith("image/")) {
                return res.redirect("/?message=Invalid album art file!")
            }

            // Upload song
            await r2.putObject({ 
                Bucket: process.env.R2_BUCKET ?? "", 
                Key: files.musicFile[0].newFilename + ".wav", 
                Body: fs.readFileSync(files.musicFile[0].filepath),
                ContentDisposition: "attachment; filename=" + fields.songname[0] + ".wav",
                ContentType: "audio/wav"
            }).promise();

            // Standardize and upload album art
            const albumArt = await Sharp(files.albumArtFile[0].filepath).rotate().webp().toBuffer();
            await r2.putObject({
                Bucket: process.env.R2_BUCKET ?? "", 
                Key: files.albumArtFile[0].newFilename + ".webp",
                Body: albumArt
            }).promise();

            // Create file record
            await MusicFile.create({
                name: fields.songname[0],
                tempo: 120 + Math.round(Math.random() * 60), // todo: implement tempo detection
                duration: Number(fields.duration[0]), // todo: implement duration detection
                songKey: files.musicFile[0].newFilename + ".wav",
                albumArtKey: files.albumArtFile[0].newFilename + ".webp",
                artist: fields.artist[0],
                releaseDate: releaseDate.toISODate()
            });
        } catch (e) {
            console.log(e);
            return res.redirect("/?message=Make sure you filled out every field!");
        }

        return res.redirect("/?message=Song added successfully!");
    }

    return res.status(405).send(405);
}