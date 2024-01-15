import { NextResponse } from "next/server"
import { decrypt } from "@/lib/encrypt"
import { cookies } from 'next/headers'
import tokenNotVerified from "@/lib/verifyToken"
import connectDB, { closeDB } from "@/database/db"
import Post from "@/database/models/postModel"

export async function POST(request) {
    // get request payload
    const { slug } = await request.json()

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    await connectDB()
    
    try {
        // set post to read
        await Post.findOneAndUpdate({ user: userId, slug: slug }, { read: true })

        // if update is success
        return NextResponse.json({success: 'ok'}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}
