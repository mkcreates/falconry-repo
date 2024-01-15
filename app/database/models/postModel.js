import mongoose from "mongoose"

let postSchema = new mongoose.Schema({
    title: { type: String, default: null },
    creator: { type: String, default: null },
    slug: { type: String, lowercase: true },
    link: { type: String, default: null },
    pubDate: { type: Date, default: null },
    description: { type: String, default: null },
    content: { type: String, default: null },
    media: { type: String, default: null },
    hide: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    bookmarked: { type: Boolean, default: false },
    feed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{ timestamps: true })

postSchema.index({ title: 'text', description: 'text', creator: 'text', content: 'text'})

let Post = mongoose.models['Post'] || mongoose.model("Post", postSchema)

export default Post