import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function POST(request) {
    try {
        cookies().delete('F_Token')
        cookies().delete('F_Session')

        return NextResponse.json({signedOut: true}, {status: 200})
    } catch (error) {
        return NextResponse.json({signedOut: false}, {status: 200})
    }
}