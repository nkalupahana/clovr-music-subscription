import { ObjectId } from "mongodb"
import mongoose from "mongoose"

export interface Download extends mongoose.Document {
    timestamp: Date,
    userid: ObjectId,
    fileid: ObjectId,
}

const DownloadSchema = new mongoose.Schema<Download>({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    userid: {
        type: ObjectId,
        required: [true, "Please provide the id of the User who downloaded this song."],
    },
    fileid: {
        type: ObjectId,
        required: [true, "Please provide the id of the MusicFile being downloaded."],
    },
})

export default mongoose.models.Download || mongoose.model<Download>("Download", DownloadSchema)