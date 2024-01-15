import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import { cookies } from 'next/headers'
import tokenNotVerified from "@/lib/verifyToken"
import Post from "@/database/models/postModel"

export async function POST(request) {
    // get request payload
    const { id, hide, bookmarked } = await request.json()

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()

    let updateObj = {}

    if (hide !== undefined) updateObj.hide = hide
    if (bookmarked !== undefined) updateObj.bookmarked = bookmarked

    try {
        await Post.findOneAndUpdate(
            {user: userId, _id: id},
            updateObj
        )

        // if save is success
        return NextResponse.json({success: 'ok'}, {status: 201})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}
