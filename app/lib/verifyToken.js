import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

const tokenNotVerified = () => {
    let response = false
    /* verify user token */
    const token = cookies().get('F_Token')

    if (!token) { // if token not set
        response = true
    }

    try {
        jwt.verify(token.value, process.env.JWT_SECRETE_KEY)
        response = false
    } catch(error) {
        response = true
    }

    return response
}

export default tokenNotVerified