import { NextResponse } from "next/server"
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import tokenNotVerified from "@/lib/verifyToken"
import { decrypt } from "@/lib/encrypt"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import Category from "@/database/models/categoryModel"
import Feed from "@/database/models/feedModel"

export async function DELETE(request) {
    // get request payload
    const body = await request.json()
    const { password } = body

    await connectDB()

    /* verify user token */
    if (tokenNotVerified()) {
        return NextResponse.json({unexpected: 'Unauthorized'}, {status: 401})
    }

    // get user ID from session
    const FSession = cookies().get('F_Session').value
    const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

    /* query user by username in db */
    const user = await User.findOne({_id: userId})

    if (!user) {
        return NextResponse.json({unexpected: 'An unexpected error occured.'}, {status: 200})
    }

    // ensure password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.hash)

    if (isPasswordMatch) {
        const deleted = await User.findByIdAndDelete(userId)

        if (deleted) {
            // delete all categories and feeds of user
            await Category.deleteMany({ user: userId })
            await Feed.deleteMany({ user: userId })
            
            // remove authentication cookies
            cookies().delete('F_Token')
            cookies().delete('F_Session')
            
            return NextResponse.json({success: 'User deleted.'}, {status: 201})
        } else {
            return NextResponse.json({error: 'Something went wrong.'}, {status: 200})
        }
    } else {
        return NextResponse.json({error:  'Incorrect Password'}, {status: 200})
    }

    closeDB()
}