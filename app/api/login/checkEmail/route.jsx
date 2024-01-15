import { NextResponse } from "next/server"
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import bcrypt from "bcrypt"

export async function POST(request) {
    // get request payload
    const { email } = await request.json()

    await connectDB()

    try {
        const emailExist = await User.findOne({email: email})

        if (emailExist) {
            // generate new password
            const password = Math.floor(100000 + Math.random() * 900000)
            const hashPassword = await bcrypt.hash(password.toString(), 10) // encrypt Password

            const user = await User.findOneAndUpdate({ email: email }, { hash: hashPassword }, {new: true})

            return NextResponse.json({password: password, username: user.username}, {status: 200})
        } else {
            return NextResponse.json({error: 'This email does not exist on our server.'}, {status: 200})
        } 
    }
    catch(err) {
        // if any error encountered
        return NextResponse.json({error: 'There was an unexpected error.'}, {status: 200})
    }

    closeDB()
}