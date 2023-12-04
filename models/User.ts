import mongoose from "mongoose"

export interface User extends mongoose.Document {
    name: string
    email: string
    isAdmin: boolean
    subscription: string
    channels: string[] | undefined
}

const UserSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: [true, "Please provide a name for this user."],
    },
    email: {
        type: String,
        required: [true, "Please provide an email for this user."],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    subscription: {
        type: String
    },
    channels: {
        type: [String]
    }
})

export default mongoose.models.User || mongoose.model<User>("User", UserSchema)