import dbConnect from "@/lib/dbConnect";
import { r2 } from "@/lib/r2";
import MusicFile from "@/models/MusicFile";
import formidable from "formidable";
import fs from "fs";

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

            if (!fields.tempo || fields.tempo.length !== 1 || !fields.tempo[0] || typeof fields.tempo[0] !== "string" || fields.tempo[0] !== String(Number(fields.tempo[0]))) {
                return res.redirect("/?message=Invalid song name!")
            }

            if (!files.file || files.file.length !== 1 || !files.file[0] || typeof files.file[0] !== "object" || files.file[0].mimetype !== "audio/mpeg") {
                return res.redirect("/?message=Invalid file!")
            }

            await r2.putObject({ 
                Bucket: process.env.R2_BUCKET ?? "", 
                Key: files.file[0].newFilename + ".mp3", 
                Body: fs.readFileSync(files.file[0].filepath),
                ContentDisposition: "attachment; filename=" + fields.songname[0] + ".mp3",
                ContentType: "audio/mpeg"
            }).promise();

            await MusicFile.create({
                name: fields.songname[0],
                tempo: Number(fields.tempo[0]),
                key: files.file[0].newFilename + ".mp3",
            });
        } catch (e) {
            console.log(e);
            return res.redirect("/?message=Make sure you filled out every field!");
        }

        return res.redirect("/?message=Song added successfully!");
    }

    return res.status(405).send(405);
}