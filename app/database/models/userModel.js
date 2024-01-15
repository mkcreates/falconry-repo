import mongoose from "mongoose"

let userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    hash: { type: String },
    picture: { type: String, default: null },
    preference: {
        profileIsPublic: { type: Boolean, default: false },
        receiveEmail: { type: Boolean, default: false },
        hideAfterRead: { type: Boolean, default: false },
    },
    verified: { type: Boolean, default: false },
    dataCollection: { type: Boolean, default: false }
},
{ timestamps: true })

// add a pre hook to the user to remove associated collections when deleted
userSchema.pre('remove', async (next) => {
    try {
        // remove all posts that reference this user
        await mongoose.model('Post').deleteMany({ user: this._id })

        // remove all feeds that reference this user
        await mongoose.model('Feed').deleteMany({ user: this._id })

        // remove all feed categories that reference this user
        await mongoose.model('Category').deleteMany({ user: this._id })
        next()
    } catch (error) {
        next(error)
    }
})

let User = mongoose.models['User'] || mongoose.model("User", userSchema)

export default User