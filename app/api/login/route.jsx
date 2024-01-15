import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { encrypt } from "@/lib/encrypt"
import setCookie from "@/lib/setCookie"
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import filterData from "@/lib/filterUserData"

export async function POST(request) {
    // get request payload
    const { username, password, remember } = await request.json()

    let responseData = {
        error: null
    }

    await connectDB()

    try {
        const user = await User.findOne({
            $or: [
                {username: username},
                {email: username}
            ]
        })

        if (!user) {
            // user is not found
            responseData.error = 'Invalid credentials.'
            return NextResponse.json(responseData, {status: 200})
        }

        // cryptographically compare password
        const isPasswordMatch = await bcrypt.compare(password, user.hash)

        if (!isPasswordMatch) {
            // if password mis-match
            responseData.error = 'Invalid credentials.'
            return NextResponse.json(responseData, {status: 200})
        }

        // if user is found, generate token
        const token = jwt.sign(
            {username, password},
            process.env.JWT_SECRETE_KEY,
            { expiresIn: process.env.JWT_EXPIRATION
        })

        // encrypt user id
        const userIdEncrypt = encrypt(user._id.toString(), process.env.JWT_SECRETE_KEY)
        
        responseData.data = filterData(user)
        responseData.signedIn = true
        
        const response = NextResponse.json(responseData, {status: 200})
        setCookie(response, 'F_Token', token, remember, false)
        setCookie(response, 'F_Session', userIdEncrypt, remember, true)
        return response
    } 
    catch(err) {
        // if any error encountered
        responseData.error = 'There was a problem validating imputs.'
        return NextResponse.json(responseData, {status: 200})
    }

    closeDB()
}