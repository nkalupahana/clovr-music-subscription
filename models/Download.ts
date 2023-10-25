import { ObjectId } from "mongodb"
import mongoose from "mongoose"
import MusicFile from "./MusicFile"
import User from "./User"

export interface Download extends mongoose.Document {
    timestamp: Date,
    user: ObjectId,
    file: ObjectId,
}

const DownloadSchema = new mongoose.Schema<Download>({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: ObjectId,
        ref: User,
        required: [true, "Please provide the id of the User who downloaded this song."],
    },
    file: {
        type: ObjectId,
        required: [true, "Please provide the id of the MusicFile being downloaded."],
        ref: MusicFile
    },
})

export default mongoose.models.Download || mongoose.model<Download>("Download", DownloadSchema)