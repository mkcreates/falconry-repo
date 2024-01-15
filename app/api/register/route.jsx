import { NextResponse } from "next/server"
import { object, string, required, email, oneOf, ref, min } from 'yup'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { encrypt } from "@/lib/encrypt"
import setCookie from "@/lib/setCookie"
import connectDB, { closeDB } from "@/database/db"
import User from "@/database/models/userModel"
import filterData from "@/lib/filterUserData"

export async function POST(request) {
    // get request payload
    const body = await request.json()
    const { username, email, password } = body

    // set validation schema
    const userSchema = object({
        username: string().required().min(3).matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and, underscore(_)'),
        email: string().email().required(),
        password: string().required().min(8).matches(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/, 'Password must contain atleast one special character'),
        confirmPassword: string().required('Confirm Password is a required field').oneOf([ref('password')],  'Passwords must match.')
    })

    let responseData = {
        validationErrors: {},
        unexpectedError: null,
    }

    await connectDB()

    try {
        await userSchema.validate(body, { abortEarly: false })
        
        const hashPassword = await bcrypt.hash(password, 10) // encrypt password

        // add user here
        try {
            const userExistsUsername = await User.findOne({username})
            const userExistsEmail = await User.findOne({email})
            
            if (userExistsUsername) {
                // check if Username is already in use
                responseData.validationErrors.username = 'Username is already in use.'
                responseData.validationErrors.errorCount = 1
                return NextResponse.json(responseData, {status: 200})
            }

            if (userExistsEmail){
                // check if Email is already in use
                responseData.validationErrors.email = 'Email is already in use.'
                responseData.validationErrors.errorCount = 1
                return NextResponse.json(responseData, {status: 200})
            } 

            // proceed with creating user
            const user = new User({
                username: username,
                email: email,
                hash: hashPassword
            })

            try {
                const savedData = await user.save()

                responseData.userCreated = true

                // generate token
                const token = jwt.sign(
                    {username, email},
                    process.env.JWT_SECRETE_KEY,
                    { expiresIn: process.env.JWT_EXPIRATION
                })
                
                // encrypt user id
                const userIdEncrypt = encrypt(savedData._id.toString(), process.env.JWT_SECRETE_KEY)
                
                responseData.data = filterData(savedData)
                responseData.signedIn = true

                const response = NextResponse.json(responseData, {status: 201})
                setCookie(response, 'F_Token', token, true, false)
                setCookie(response, 'F_Session', userIdEncrypt, true, false)
                return response
            } catch (error) {
                responseData.userCreated = false
                responseData.unexpectedError = 'There was an unexpected error.'
                return NextResponse.json(responseData, {status: 200})
            }
            
        } catch (error) {
            responseData.unexpectedError = 'There was an unexpected error.'
            return NextResponse.json(responseData, {status: 200})
        }
    }

    catch (error) {
        const validationErrors = {}

        error.inner.forEach((err, index) => {
            validationErrors[err.path] = err.message.charAt(0).toUpperCase() + err.message.slice(1)
        })

        responseData.validationErrors = { ...validationErrors, errorCount: Object.keys(validationErrors).length }
        return NextResponse.json(responseData, {status: 200})
    }

    closeDB()
}