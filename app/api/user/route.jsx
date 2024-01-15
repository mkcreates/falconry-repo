import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { decrypt } from "@/lib/encrypt"
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import { cookies } from 'next/headers'

export async function GET(request) {
    const cookie = cookies() // get cookies

    await connectDB()
    
    if (cookie.has('F_Token')) { // token set, user signed in
        const FToken = cookie.get('F_Token').value
        const FSession = cookie.get('F_Session').value
        const userId = decrypt(FSession, process.env.JWT_SECRETE_KEY)

        const decoded = jwt.verify(FToken, process.env.JWT_SECRETE_KEY)

        if (decoded) {
            const user = await User.findOne({_id: userId }).select('username email preference verified dataCollection picture')

            return NextResponse.json({data: user, signedIn: user !== null}, {status: 200})
        }  
    } else { // token not set, user not signed in
        return NextResponse.json({signedIn: false}, {status: 200})
    }

    closeDB()
}