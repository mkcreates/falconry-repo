"use client"

// modules
import { useState } from 'react'
import Authenticated from "@/lib/authenticated"
import emailjs from '@emailjs/browser'
import Link from 'next/link'

// components
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

// icons
import { SpinnerGap } from "@phosphor-icons/react"

const LoginPage = () => {
    // middleware : must not be signed in to be here
    Authenticated(false, '/') // else redirect to home(/)

    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    const submitForm = async e => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/login/checkEmail', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: email })
        })

        setLoading(false)

        // clear errors
        setErrors(null)
        setSuccess(null)

        // get response data
        const response = await res.json()
        
        if (response.error) {
            // encountered error
            setErrors(response.error)
        } else {
            // succeeded!
            e.target.querySelector('input').value = ''
            setEmail('')

            // get emailjs credentials and send password to email
            const service = process.env.NEXT_PUBLIC_EMAILJS_SERVICE
            const template = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_KEY

            emailjs.send(service, template, {
                to_email: email,
                to_name: response.username,
                password: response.password
            }, publicKey)
            .then((res) => {
                setSuccess('New password has been sent to your email.')
            }, (error) => {
                setErrors('There was a problem sending email.')
            })
        }
    }

    return (
        <form onSubmit={submitForm}>
            <div className="title">
                <h1>Forgot Password</h1>
            </div>
            <p>Type in your registered email. We will send you another password.</p>

            {errors && (
                <div className="errorHead">{errors}</div>
            )}

            {success && (
                <div className="successHead">
                    {success} <Link href='/login' className='underline underline-offset-2'>Back to login</Link>
                </div>
            )}

            <Input
                className='mb-4'
                type='email'
                noLabel
                placeholder="sparrow@ocean.co"
                onChange={(e) => setEmail(e.target.value)}
            />

            <Button
                className='w-full dark:bg-darkBg1'
                type='button2'
                submit
                disabled={loading ? true : false}
            >
                Send
                {loading && <SpinnerGap size={15} className="loader" />}
            </Button>
        </form>
    )
}
 
export default LoginPage