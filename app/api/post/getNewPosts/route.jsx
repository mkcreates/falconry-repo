import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import { cookies } from 'next/headers'
import Feed from "@/database/models/feedModel"
const rssParser = require('rss-parser')
import Post from "@/database/models/postModel"
import constructPost from "@/lib/constructPost"
import tokenNotVerified from "@/lib/verifyToken"


export async function GET(request) {

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json(false, {status: 401})
    }
    
    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    try {
        const feeds = await Feed.find({user: userId}).sort({ lastBuildDate: -1 }).select('_id link lastBuildDate')
        
        let parser = new rssParser()

        let postAdded = false

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

                    postAdded = true
                }
            }
        }

        // if save is success
        if (postAdded) {
            return NextResponse.json(true, {status: 201})
        } else {
            return NextResponse.json(false, {status: 200})
        }
    } catch (error) {
        return NextResponse.json(false, {status: 200})
    }

    closeDB()
}
