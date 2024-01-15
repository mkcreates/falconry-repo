import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import { cookies } from 'next/headers'
import Feed from "@/database/models/feedModel"
const rssParser = require('rss-parser')
import Post from "@/database/models/postModel"
import constructPost from "@/lib/constructPost"
import User from "@/database/models/userModel"


export async function GET(request) {

    await connectDB()

    let parser = new rssParser()

    try {
        const users = await User.find({})

        for (const user of users) {
            const userId = user._id
            const feeds = await Feed.find({user: userId}).sort({ lastBuildDate: -1 }).select('_id link lastBuildDate')

            for (const feed of feeds) {
                const fetchFeeds = await parser.parseURL(feed.link)

                // fetching latest posts
                const posts = fetchFeeds.items.slice(0, process.env.NO_OF_POSTS)

                // iterate through posts and perform db insertion for each post
                for (const post of posts) {
                    // check if post already exists
                    const findPost = await Post.findOne({user: userId, link: post.link})

                    if (!findPost) { // if it doesnt exist, proceed
                        const createPost = constructPost(post, feed._id, userId)

                        await createPost.save()
                    }
                }
            }
        }

        // if save is success
        return NextResponse.json({success: 'New Posts Added.'}, {status: 201})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}
