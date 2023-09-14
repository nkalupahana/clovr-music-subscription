import mongoose from "mongoose"

export interface MusicFile extends mongoose.Document {
    name: string
    tempo: number,
    key: string,
    uploadTime: Date,
}

const MusicFileSchema = new mongoose.Schema<MusicFile>({
    name: {
        type: String,
        required: [true, "Please provide a name for this song."],
    },
    tempo: {
        type: Number,
        required: [true, "Please provide an tempo for this song."],
    },
    key: {
        type: String,
        required: [true, "Please provide an R2 key for this song."],
    },
    uploadTime: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.MusicFile || mongoose.model<MusicFile>("MusicFile", MusicFileSchema)