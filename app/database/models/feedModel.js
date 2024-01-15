import mongoose from "mongoose"

let feedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    icon: { type: String, default: null },
    isPublic: { type: Boolean, default: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    website: { type: String, default: null },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastBuildDate: { type: Date, default: null }
},
{ timestamps: true })

// add a pre hook to the feed to remove associated articles when deleted
feedSchema.pre('remove', async (next) => {
    try {
        // remove all posts that reference this feed
        await mongoose.model('Post').deleteMany({ feed: this._id })
        next()
    } catch (error) {
        next(error)
    }
})

let Feed = mongoose.models['Feed'] || mongoose.model("Feed", feedSchema)

export default Feed