import mongoose from 'mongoose'

export interface User extends mongoose.Document {
  name: string
  email: string
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new mongoose.Schema<User>({
  name: {
    /* The name of this pet */

    type: String,
    required: [true, 'Please provide a name for this user.'],
  },
  email: {
    /* The owner of this pet */

    type: String,
    required: [true, 'Please provide an email for this user.'],
  }
})

export default mongoose.models.User || mongoose.model<User>('User', UserSchema)