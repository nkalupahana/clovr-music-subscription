import mongoose from "mongoose"

export interface MusicFile extends mongoose.Document {
    name: string
    tempo: number,
    location: string
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
    location: {
        type: String,
        required: [true, "Please provide an R2 location for this song."],
    }
})

export default mongoose.models.MusicFile || mongoose.model<MusicFile>("MusicFile", MusicFileSchema)