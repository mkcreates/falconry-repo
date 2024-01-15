import { NextResponse } from "next/server"
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import Post from "@/database/models/postModel"
import Feed from "@/database/models/feedModel"

export async function POST(request) {
    // get request payload
    const { username } = await request.json()

    await connectDB()

    try {
        const user = await User.findOne({ username: username, 'preference.profileIsPublic': true })
            .select('_id username preference createdAt picture')

        if (!user) {
            return NextResponse.json(null, {status: 200})
        }

        const feeds = await Feed.find({ user: user._id, isPublic: true }).sort({ updatedAt: -1 }).lean()
            .select('_id -category -createdAt -updatedAt -user -lastBuildDate -__v')

        const feedsIDs = feeds.map(feed => feed._id)

        const posts = await Post.find({ user: user._id, feed: { $in: feedsIDs } })
            .select('_id title creator slug link pubDate media feed hide bookmarked read user updatedAt')
            .limit(15)
            .populate('feed')
            .sort({ createdAt: -1 })

        return NextResponse.json({ user, feeds, posts }, {status: 200})
    }
    catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}