import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { encrypt } from "@/lib/encrypt"
import setCookie from "@/lib/setCookie"
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"

export async function POST(request) {
    // get request payload
    const { email, picture, given_name } = await request.json()

    await connectDB()

    try {

        // check if user exist by google email
        const userExist = await User.findOne({email: email})

        if (userExist) {
            // if email exist, simply login user
    
            // generate token
            const token = jwt.sign(
                {email},
                process.env.JWT_SECRETE_KEY,
                { expiresIn: process.env.JWT_EXPIRATION
            })
    
            // encrypt user id
            const userIdEncrypt = encrypt(userExist._id.toString(), process.env.JWT_SECRETE_KEY)
            
            const response = NextResponse.json(true, {status: 200})
            setCookie(response, 'F_Token', token, true, false)
            setCookie(response, 'F_Session', userIdEncrypt, true, true)
            return response
        }

        else {
            // email doesnt exist, create new user with google auth info

            // set google first name as username
            // and strip all chars except alphanumeric & underscore 
            let username = given_name.replace(/[^a-zA-Z0-9_]/g, '')

            // query username
            const usernameExist = await User.findOne({username})

            // if username exist in db already
            if (usernameExist) {
                // generate random no with length 3
                const randomNum = Math.floor(100 + Math.random() * 900)

                // and then attach the num to username e.g Asante170
                username = username+''+randomNum
            }

            // proceed with creating user
            const user = new User({
                username: username,
                email: email,
                picture: picture || null
            })

            const saveUser = await user.save()

            // generate token
            const token = jwt.sign(
                {username, email},
                process.env.JWT_SECRETE_KEY,
                { expiresIn: process.env.JWT_EXPIRATION
            })
            
            // encrypt user id
            const userIdEncrypt = encrypt(saveUser._id.toString(), process.env.JWT_SECRETE_KEY)

            const response = NextResponse.json(true, {status: 201})
            setCookie(response, 'F_Token', token, true, false)
            setCookie(response, 'F_Session', userIdEncrypt, true, false)
            return response
        }

    }

    catch (error) {
        return NextResponse.json(false, {status: 200})
    }

    closeDB()
}