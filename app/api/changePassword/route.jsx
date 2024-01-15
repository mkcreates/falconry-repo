import { NextResponse } from "next/server"
import { object, string, required, oneOf, ref, min } from 'yup'
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import tokenNotVerified from "@/lib/verifyToken"
import { decrypt } from "@/lib/encrypt"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"

export async function POST(request) {
    // get request payload
    const body = await request.json()
    const { currentPassword, password } = body

    // set validation schema
    const userSchema = object({
        currentPassword: string().required('Current Password is a required field'),
        password: string().required().min(8).matches(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/, 'Password must contain atleast one special character'),
        confirmPassword: string().required('Confirm Password is a required field').oneOf([ref('password')],  'Passwords must match.')
    })

    await connectDB()

    try {
        await userSchema.validate(body, { abortEarly: false })

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
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.hash)

        if (isPasswordMatch) {
            const hashPassword = await bcrypt.hash(password, 10) // encrypt password

            const updateUser = await User.findOneAndUpdate(
                { _id: userId }, { hash: hashPassword }
            )

            if (updateUser) {
                return NextResponse.json({success: 'Password updated.'}, {status: 201})
            } else {
                return NextResponse.json({unexpected: 'An unexpected error occured.'}, {status: 200})
            }
        } else {
            return NextResponse.json({error: {currentPassword: 'Incorrect Password'}}, {status: 200})
        }
    }
    catch (error) {
        const errors = {
            errorCount: 0
        }

        error.inner.forEach((err, index) => {
            errors[err.path] = err.message.charAt(0).toUpperCase() + err.message.slice(1)
            errors.errorCount = index + 1
        })

        return NextResponse.json({error: errors}, {status: 200})
    }

    closeDB()
}