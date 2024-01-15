import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import { cookies } from 'next/headers'
import tokenNotVerified from "@/lib/verifyToken"
import Feed from "@/database/models/feedModel"
import Category from "@/database/models/categoryModel"

export async function GET(request) {
    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    try {
        // populate categories and corresponding feeds here
        let data = []
        
        // fetch public category of feeds
        const fetchCats = await Category.find({ user: process.env.NEXT_PUBLIC_USER })
            .sort({ updatedAt: -1 }).select('_id name')

        for (const cat of fetchCats) {
            const fetchFeeds = await Feed.find({
                user: process.env.NEXT_PUBLIC_USER,
                category: cat._id
            })
            .lean()
            .select('-_id -category -createdAt -updatedAt -user -lastBuildDate -__v')

            const modifiedFeeds = fetchFeeds.map(feed => ({
                ...feed,
                user: userId,
                lastBuildDate: new Date().toISOString()
            }))

            data.push({
                name: cat.name,
                feeds: modifiedFeeds
            })
        }
        

        // if fetch is success
        return NextResponse.json(data, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong'}, {status: 200})
    }

    closeDB()
}


export async function POST(request) {
    const { feed, catId } = await request.json()

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    await connectDB()

    // check if user already follows feed
    const findFeed = await Feed.findOne({
        user: feed.user,
        link: feed.link
    })

    if (findFeed) {
        // if feed exist return error
        return NextResponse.json({error: 'Feed already exists.'}, {status: 200})
    }

    try {
        // add feed
        const createFeed = new Feed({
            ...feed,
            category: catId
        })

        const saveFeed = await createFeed.save()

        // if save is success
        return NextResponse.json({ saveFeed }, {status: 201})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}
