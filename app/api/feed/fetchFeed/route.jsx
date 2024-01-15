import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import Post from "@/database/models/postModel"
import { cookies } from 'next/headers'
import tokenNotVerified from "@/lib/verifyToken"
import constructPost from "@/lib/constructPost"
const rssParser = require('rss-parser')

export async function POST(request) {
    // get request payload
    const { feedLink, feedId } = await request.json()

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    let parser = new rssParser()

    try {
        const fetchFeeds = await parser.parseURL(feedLink)

        // fetching only latest 5 posts
        const posts = fetchFeeds.items.slice(0, 5)

        try {
            // iterate through posts and perform db insertion for each post
            for (const post of posts) {
                // check if post already exists
                const findPost = await Post.findOne({user: userId, link: post.link})

                if (!findPost) { // if it doesnt exist, proceed
                    const createPost = constructPost(post, feedId, userId)

                    await createPost.save()
                }
            }
        } catch (er) {
            return NextResponse.json({error: 'something went wrong.'}, {status: 200})
        }

        return NextResponse.json({success: 'Added articles successfully!'}, {status: 201})
    } catch (error) {
        return NextResponse.json({error: 'Couldn\'t fetch articles from feed.'}, {status: 200})
    }

    closeDB()
}