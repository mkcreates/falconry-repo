"use client"

// modules
import Link from "next/link"
import { useState } from 'react'
import { useImmer } from "use-immer"
import { useRouter } from "next/navigation"
import { useGlobalContext } from '@/lib/globalContext'
import Authenticated from "@/lib/authenticated"

// components
import Button from "@/components/ui/Button"
import CheckBox from "@/components/ui/CheckBox"
import Input from "@/components/ui/Input"

// icons
import { Lock, User, SpinnerGap } from "@phosphor-icons/react"

const LoginPage = () => {
    // middleware : must not be signed in to be here
    Authenticated(false, '/') // else redirect to home(/)

    const [form, setForm] = useImmer({
        remember: true
    })
    const { setRefreshUser } = useGlobalContext()
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const updateForm = (e, input) => {
        setForm(data => {
            data[input] = e.target.value
        })
    }

    const handleRememberCheck = (e) => {
        setForm(data => {
            data.remember = !data.remember
        })
    }

    const submitForm = async e => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })

        setLoading(false)

        // clear errors
        setErrors(null)

        // get response data
        const response = await res.json()
        
        if (response.error) {
            // encountered error
            setErrors(response.error)
        } else {
            // succeeded!
            setLoading(true)
            setRefreshUser((prev) => !prev)
            router.push('/')
        }
    }

    return (
        <form onSubmit={submitForm}>
            <div className="title">
                <h1>Login</h1>
                <Link href='/signup' prefetch={true}>
                    <Button size='small' className='font-semibold' type='button2'>
                        Sign Up
                    </Button>
                </Link>
            </div>
            <p>Login to manage your feeds.</p>

            {errors && (
                <div className="errorHead">{errors}</div>
            )}

            <Input
                className='mb-4' 
                noLabel
                placeholder="Username or Email"
                icon={<User size={17} className='mr-2' />}
                iconPosition='left'
                onChange={(e) => updateForm(e, 'username')}
            />

            <Input
                className='mb-4'
                type='password'
                noLabel
                placeholder="Password"
                icon2={<Lock size={20} className='mr-2' />}
                onChange={(e) => updateForm(e, 'password')}
            />

            <CheckBox
                label='Remember Me'
                className='mb-4'
                id='rem'
                onChange={handleRememberCheck}
                checked
            />

            <Button
                className='w-full dark:bg-darkBg1'
                type='button2'
                submit
                disabled={loading ? true : false}
            >
                Login
                {loading && <SpinnerGap size={15} className="loader" />}
            </Button>

            <div className="text-center text-sm text-black/60 dark:text-white/70 underline underline-offset-4 mt-3">
                <Link href='/forgot-password' prefetch={false}>Forgot Password?</Link>
            </div>
        </form>
    )
}
 
export default LoginPage