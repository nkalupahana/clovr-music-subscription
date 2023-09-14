import mongoose from "mongoose"

export interface User extends mongoose.Document {
    name: string
    email: string
}

const UserSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: [true, "Please provide a name for this user."],
    },
    email: {
        type: String,
        required: [true, "Please provide an email for this user."],
    }
})

export default mongoose.models.User || mongoose.model<User>("User", UserSchema)