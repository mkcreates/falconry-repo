import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import { cookies } from 'next/headers'
import Post from "@/database/models/postModel"
import Feed from "@/database/models/feedModel"

export async function POST(request) {
    // get request payload
    const { sort, feedId, categoryId, bookmarked, ishidden, search, hideRead, timeFilter, skip } = await request.json()

    let userId
    
    if (cookies().has('F_Token')) { // token set, user signed in
        // get user ID from session
        const FSession = cookies().get('F_Session').value
        userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)
    } else {
        // fetch category from predefined user
       userId = process.env.NEXT_PUBLIC_USER
    }

    await connectDB()

    // init object for querying db
    let queryObj = {
        user: userId,
        hide: { $ne: true }
    }

    // add to query object if payload is set
    if (feedId) queryObj.feed = feedId
    if (bookmarked) queryObj.bookmarked = bookmarked
    if (ishidden) queryObj.hide = ishidden
    if (search) queryObj.$text = { $search: search }
    if (hideRead !== undefined && hideRead === true) queryObj.read = { $ne: true }
    if (timeFilter !== null) queryObj.createdAt = { $gte: timeFilter }

    // asign sorting order
    const sorting = sort === 'desc' ? -1 : 1

    // select fields to return from db
    const fields = '_id title creator slug link pubDate media feed hide bookmarked read user updatedAt'

    try {
        let fetchPosts = []

        if (categoryId) { // if category param is set
            /* fetch posts based on if their feeds reference to this category */

            // find feeds
            const fetchFeeds = await Feed.find({ category: categoryId }).lean()

            // populate IDs of feeds in array
            const feedIDs = fetchFeeds.map(feed => feed._id)
            
            // query array of IDs in posts to get post that match any feeds of the category
            fetchPosts = await Post.find({ feed: { $in: feedIDs }}).populate('feed').skip(skip).sort({ createdAt: sorting })
            .select(fields).limit(12)
        } 
        else {
            // for all other fetches not based on category id
            fetchPosts = await Post.find(queryObj).populate('feed').skip(skip).sort({ createdAt: sorting })
            .select(fields).limit(12)
        }

        // if fetch is success
        return NextResponse.json(fetchPosts, {status: 200})
    } catch (error) {
        return NextResponse.json({error}, {status: 200})
    }

    closeDB()
}
