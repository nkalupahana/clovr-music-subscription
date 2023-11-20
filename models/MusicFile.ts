import mongoose from "mongoose"

export interface MusicFile extends mongoose.Document {
    name: string
    artist: string
    tempo: number
    songKey: string
    albumArtKey: string
    releaseDate: string
    uploadTime: Date
    downloadCount: number
    favoriteCount: number
}

const MusicFileSchema = new mongoose.Schema<MusicFile>({
    name: {
        type: String,
        required: [true, "Please provide a name for this song."],
    },
    artist: {
        type: String,
        required: [true, "Please provide an artist for this song."],
    },
    tempo: {
        type: Number,
        required: [true, "Please provide an tempo for this song."],
    },
    songKey: {
        type: String,
        required: [true, "Please provide an R2 key for this song."],
    },
    albumArtKey: {
        type: String,
        required: [true, "Please provide an R2 key for the album art for this song."],
    },
    releaseDate: {
        type: String,
        required: [true, "Please provide a release date for this song."],
    },
    uploadTime: {
        type: Date,
        default: Date.now
    },
    downloadCount: {
        type: Number,
        default: 0
    },

})

export default mongoose.models.MusicFile || mongoose.model<MusicFile>("MusicFile", MusicFileSchema)