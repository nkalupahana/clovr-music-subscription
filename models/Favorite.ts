import { ObjectId } from "mongodb"
import mongoose from "mongoose"
import MusicFile from "./MusicFile"
import User from "./User"

export interface Favorite extends mongoose.Document {
    timestamp: Date,
    user: ObjectId,
    file: ObjectId,
}

const FavoriteSchema = new mongoose.Schema<Favorite>({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: ObjectId,
        ref: User,
        required: [true, "Please provide the id of the User who favorited this song."],
    },
    file: {
        type: ObjectId,
        required: [true, "Please provide the id of the MusicFile being favorited."],
        ref: MusicFile
    },
})

FavoriteSchema.index({ user: 1, file: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model<Favorite>("Favorite", FavoriteSchema)