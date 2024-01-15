"use client"

// modules
import Link from "next/link"
import { useEffect, useState } from 'react'
import { useImmer } from "use-immer"
import { useRouter } from "next/navigation"
import { useGlobalContext } from '@/lib/globalContext'
import Authenticated from "@/lib/authenticated"

// components
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

// icons
import { At, Lock, SpinnerGap, User } from "@phosphor-icons/react"

const SignupPage = () => {
    // middleware : must not be signed in to be here
    Authenticated(false, '/') // else redirect to home(/)

    const { setRefreshUser } = useGlobalContext()
    const [form, setForm] = useImmer({})
    const [errors, setErrors] = useState(null)
    const [unexpectedError, setUnexpectedError] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const updateForm = (e, input) => {
        setForm(data => {
            data[input] = e.target.value
        })
    }

    const submitForm = async e => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })

        setLoading(false)

        // clear errors
        setErrors(null)
        setUnexpectedError(null)

        // get response data
        const response = await res.json()
        
        // if validation errors is sent back
        if (Object.keys(response.validationErrors).length) {
            setErrors(response.validationErrors)
        }

        // if user created successfully
        if (response.userCreated) {
            // redirect to data collection page
            setLoading(true)
            setRefreshUser((prev) => !prev)

            // go to select feeds page
            router.push('/add-feeds')
        }

        // if any other error occur
        if (response.unexpectedError) {
            setUnexpectedError(response.unexpectedError)
        }
    }

    return (
        <form onSubmit={submitForm}>
            <div className="title">
                <h1>Sign Up</h1>
                <Link href='/login' prefetch={true}>
                    <Button size='small' className='font-semibold' type='button2'>
                        Login
                    </Button>
                </Link>
            </div>
            <p>Create your account easy with little information.</p>

            {errors?.errorCount > 0 && (
                <div className="errorHead">
                    You have <strong>{errors.errorCount}</strong> errors in your form.
                </div>
            )}

            {unexpectedError && (
                <div className="errorHead">{unexpectedError}</div>
            )}

            <div className="mb-4">
                <Input
                    noLabel
                    placeholder="Username"
                    icon={<User size={17} className='mr-2' />}
                    iconPosition='left'
                    onChange={(e) => updateForm(e, 'username')}
                />
                {errors?.username && <span className="errors">{errors.username}</span>}
            </div>

            <div className="mb-4">
                <Input
                    type='email'
                    noLabel
                    placeholder="Email"
                    icon={<At size={17} className='mr-2' />}
                    iconPosition='left'
                    onChange={(e) => updateForm(e, 'email')}
                />
                {errors?.email && <span className="errors">{errors.email}</span>}
            </div>

            <div className="mb-4">
                <Input
                    type='password'
                    noLabel
                    placeholder="Password"
                    icon2={<Lock size={20} className='mr-2' />}
                    onChange={(e) => updateForm(e, 'password')}
                />
                {errors?.password && <span className="errors">{errors.password}</span>}
            </div>

            <div className="mb-4">
                <Input
                    type='password'
                    noLabel
                    placeholder="Confirm Password"
                    icon2={<Lock size={20} className='mr-2' />}
                    onChange={(e) => updateForm(e, 'confirmPassword')}
                />
                {errors?.confirmPassword && <span className="errors">{errors.confirmPassword}</span>}
            </div>

            <Button
                className='w-full dark:bg-darkBg1'
                type='button2'
                submit
                disabled={loading ? true : false}
            >
                Create Account
                {loading && <SpinnerGap size={15} className="loader" />}
            </Button>
        </form>
    )
}
 
export default SignupPage