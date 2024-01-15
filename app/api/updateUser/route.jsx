import { NextResponse } from "next/server"
import { object, string, required, min } from 'yup'
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import tokenNotVerified from "@/lib/verifyToken"

export async function POST(request) {
    // get request payload
    const body = await request.json()
    const { username, email } = body.data

    // set validation schema
    const userSchema = object({
        username: string().required().min(3).matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and, underscore(_)'),
    })

    await connectDB()

    try {
        await userSchema.validate({username: username}, { abortEarly: false })

        /* verify user token */
        if (tokenNotVerified()) {
            return NextResponse.json({errors: 'Unauthorized'}, {status: 401})
        }

        /* query user by username in db */
        const usernameExist = await User.findOne({username})

        // if user exists, and imputed username not thesame with that of db
        if (usernameExist && usernameExist.username !== body.prevUsername) {
            return NextResponse.json({errors: 'Username is already in use.'}, {status: 200})
        }

        try {
            const updateUser = await User.findOneAndUpdate(
                { email: email },
                body.data,
                { new: true }
            ).select('username email preference verified dataCollection picture')

            return NextResponse.json(updateUser, {status: 201})
        } catch (error) {
            return NextResponse.json({errors: 'Unable to save changes.'}, {status: 200})
        }

    } catch (error) {
        return NextResponse.json({errors: error.inner && error.inner[0].message}, {status: 200})
    }

    closeDB()
}