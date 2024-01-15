import { NextResponse } from "next/server"
import connectDB, { closeDB } from "@/database/db"
import Post from "@/database/models/postModel"

export async function POST(request) {
    // get request payload
    const { slug } = await request.json()

    await connectDB()

    try {
        const fetchPost = await Post.findOne({ slug: slug }).populate('feed')
        .select('_id title creator slug link pubDate description content media feed hide bookmarked user read updatedAt')

        // if fetch is success
        return NextResponse.json(fetchPost, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
    }

    closeDB()
}
