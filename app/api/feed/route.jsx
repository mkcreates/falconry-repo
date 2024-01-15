import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import connectDB from "@/database/db"
import Feed from "@/database/models/feedModel"
import { cookies } from 'next/headers'
import tokenNotVerified from "@/lib/verifyToken"
import Post from "@/database/models/postModel"

export async function GET(request) {
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

    try {
        const fetchFeeds = await Feed.find({user: userId}).sort({ updatedAt: -1 }).select('_id name link icon category isPublic updatedAt')

        // if save is success
        return NextResponse.json(fetchFeeds, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }
}


export async function PATCH(request) {
    // get request payload
    const { feedId, type, value } = await request.json()


    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    try {
        const updatedFeed = await Feed.findOneAndUpdate(
            { user: userId, _id: feedId },
            {
                $set: { [type]: value },
                $currentDate: { updatedAt: true }
            },
            { new: true }
        ).select('_id name link icon category isPublic updatedAt')

        // if update is success
        return NextResponse.json({ feed: updatedFeed }, {status: 201})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }
}


export async function DELETE(request) {
    // get request payload
    const { feedId } = await request.json()
    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    try {
        const deletedFeed = await Feed.findOneAndDelete({ user: userId, _id: feedId }).select('_id name link icon category isPublic updatedAt')

        // if feed delete is success
        await Post.deleteMany({ user: userId, feed: feedId }) // delete posts of feed

        return NextResponse.json(deletedFeed, {status: 201})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }  
}